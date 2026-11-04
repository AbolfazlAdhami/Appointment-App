# Coding Standards

## 1. TypeScript

- از TypeScript strictness موجود پروژه پیروی کنید.
- از `any` فقط با دلیل روشن و محدوده کوچک استفاده کنید.
- نوع ورودی و خروجی Serviceها را مشخص کنید.
- داده ورودی HTTP را قابل اعتماد فرض نکنید.

## 2. API Layering

الگوی پیشنهادی:

- **Routes:** اتصال مسیر به Middleware و Controller.
- **Controllers:** دریافت درخواست، اعتبارسنجی، فراخوانی Service و ساخت پاسخ HTTP.
- **Schemas:** اعتبارسنجی runtime با Zod.
- **Services:** منطق کسب‌وکار.
- **Libraries:** اتصال‌ها و ابزارهای زیرساختی.
- **Providers:** یکپارچه‌سازی سرویس‌های خارجی مانند SMS.

## 3. Naming

- متغیرها و توابع با `camelCase`.
- کلاس‌ها و Typeها با `PascalCase`.
- ثابت‌های واقعاً ثابت با `UPPER_SNAKE_CASE`.
- نام فایل‌ها مطابق convention تثبیت‌شده همان بخش پروژه.

## 4. Error Handling

- خطاهای ورودی را از خطاهای زیرساختی جدا کنید.
- جزئیات داخلی دیتابیس را به Client ارسال نکنید.
- خطاهای unique constraint و concurrency را به پاسخ مناسب تبدیل کنید.
- از پیام‌های عمومی برای اطلاعات ورود استفاده کنید.
- در Log، Token، OTP، Password و اطلاعات پزشکی را ثبت نکنید.

## 5. Database

- تغییر schema باید migration داشته باشد.
- migration تولیدشده پیش از اجرا بازبینی شود.
- عملیات چندمرحله‌ای حساس در Transaction انجام شود.
- قیدهای دیتابیس برای invariants مهم در نظر گرفته شوند.

## 6. Pull Request / Commit

پیشنهاد پیام Commit:

```text
feat(api): add doctor profile endpoints
fix(auth): reject revoked refresh sessions
docs: add authentication architecture
test(api): cover appointment booking conflicts
```

هر Commit تا حد امکان یک هدف روشن داشته باشد. پیش از Commit، Build، تست‌های مرتبط و `git diff --check` اجرا شوند.
