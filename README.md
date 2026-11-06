# Pezeshki

سامانه نوبت‌دهی پزشک و بیمار. مستندات فنی در [`docs/README.md`](docs/README.md) قرار دارد.

> وضعیت این مستندات: نسخه اولیه قابل بازبینی  
> اصل مهم: وضعیت هر قابلیت باید با کد و migrationهای واقعی تطبیق داده شود. وجود یک سند به معنی پیاده‌سازی یا تأیید عملیاتی آن قابلیت نیست.

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

## فهرست مستندات

```text
docs/
├── README.md
├── roadmap.md
├── architecture/
│   ├── overview.md
│   ├── database-design.md
│   └── authentication.md
├── api/
│   └── auth.md
├── development/
│   ├── setup.md
│   ├── coding-standards.md
│   └── testing.md
└── deployment/
    ├── docker.md
    ├── environment.md
    └── production.md
```

## وضعیت مستندات

| سند | کاربرد |
|---|---|
| `roadmap.md` | فازها، وابستگی‌ها و معیار تکمیل |
| `architecture/overview.md` | معماری کلان Monorepo |
| `architecture/database-design.md` | اصول مدل‌سازی داده و دامنه‌ها |
| `architecture/authentication.md` | تصمیم‌های طراحی Auth و Session |
| `api/auth.md` | قرارداد فعلی Endpointهای Auth |
| `development/setup.md` | راه‌اندازی محیط توسعه |
| `development/coding-standards.md` | استانداردهای کدنویسی |
| `development/testing.md` | راهبرد تست |
| `deployment/*.md` | ملاحظات Docker، تنظیمات و Production |

## قواعد نگهداری مستندات

- هر تغییر API، schema یا رفتار امنیتی باید همراه با به‌روزرسانی سند مرتبط باشد.
- وضعیت‌ها را صادقانه ثبت کنید: `Implemented`، `Partial`، `Planned` یا `Not verified`.
- هیچ Secret، Token واقعی، OTP واقعی یا داده شخصی واقعی در مستندات و Git قرار ندهید.
- مثال‌های این اسناد صرفاً داده ساختگی هستند.
- مسیرها و نام متغیرهای محیطی را پیش از استفاده با کد واقعی تطبیق دهید.
- تصمیم‌های معماری مهم را با تاریخ، زمینه و پیامدها ثبت کنید.

## وضعیت فعلی شناخته‌شده

- Monorepo شامل `apps/api`، `apps/web`، `apps/admin` و `packages/types` است.
- API بر پایه Express 5، TypeScript، Prisma 7 و PostgreSQL توسعه داده می‌شود.
- احراز هویت پایه شامل ثبت‌نام بیمار با OTP، ورود ایمیل/رمز عبور، Access JWT، Refresh Cookie و Session دیتابیسی پیاده‌سازی و به‌صورت دستی آزمایش شده است.
- OTP Login، Password Reset، Email Verification، تست خودکار کامل و سخت‌سازی Production هنوز نیازمند تکمیل/تأیید هستند.

این اطلاعات باید در هر Release با وضعیت واقعی کد بازبینی شوند.
