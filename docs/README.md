# Pezeshki Documentation

مستندات فنی پروژه Pezeshki — سامانه نوبت‌دهی پزشک و بیمار.

> هر وضعیت باید با کد و migrationهای واقعی تطبیق داده شود. وجود یک سند به معنی پیاده‌سازی یا تأیید عملیاتی قابلیت نیست.

## شروع مطالعه

1. [نقشه راه](roadmap.md)
2. [نمای معماری](architecture/overview.md)
3. [راه‌اندازی توسعه](development/setup.md)
4. [قرارداد API احراز هویت](api/auth.md) و [معماری Authentication](architecture/authentication.md)

## فهرست

| سند | کاربرد |
|---|---|
| `roadmap.md` | فازها، وابستگی‌ها و معیار تکمیل |
| `architecture/overview.md` | معماری Monorepo |
| `architecture/database-design.md` | اصول مدل داده |
| `architecture/authentication.md` | طراحی Auth و Session |
| `api/auth.md` | قرارداد Endpointهای Auth |
| `development/setup.md` | نصب و اجرای محیط توسعه |
| `development/coding-standards.md` | استانداردهای کدنویسی |
| `development/testing.md` | راهبرد تست |
| `deployment/*.md` | Docker، Environment و Production |

## قواعد مستندات

- هر تغییر API، schema یا رفتار امنیتی باید همراه با به‌روزرسانی سند مرتبط باشد.
- از وضعیت‌های صادقانه `Implemented`، `Partial`، `Planned` یا `Not verified` استفاده کنید.
- Secret، Token واقعی، OTP واقعی یا داده شخصی واقعی را در مستندات و Git قرار ندهید.
- مسیرها، scriptها و نام متغیرهای محیطی را با کد تطبیق دهید.

## وضعیت فعلی

- Monorepo شامل `apps/api`, `apps/web`, `apps/admin` و `packages/*` است.
- API از Express 5، TypeScript، Prisma 7 و PostgreSQL استفاده می‌کند.
- ثبت‌نام OTP، ورود ایمیل/رمز عبور و OTP، JWT، Refresh Cookie و Session دیتابیسی پیاده‌سازی شده و تست‌های فعلی در راهبرد [Testing](development/testing.md) اجرا می‌شوند.
- Password Reset و Phone Verification کامل نیستند. Migration status محیط توسعه نیز pending migration گزارش کرده است؛ قبل از هر migrate روی داده موجود، SQL را بازبینی و backup تهیه کنید.