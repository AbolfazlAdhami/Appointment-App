import type { Readable } from "node:stream";

export interface StoredObject {
  body: Readable;
  contentLength?: number;
  contentType?: string;
}

export interface ObjectStorageProvider {
  ensureBucket(): Promise<void>;
  putObject(input: { key: string; body: Buffer; contentType: string }): Promise<void>;
  getObject(key: string): Promise<StoredObject | null>;
  deleteObject(key: string): Promise<void>;
}