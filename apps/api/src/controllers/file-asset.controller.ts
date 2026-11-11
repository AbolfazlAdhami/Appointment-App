import { Readable } from "node:stream";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { FileAssetError, getPrivateFile, uploadPrivateFile } from "../services/file-asset.service";

function sendFileError(res: Response, error: unknown): void {
  if (error instanceof FileAssetError) {
    const status = error.code === "TOO_LARGE" ? 413 : error.code === "FORBIDDEN" ? 403 : error.code === "NOT_FOUND" ? 404 : 400;
    res.status(status).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: "Unable to process file" });
}

export async function uploadFile(req: Request, res: Response): Promise<void> {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const body = req.body;
  if (!Buffer.isBuffer(body)) {
    res.status(400).json({ message: "Send the file as a binary request body" });
    return;
  }

  try {
    const asset = await uploadPrivateFile({
      ownerUserId: user.userId,
      originalName: req.header("X-File-Name") ?? "upload",
      contentType: req.header("Content-Type")?.split(";")[0].trim().toLowerCase() ?? "",
      body,
    });
    res.status(201).json({ file: asset });
  } catch (error) {
    sendFileError(res, error);
  }
}

export async function downloadFile(req: Request, res: Response): Promise<void> {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    const fileId = req.params.fileId;
    if (typeof fileId !== "string") {
      res.status(400).json({ message: "Invalid file identifier" });
      return;
    }

    const file = await getPrivateFile({ assetId: fileId, requesterUserId: user.userId });
    res.setHeader("Content-Type", file.contentType);
    res.setHeader("Content-Length", file.contentLength);
    const safeFileName = encodeURIComponent(file.originalName).replace(/['()]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    Readable.from(file.body).pipe(res);
  } catch (error) {
    sendFileError(res, error);
  }
}
