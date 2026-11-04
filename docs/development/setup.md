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

فایل Environment محلی را مطابق نمونه‌ای که تیم نگهداری می‌کند بسازید. هیچ مقدار Secret را در Git قرار ندهید.

برای API حداقل موارد زیر را بررسی کنید:
- اتصال PostgreSQL.
- Secret مربوط به JWT.
- Secret مربوط به OTP.
- انتخاب SMS provider در Development.
- Port و `NODE_ENV`.

نام دقیق متغیرها را از `apps/api/src/config/env.ts` و فایل‌های نمونه استخراج کنید.

## 4. Database

اگر از Docker Compose استفاده می‌کنید، دستورهای واقعی را از فایل Compose پروژه بردارید.

پس از آماده شدن PostgreSQL، از مسیر API:

```bash
cd apps/api
npx prisma validate
npx prisma migrate status
```

برای اعمال migrationهای موجود در محیط توسعه، ابتدا SQL و وضعیت دیتابیس را بررسی کنید و سپس از دستور migration متناسب با workflow پروژه استفاده کنید.

از `prisma migrate reset` روی دیتابیسی که داده لازم دارد استفاده نکنید.

## 5. Run API

از ریشه Monorepo یا مسیر API، مطابق scriptهای واقعی package:

```bash
npm run dev --workspace=@appointment/api
```

اگر نام workspace یا script تغییر کرده است، `apps/api/package.json` مرجع نهایی است.

## 6. Build

```bash
npm run build
```

این دستور باید با scriptهای workspace ریشه هماهنگ باشد. در صورت تفاوت، scriptهای packageها را جداگانه اجرا کنید.

## 7. Troubleshooting

- اتصال دیتابیس: `DATABASE_URL`، Port و وضعیت Container را بررسی کنید.
- Prisma Client: پس از تغییر schema، Client را طبق نسخه Prisma پروژه Generate کنید.
- Migration: `migrate status` را بررسی و SQL جدید را قبل از اعمال بازبینی کنید.
- API Port: مقدار Environment و لاگ Startup را بررسی کنید.
- SMS: در Development از Mock Provider استفاده کنید و کد تست را فقط در ترمینال محلی ببینید.
