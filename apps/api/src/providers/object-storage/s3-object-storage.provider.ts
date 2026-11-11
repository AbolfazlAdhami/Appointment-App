import { CreateBucketCommand, HeadBucketCommand, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { Readable } from "node:stream";
import { env } from "../../config/env";
import type { ObjectStorageProvider, StoredObject } from "./object-storage.provider";

function isMissingBucket(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("name" in error)) return false;
  return ["NotFound", "NoSuchBucket", "NoSuchKey"].includes(String(error.name));
}

export class S3ObjectStorageProvider implements ObjectStorageProvider {
  private readonly client: S3Client;

  constructor(
    private readonly bucket: string,
    options: { endpoint: string; region: string; accessKey: string; secretKey: string; forcePathStyle: boolean },
  ) {
    this.client = new S3Client({
      endpoint: options.endpoint,
      region: options.region,
      forcePathStyle: options.forcePathStyle,
      credentials: {
        accessKeyId: options.accessKey,
        secretAccessKey: options.secretKey,
      },
    });
  }

  async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch (error) {
      if (!isMissingBucket(error)) throw error;
      try {
        await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
      } catch (createError) {
        // Concurrent API workers can both observe a missing bucket. Treat an
        // already-created bucket as success; rethrow unrelated storage errors.
        if (typeof createError !== "object" || createError === null || !("$metadata" in createError)) throw createError;
        const statusCode = (createError.$metadata as { httpStatusCode?: number }).httpStatusCode;
        if (statusCode !== 409) throw createError;
      }
    }
  }

  async putObject(input: { key: string; body: Buffer; contentType: string }): Promise<void> {
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      ContentLength: input.body.byteLength,
    }));
  }

  async getObject(key: string): Promise<StoredObject | null> {
    try {
      const response = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
      if (!response.Body) return null;

      return {
        body: response.Body as unknown as Readable,
        contentLength: response.ContentLength,
        contentType: response.ContentType,
      };
    } catch (error) {
      if (isMissingBucket(error)) return null;
      throw error;
    }
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}

let provider: ObjectStorageProvider | undefined;

export function getObjectStorageProvider(): ObjectStorageProvider {
  if (!env.objectStorage.configured || !env.objectStorage.endpoint || !env.objectStorage.bucket || !env.objectStorage.accessKey || !env.objectStorage.secretKey) {
    throw new Error("Object storage is not configured");
  }

  provider ??= new S3ObjectStorageProvider(env.objectStorage.bucket, {
    endpoint: env.objectStorage.endpoint,
    region: env.objectStorage.region,
    accessKey: env.objectStorage.accessKey,
    secretKey: env.objectStorage.secretKey,
    forcePathStyle: env.objectStorage.forcePathStyle,
  });

  return provider;
}