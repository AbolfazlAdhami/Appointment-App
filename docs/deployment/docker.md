# Docker & Local Infrastructure

## 1. Purpose

Docker برای اجرای قابل تکرار سرویس‌های زیرساختی و در صورت نیاز بسته‌بندی برنامه استفاده می‌شود.

## 2. Local PostgreSQL

تنظیمات فعلی محیط توسعه که قبلاً گزارش شده:
- PostgreSQL در Docker.
- Port میزبان: `5433`.
- Port داخل Container: `5432`.
- Database: `pezeshki`.

این مقادیر نمونه محیط توسعه‌اند و باید با Compose و `DATABASE_URL` واقعی تطبیق داده شوند.

## 3. Local S3-compatible object storage

محیط توسعه از LocalStack با سرویس S3 در `http://127.0.0.1:4566` استفاده می‌کند؛ داده‌ها در volume مستقل `object_storage_data` باقی می‌مانند. این جایگزین MinIO نیست و فقط برای توسعه/تست محلی است. API از AWS SDK و قرارداد S3 استفاده می‌کند؛ برای production باید endpoint و credentialهای S3-compatible امن و مستقل تنظیم شوند.

1. از root اجرا کنید: `docker compose up -d object-storage`.
2. در `apps/api/.env` مقدارهای بخش Object Storage در `apps/api/.env.example` را تنظیم کنید.
3. Bucket در اولین استفاده توسط API ساخته می‌شود؛ فایل‌ها private هستند.
4. هرگز `docker compose down -v` را روی محیطی که فایل‌های لازم دارد اجرا نکنید؛ volume حذف‌شده معادل حذف فایل‌هاست.

مخزن upstream MinIO در زمان بررسی archive شده و image tag موردنظر قابل pull نبود؛ ازاین‌رو Compose توسعه به LocalStack تغییر کرده است. LocalStack storage production نیست.

## 4. Recommendations

- برای سرویس‌های محلی از Docker Compose استفاده کنید.
- Volume پایدار برای داده PostgreSQL تعریف کنید.
- Healthcheck برای دیتابیس داشته باشید.
- رمزها را از فایل Compose عمومی خارج کنید.
- نسخه imageها را pin کنید.
- برای محیط Production از imageهای قابل بازتولید و کم‌حجم استفاده کنید.

## 5. Operational Safety

- حذف Container به معنی حذف Volume نیست؛ قبل از هر عملیات پاک‌سازی مقصد را بررسی کنید.
- برای داده موردنیاز Backup بگیرید.
- Restore را دوره‌ای آزمایش کنید.
- دیتابیس Production را با تنظیمات Development اجرا نکنید.
