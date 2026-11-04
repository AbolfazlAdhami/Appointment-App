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

## 3. Recommendations

- برای سرویس‌های محلی از Docker Compose استفاده کنید.
- Volume پایدار برای داده PostgreSQL تعریف کنید.
- Healthcheck برای دیتابیس داشته باشید.
- رمزها را از فایل Compose عمومی خارج کنید.
- نسخه imageها را pin کنید.
- برای محیط Production از imageهای قابل بازتولید و کم‌حجم استفاده کنید.

## 4. Operational Safety

- حذف Container به معنی حذف Volume نیست؛ قبل از هر عملیات پاک‌سازی مقصد را بررسی کنید.
- برای داده موردنیاز Backup بگیرید.
- Restore را دوره‌ای آزمایش کنید.
- دیتابیس Production را با تنظیمات Development اجرا نکنید.
