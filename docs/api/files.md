# Private File API

**Status:** Initial authenticated upload/download implementation. Object storage is S3-compatible; production storage, malware scanning, and domain-specific sharing policies must be configured separately.

## Endpoints

### Upload

`POST /api/files`

- Requires `Authorization: Bearer <access-token>`.
- Send raw binary bytes as the request body. `Content-Type` must match a supported type and the file signature: JPEG, PNG, WebP, MP4, or PDF.
- `X-File-Name` optionally supplies the display filename.
- Max body size is configured by `OBJECT_STORAGE_MAX_FILE_SIZE_BYTES` (default 25 MiB).
- Success: `201` with safe file metadata and an opaque `id`. Storage keys and bucket locations are never returned.
- `400`: unsupported/mismatched content; `413`: limit exceeded; `401`: unauthenticated.

### Download

`GET /api/files/:fileId`

- Requires authentication and the requester must own the asset. Roles do not bypass ownership.
- The API streams the object with `Cache-Control: private, no-store` and `X-Content-Type-Options: nosniff`; it does not issue public URLs.
- `403`: asset belongs to another user; `404`: metadata or object missing.

## Storage

File bytes are stored in a private S3-compatible bucket; only metadata is stored in PostgreSQL `FileAsset`. Storage keys are generated server-side. Upload computes a SHA-256 checksum and compensates by deleting the object if metadata persistence fails.

Development uses LocalStack S3 at `http://127.0.0.1:4566`, not production MinIO or production storage. The bucket is auto-created. Production must use an HTTPS S3-compatible service, private bucket, least-privilege credentials and independent backups.

## Important limitations

- Access is owner-only for now. Doctor-patient relationship sharing, admin review permissions and medical-document-specific rules are not implemented.
- Content validation checks MIME allowlist and file signatures; it is not antivirus/malware scanning. Add scanning/quarantine before accepting untrusted medical documents in production.
- Upload currently buffers one bounded file in memory. Large videos need multipart/resumable streaming and separate limits.
- Object encryption at rest, retention/deletion workflow, audit of sensitive downloads and backup/restore tests remain deployment requirements.