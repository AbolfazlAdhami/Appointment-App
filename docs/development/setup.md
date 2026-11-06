# Development Setup

## 1. Prerequisites

نسخه‌های دقیق را با `package.json` و lockfile پروژه تطبیق دهید:

- Node.js سازگار با پروژه.
- npm و پشتیبانی npm workspaces.
- Docker Desktop یا PostgreSQL محلی.
- Git.
- ابزارهای Prisma CLI و TypeScript که در dependencies پروژه نصب هستند.

## 2. Repository

```bash
git clone <repository-url>
cd Pezeshki
npm install
```

## 3. Environment

از ریشه پروژه، فایل متغیرهای محلی را بسازید:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

برای تست‌ها، API انتظار دارد `apps/api/.env.test` به دیتابیس مجزای `pezeshki_test` اشاره کند. فایل‌های Environment واقعی ignore می‌شوند؛ هیچ Secret را Commit نکنید. برای تولید Secretهای محلی از `openssl rand -hex 32` استفاده کنید.

برای API حداقل موارد زیر را بررسی کنید:
- اتصال PostgreSQL.
- Secret مربوط به JWT.
- Secret مربوط به OTP.
- انتخاب SMS provider در Development.
- Port و `NODE_ENV`.

نام دقیق متغیرها را از `apps/api/src/config/env.ts` و فایل‌های نمونه استخراج کنید.

## 4. Database

از ریشه پروژه PostgreSQL محلی را بالا بیاورید:

```bash
docker compose up -d postgres
```

پس از آماده شدن PostgreSQL، از مسیر API:

```bash
npm run db:validate
npm run db:migrate:status
```

پس از بازبینی SQL و اطمینان از اتصال به دیتابیس توسعه، برای ساخت/اعمال migration اجرا کنید:

```bash
npm run db:migrate:dev --workspace=@appointment/api
```

**مهم:** migrationهای فعلی شامل تغییرات schema بزرگ و دست‌ریزی احتمالی هستند. پیش از اعمال روی دیتابیس دارای داده، backup بگیرید و SQL را کامل بازبینی کنید. از `prisma migrate reset` روی دیتابیسی که داده لازم دارد استفاده نکنید.

## 5. Run API

از ریشه Monorepo یا مسیر API، مطابق scriptهای واقعی package:

```bash
npm run dev --workspace=@appointment/api
```

اگر نام workspace یا script تغییر کرده است، `apps/api/package.json` مرجع نهایی است.

## 6. Quality checks

```bash
npm run build
npm test
npm run lint
npm run db:validate
```

برای backup/restore محلی از `npm run db:backup` و `npm run db:restore -- <file.dump>` استفاده کنید. Restore تعاملی است و نام دیتابیس مقصد را برای تأیید می‌خواهد. این دستورات به `pg_dump` و `pg_restore` نیاز دارند.

## 7. Troubleshooting

- اتصال دیتابیس: `DATABASE_URL`، Port و وضعیت Container را بررسی کنید.
- Prisma Client: پس از تغییر schema، Client را طبق نسخه Prisma پروژه Generate کنید.
- Migration: `migrate status` را بررسی و SQL جدید را قبل از اعمال بازبینی کنید.
- API Port: مقدار Environment و لاگ Startup را بررسی کنید.
- SMS: در Development از Mock Provider استفاده کنید و کد تست را فقط در ترمینال محلی ببینید.
