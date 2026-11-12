import { beforeEach, describe, expect, it, vi } from "vitest";

const storageMock = vi.hoisted(() => ({
  ensureBucket: vi.fn(),
  putObject: vi.fn(),
  getObject: vi.fn(),
  deleteObject: vi.fn(),
}));

const prismaMock = vi.hoisted(() => ({
  fileAsset: {
    create: vi.fn(),
    findUnique: vi.fn(),
  },
}));

vi.mock("../../providers/object-storage/s3-object-storage.provider", () => ({
  getObjectStorageProvider: () => storageMock,
}));
vi.mock("../../libs/prisma", () => ({ prisma: prismaMock }));

import { FileAssetError, getPrivateFile, uploadPrivateFile } from "../file-asset.service";

const smallPng = Buffer.from("89504e470d0a1a0a00000000", "hex");

describe("Private file asset service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storageMock.ensureBucket.mockResolvedValue(undefined);
    storageMock.putObject.mockResolvedValue(undefined);
    storageMock.deleteObject.mockResolvedValue(undefined);
  });

  it("stores a private object and metadata without exposing its storage key", async () => {
    prismaMock.fileAsset.create.mockResolvedValue({
      id: "asset-1",
      originalName: "scan.png",
      mimeType: "image/png",
      sizeBytes: BigInt(smallPng.length),
      checksum: "checksum",
      isPrivate: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    const result = await uploadPrivateFile({
      ownerUserId: "user-1",
      originalName: "scan.png",
      contentType: "image/png",
      body: smallPng,
    });

    expect(storageMock.putObject).toHaveBeenCalledWith(expect.objectContaining({
      key: expect.stringMatching(/^user-1\//),
      body: smallPng,
      contentType: "image/png",
    }));
    expect(prismaMock.fileAsset.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ ownerUserId: "user-1", isPrivate: true, mimeType: "image/png" }),
    }));
    expect(result).not.toHaveProperty("storageKey");
    expect(result.sizeBytes).toBe(String(smallPng.length));
  });

  it("rejects MIME spoofing and unsupported types before storage access", async () => {
    await expect(uploadPrivateFile({
      ownerUserId: "user-1",
      originalName: "fake.png",
      contentType: "image/png",
      body: Buffer.from("not a png"),
    })).rejects.toMatchObject({ code: "INVALID_FILE" });
    expect(storageMock.putObject).not.toHaveBeenCalled();
  });

  it("removes the object if metadata persistence fails", async () => {
    prismaMock.fileAsset.create.mockRejectedValue(new Error("database unavailable"));

    await expect(uploadPrivateFile({
      ownerUserId: "user-1",
      originalName: "scan.png",
      contentType: "image/png",
      body: smallPng,
    })).rejects.toThrow("database unavailable");

    expect(storageMock.deleteObject).toHaveBeenCalledOnce();
  });

  it("rejects access by a different user before contacting object storage", async () => {
    prismaMock.fileAsset.findUnique.mockResolvedValue({
      ownerUserId: "owner-1",
      storageKey: "owner-1/key",
      originalName: "scan.png",
      mimeType: "image/png",
      sizeBytes: BigInt(smallPng.length),
      isPrivate: true,
    });

    await expect(getPrivateFile({ assetId: "asset-1", requesterUserId: "attacker" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(storageMock.getObject).not.toHaveBeenCalled();
  });

  it("does not grant access to a non-owner merely because the asset is marked non-private", async () => {
    prismaMock.fileAsset.findUnique.mockResolvedValue({
      ownerUserId: "owner-1",
      storageKey: "owner-1/key",
      originalName: "scan.png",
      mimeType: "image/png",
      sizeBytes: BigInt(smallPng.length),
      isPrivate: false,
    });

    await expect(getPrivateFile({ assetId: "asset-1", requesterUserId: "admin-user" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(storageMock.getObject).not.toHaveBeenCalled();
  });

  it("returns a private file stream only for its owner", async () => {
    const stream = {} as NodeJS.ReadableStream;
    prismaMock.fileAsset.findUnique.mockResolvedValue({
      ownerUserId: "owner-1",
      storageKey: "owner-1/key",
      originalName: "scan.png",
      mimeType: "image/png",
      sizeBytes: BigInt(smallPng.length),
      isPrivate: true,
    });
    storageMock.getObject.mockResolvedValue({ body: stream });

    const result = await getPrivateFile({ assetId: "asset-1", requesterUserId: "owner-1" });
    expect(result.body).toBe(stream);
    expect(result.contentType).toBe("image/png");
  });
});