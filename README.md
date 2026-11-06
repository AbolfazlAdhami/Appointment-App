# Pezeshki

سامانه نوبت‌دهی پزشک و بیمار. مستندات فنی در [`docs/README.md`](docs/README.md) قرار دارد.

> وضعیت، محدودیت‌ها و نقشه راه جاری در [`docs/README.md`](docs/README.md) و [`docs/roadmap.md`](docs/roadmap.md) نگهداری می‌شود.

## شروع سریع توسعه

```bash
npm install
cp .env.example .env
cp apps/api/.env.example apps/api/.env
docker compose up -d postgres
npm run build
npm test
```

سپس متغیرهای `DATABASE_URL`, `JWT_SECRET`, `OTP_SECRET` را در `apps/api/.env` تنظیم و از [راهنمای کامل توسعه](docs/development/setup.md) برای migration و اجرای API استفاده کنید. پیش از اعمال migration روی دیتابیس دارای داده، SQL را بازبینی و backup تهیه کنید.

برای نقشه راه، معماری و مستندات API به [`docs/README.md`](docs/README.md) مراجعه کنید.

## مستندات

برای فهرست و وضعیت اسناد، [docs/README.md](docs/README.md) را ببینید. برای فازها و کارهای باز، مرجع رسمی [docs/roadmap.md](docs/roadmap.md) است.
