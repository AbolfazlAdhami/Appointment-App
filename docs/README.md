# Pezeshki Documentation

مستندات فنی پروژه Pezeshki — سامانه نوبت‌دهی پزشک و بیمار.

> هر وضعیت باید با کد و migrationهای واقعی تطبیق داده شود. وجود یک سند به معنی پیاده‌سازی یا تأیید عملیاتی قابلیت نیست.

## شروع مطالعه

1. [نقشه راه](roadmap.md)
2. [نمای معماری](architecture/overview.md)
3. [راه‌اندازی توسعه](development/setup.md)
4. [قرارداد API احراز هویت](api/auth.md)، [API فایل](api/files.md)، [API مدیریت وضعیت حساب توسط Admin](api/admin-users.md) و [معماری Authentication](architecture/authentication.md)

## فهرست

| سند | کاربرد |
|---|---|
| `roadmap.md` | فازها، وابستگی‌ها و معیار تکمیل |
| `architecture/overview.md` | معماری Monorepo |
| `architecture/database-design.md` | اصول مدل داده |
| `architecture/authentication.md` | طراحی Auth و Session |
| `architecture/authorization-policy.md` | سیاست دسترسی پایه Phase 2 و محدودیت‌های مالکیت |
| `api/auth.md` | قرارداد Endpointهای Auth |
| `api/files.md` | قرارداد آپلود/دانلود فایل خصوصی |
| `api/admin-users.md` | قرارداد مدیریت فعال/غیرفعال‌سازی حساب توسط Admin |
| `development/setup.md` | نصب و اجرای محیط توسعه |
| `development/coding-standards.md` | استانداردهای کدنویسی |
| `development/testing.md` | راهبرد تست |
| `deployment/*.md` | Docker، Environment و Production |

## قواعد مستندات

- هر تغییر API، schema یا رفتار امنیتی باید همراه با به‌روزرسانی سند مرتبط باشد.
- از وضعیت‌های صادقانه `Implemented`، `Partial`، `Planned` یا `Not verified` استفاده کنید.
- Secret، Token واقعی، OTP واقعی یا داده شخصی واقعی را در مستندات و Git قرار ندهید.
- مسیرها، scriptها و نام متغیرهای محیطی را با کد تطبیق دهید.

## وضعیت فعلی (بازبینی 2026-11-07)

- Monorepo شامل `apps/api`, `apps/web`, `apps/admin` و `packages/*` است.
- API از Express 5، TypeScript، Prisma 7 و PostgreSQL استفاده می‌کند.
- ثبت‌نام OTP، ورود ایمیل/رمز عبور و OTP، JWT، Refresh Cookie و Session دیتابیسی پیاده‌سازی شده؛ آخرین اجرای suite: 4 فایل و 19 تست موفق.
- Password Reset، Phone Verification و HTTP rate limiting کامل نیستند.
- `prisma validate` موفق بوده؛ `prisma migrate status` در محیط توسعه یک migration pending گزارش کرده است. جزئیات و هشدار تغییرات destructive در [نقشه راه](roadmap.md) ثبت شده. Migrationها روی دیتابیس دارای داده اعمال نشده‌اند.
- Lint اجرا نشده/ناموفق است، چون نصب محلی dependency مربوط به ESLint ناقص است؛ build و typecheck موفق بوده‌اند.