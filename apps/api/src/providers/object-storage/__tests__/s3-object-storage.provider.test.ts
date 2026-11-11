import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { S3ObjectStorageProvider } from "../s3-object-storage.provider";

const objects = new Map<string, { body: Buffer; contentType: string }>();
let server: ReturnType<typeof createServer>;
let endpoint: string;

function respond(res: ServerResponse, status: number, body = ""): void {
  res.statusCode = status;
  res.end(body);
}

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function keyFromRequest(req: IncomingMessage): string {
  // forcePathStyle requests use /bucket/key; the bucket is fixed by this test.
  const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
  return decodeURIComponent(pathname.replace(/^\/test-bucket\//, ""));
}

describe("S3ObjectStorageProvider", () => {
  beforeAll(async () => {
    server = createServer(async (req, res) => {
      const path = req.url ?? "/";
      if (req.method === "HEAD" && path === "/test-bucket") return respond(res, 200);
      if (req.method === "PUT" && path === "/test-bucket") return respond(res, 200);

      const key = keyFromRequest(req);
      if (req.method === "PUT") {
        const body = await readBody(req);
        objects.set(key, { body, contentType: req.headers["content-type"] ?? "application/octet-stream" });
        return respond(res, 200);
      }
      if (req.method === "GET") {
        const object = objects.get(key);
        if (!object) return respond(res, 404, "<Error><Code>NoSuchKey</Code></Error>");
        res.setHeader("Content-Type", object.contentType);
        res.setHeader("Content-Length", object.body.length);
        res.statusCode = 200;
        return res.end(object.body);
      }
      if (req.method === "DELETE") {
        objects.delete(key);
        return respond(res, 204);
      }
      return respond(res, 404);
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address() as AddressInfo;
    endpoint = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });

  it("creates a bucket, stores, retrieves and deletes objects through S3 API", async () => {
    const storage = new S3ObjectStorageProvider("test-bucket", {
      endpoint,
      region: "us-east-1",
      accessKey: "test",
      secretKey: "test",
      forcePathStyle: true,
    });

    await storage.ensureBucket();
    await storage.putObject({ key: "user/key", body: Buffer.from("sample"), contentType: "text/plain" });

    const stored = await storage.getObject("user/key");
    expect(stored).not.toBeNull();
    const chunks: Buffer[] = [];
    for await (const chunk of stored!.body) chunks.push(Buffer.from(chunk));
    expect(Buffer.concat(chunks).toString()).toBe("sample");
    expect(stored?.contentType).toBe("text/plain");

    await storage.deleteObject("user/key");
    await expect(storage.getObject("user/key")).resolves.toBeNull();
  });
});