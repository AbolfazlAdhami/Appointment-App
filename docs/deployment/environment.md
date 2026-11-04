# Environment Configuration

## 1. Principles

- فایل‌های `.env` محلی نباید Commit شوند.
- `.env.example` فقط باید نام متغیرها و مقدارهای placeholder داشته باشد.
- Secretها باید در Secret Manager محیط اجرا نگهداری شوند.
- برای Development، Test و Production تنظیمات جدا داشته باشید.

## 2. Configuration Categories

نام دقیق کلیدها باید با Environment schema برنامه تطبیق داده شود.

| Category | Examples |
|---|---|
| Runtime | `NODE_ENV`, `PORT` |
| Database | `DATABASE_URL` |
| JWT | `JWT_SECRET`, token expiry |
| OTP | OTP HMAC secret, expiry, limits |
| SMS | provider selection, API key, sender number |
| Web security | CORS origins, cookie settings |

## 3. Validation

- برنامه باید در Startup تنظیمات ضروری را validate کند.
- در Production، Secret خالی یا مقدار Development نباید پذیرفته شود.
- Mock SMS در Production باید ممنوع باشد.
- مقدار Secret نباید در خطای validation چاپ شود.

## 4. Rotation

برای JWT، OTP و Provider credentials فرآیند تعویض Secret تعریف کنید. تغییر Secret باید با اثر آن بر Sessionها و OTPهای فعال هماهنگ باشد.
