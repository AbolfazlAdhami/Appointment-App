import { createHash, randomUUID } from "node:crypto";
import { basename } from "node:path";
import { prisma } from "../libs/prisma";
import { env } from "../config/env";
import { getObjectStorageProvider } from "../providers/object-storage/s3-object-storage.provider";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "video/mp4", "application/pdf"]);

function matchesFileSignature(contentType: string, file: Buffer): boolean {
  if (contentType === "image/jpeg") return file.length >= 3 && file[0] === 0xff && file[1] === 0xd8 && file[2] === 0xff;
  if (contentType === "image/png") return file.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (contentType === "image/webp") return file.length >= 12 && file.toString("ascii", 0, 4) === "RIFF" && file.toString("ascii", 8, 12) === "WEBP";
  if (contentType === "application/pdf") return file.subarray(0, 5).toString("ascii") === "%PDF-";
  if (contentType === "video/mp4") return file.length >= 12 && file.toString("ascii", 4, 8) === "ftyp";
  return false;
}

function sanitizeOriginalName(name: string): string {
  const safeName = basename(name).replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return safeName.slice(0, 255) || "upload";
}

export class FileAssetError extends Error {
  constructor(public readonly code: "INVALID_FILE" | "TOO_LARGE" | "NOT_FOUND" | "FORBIDDEN", message: string) {
    super(message);
    this.name = "FileAssetError";
  }
}

export async function uploadPrivateFile(input: { ownerUserId: string; originalName: string; contentType: string; body: Buffer }) {
  if (!Buffer.isBuffer(input.body) || input.body.byteLength === 0) {
    throw new FileAssetError("INVALID_FILE", "File content is required");
  }
  if (input.body.byteLength > env.objectStorage.maxFileSizeBytes) {
    throw new FileAssetError("TOO_LARGE", "File exceeds the maximum allowed size");
  }
  if (!ALLOWED_TYPES.has(input.contentType) || !matchesFileSignature(input.contentType, input.body)) {
    throw new FileAssetError("INVALID_FILE", "Unsupported file type or invalid file content");
  }

  const key = `${input.ownerUserId}/${randomUUID()}`;
  const checksum = createHash("sha256").update(input.body).digest("hex");
  const storage = getObjectStorageProvider();
  await storage.ensureBucket();
  await storage.putObject({ key, body: input.body, contentType: input.contentType });

  try {
    const asset = await prisma.fileAsset.create({
      data: {
        ownerUserId: input.ownerUserId,
        storageKey: key,
        originalName: sanitizeOriginalName(input.originalName),
        mimeType: input.contentType,
        sizeBytes: BigInt(input.body.byteLength),
        checksum,
        isPrivate: true,
      },
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        sizeBytes: true,
        checksum: true,
        isPrivate: true,
        createdAt: true,
      },
    });

    return { ...asset, sizeBytes: asset.sizeBytes.toString() };
  } catch (error) {
    await storage.deleteObject(key).catch(() => undefined);
    throw error;
  }
}

export async function getPrivateFile(input: { assetId: string; requesterUserId: string }) {
  const asset = await prisma.fileAsset.findUnique({
    where: { id: input.assetId },
    select: {
      ownerUserId: true,
      storageKey: true,
      originalName: true,
      mimeType: true,
      sizeBytes: true,
      isPrivate: true,
    },
  });

  if (!asset) throw new FileAssetError("NOT_FOUND", "File not found");
  // Until domain relationships are explicitly modelled in policy, deny access to
  // every non-owner, including Admin/Doctor roles. Role alone is not ownership.
  if (asset.ownerUserId !== input.requesterUserId) {
    throw new FileAssetError("FORBIDDEN", "Access to this file is forbidden");
  }

  const stored = await getObjectStorageProvider().getObject(asset.storageKey);
  if (!stored) throw new FileAssetError("NOT_FOUND", "File not found");

  return {
    body: stored.body,
    originalName: asset.originalName,
    contentType: asset.mimeType,
    contentLength: Number(asset.sizeBytes),
  };
}