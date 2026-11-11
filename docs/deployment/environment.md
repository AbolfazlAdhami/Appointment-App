# Environment Configuration

## 1. Principles

- فایل‌های `.env` محلی نباید Commit شوند.
- `.env.example` فقط باید نام متغیرها و مقدارهای placeholder داشته باشد.
- Secretها باید در Secret Manager محیط اجرا نگهداری شوند.
- برای Development، Test و Production تنظیمات جدا داشته باشید.

## 2. Configuration Categories

API متغیرها را از `apps/api/.env` می‌خواند (برای تست `apps/api/.env.test`). نام‌های مورد استفاده:

| Category | Examples |
|---|---|
| Runtime | `NODE_ENV`, `PORT` |
| Database | `DATABASE_URL` |
| JWT | `JWT_SECRET`, token expiry |
| OTP | OTP HMAC secret, expiry, limits |
| SMS | provider selection, API key, sender number |
| Web security | CORS origins, cookie settings |
| Object storage | S3 endpoint, bucket, region, credentials, upload size |

کلیدهای مشخص شامل `DATABASE_URL`, `JWT_SECRET`, `OTP_SECRET`, `ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_TTL_SECONDS`, `OTP_EXPIRES_IN_SECONDS`, `OTP_MAX_ATTEMPTS`, `OTP_RESEND_COOLDOWN_SECONDS`, `OTP_DAILY_LIMIT`, `SMS_PROVIDER`, `LIMOSMS_API_KEY`, `LIMOSMS_SENDER_NUMBER` و `CORS_ORIGINS` هستند.

برای فایل‌ها: `OBJECT_STORAGE_ENDPOINT`, `OBJECT_STORAGE_REGION`, `OBJECT_STORAGE_BUCKET`, `OBJECT_STORAGE_ACCESS_KEY`, `OBJECT_STORAGE_SECRET_KEY`, `OBJECT_STORAGE_FORCE_PATH_STYLE` و `OBJECT_STORAGE_MAX_FILE_SIZE_BYTES`. endpoint و credentialها باید با هم تنظیم شوند؛ production الزاماً HTTPS می‌خواهد. Credentialهای نمونه فقط برای LocalStack محلی هستند.

## 3. Validation

- برنامه باید در Startup تنظیمات ضروری را validate کند.
- در Production، Secret خالی یا مقدار Development نباید پذیرفته شود.
- Mock SMS در Production باید ممنوع باشد.
- مقدار Secret نباید در خطای validation چاپ شود.

## 4. Rotation

برای JWT، OTP و Provider credentials فرآیند تعویض Secret تعریف کنید. تغییر Secret باید با اثر آن بر Sessionها و OTPهای فعال هماهنگ باشد.
