# Pezeshki — Product & Engineering Roadmap

**نوع سند:** نقشه راه فنی و محصول  
**وضعیت:** پیشنهادی و قابل بازبینی  
**آخرین بازبینی:** 2026-11-07

## 1. چشم‌انداز محصول

Pezeshki یک سامانه نوبت‌دهی پزشکی با سه سطح اصلی کاربری است:

- **Patient:** جستجوی پزشک، مشاهده زمان‌های آزاد، رزرو نوبت و مشاهده سوابق شخصی.
- **Doctor:** مدیریت پروفایل، تخصص، برنامه حضور، نوبت‌ها، ویزیت‌ها و نسخه‌ها.
- **Admin:** مدیریت کاربران، پزشکان، تخصص‌ها و نظارت بر عملکرد سامانه.

رابط کاربری فارسی و راست‌به‌چپ (RTL) است. برنامه‌های Web و Admin جدا از API توسعه داده می‌شوند.

## 2. اصول هدایت‌کننده

1. ابتدا قراردادها و مدل داده، سپس منطق کسب‌وکار و در نهایت UI وابسته به آن توسعه یابد.
2. هر فاز باید معیار پذیرش روشن و تست‌پذیر داشته باشد.
3. دسترسی به داده‌های پزشکی باید حداقلی، مجاز و قابل ممیزی باشد.
4. رزرو نوبت باید در برابر درخواست‌های هم‌زمان ایمن باشد.
5. عملیات چندمرحله‌ای حساس باید از تراکنش دیتابیس استفاده کنند.
6. داده‌های حساس، رمزها، OTPها و Tokenها نباید در Log یا Git ثبت شوند.
7. قابلیت‌های Planned نباید در مستندات به‌عنوان Implemented معرفی شوند.

## 3. وضعیت فعلی

| حوزه | وضعیت | توضیح |
|---|---|---|
| Monorepo و Workspaceها | Implemented / بازبینی لازم | ساختار `apps/*` و `packages/*` موجود است |
| PostgreSQL و Prisma | Partial / migration reconciliation required | Schema و migrations موجود؛ migration `20261104220451` و migration Appeal باید در dev/test با backup و history یکسان اعمال/تأیید شوند؛ migration قبلی destructive است |
| Patient registration با OTP | Implemented / دستی تست شده | ساخت User و PatientProfile و Session |
| Email/password login | Implemented / integration-tested | جریان موفق و رد درخواست‌های نامعتبر پوشش داده شده |
| Access JWT و Session middleware | Implemented / integration-tested | اعتبارسنجی Session و وضعیت حساب |
| Refresh rotation | Implemented / integration-tested | Rotation، reuse rejection و race test |
| Logout و لغو Session | Implemented / integration-tested | Access و Refresh قبلی پس از لغو رد می‌شوند |
| OTP Login | Implemented / automated integration test | OTP مصرف‌شده، malformed و استفاده مجدد رد می‌شوند |
| تست خودکار | 64 passing / 3 skipped | کل suite سبز؛ 3 تست Appeal به migration table/schema reconciliation وابسته‌اند |
| Authorization & User Management | Partial | بنیاد policy/ownership/contact/appeal/admin موجود؛ Appointment/Clinical enforcement و MFA/role workflows باز هستند |
| Doctor / Appointment | Partial (Phase 3 API) | Directory/review/create/submit و تست‌ها موجود؛ specialty/credential route tests و review route integration tests باز هستند |
| Frontend workflowها | Planned / در حال توسعه مستقل | نیازمند اتصال به APIهای پایدار |

## 4. فازهای توسعه

### Phase 0 — Project Foundation

**هدف:** تثبیت ساختار توسعه، قراردادهای مشترک و محیط محلی.

کارها:
- [x] تثبیت npm workspaces و اسکریپت‌های ریشه.
- [x] مستندسازی راه‌اندازی پروژه.
- [x] تثبیت TypeScript configuration و typecheck.
- [x] Lint script/config و اجرای lint کل workspaceها (clean).
- [x] ثبت قواعد مدیریت Environment و Secretها.
- [ ] تأیید migrationهای موجود و وضعیت دیتابیس؛ سیاست backup/restore و دستورات مستند شده‌اند.

**معیار تکمیل:**
- توسعه‌دهنده بتواند پروژه را طبق README راه‌اندازی کند.
- Build برنامه‌ها از دستورات مستندشده قابل اجرا باشد.
- هیچ Secret در Git نباشد.

**وضعیت اجرا (بازبینی فعلی):** build، typecheck، lint و `prisma validate` موفق‌اند. dev DB دو migration (`20261104220451` و `20261113090000_add_appeal_workflow`) pending دارد؛ test DB جدول Appeal را دارد و migrationهایش up-to-date است، اما باید history repository و test/dev DBها قبل از apply dev migrations یکسان و مستند شوند. migration قبلی 76KB destructive است و بدون backup/SQL review اعمال نشده. Phase 0 **Partial / blocked برای migration reconciliation** است.

### Phase 1 — Authentication & Session Foundation

**هدف:** هویت کاربر و چرخه پایه ورود/خروج.

کارها:
- [x] درخواست OTP برای ثبت‌نام با Mock SMS.
- [x] ثبت‌نام Patient با OTP.
- [x] ساخت PatientProfile در جریان ثبت‌نام.
- [x] Hash رمز عبور با bcrypt.
- [x] Email/password login.
- [x] صدور Access JWT.
- [x] ذخیره Hash مربوط به Refresh Token در دیتابیس.
- [x] Session validation و account active check.
- [x] Refresh Token rotation.
- [x] Logout و revoke کردن Session.
- [x] تکمیل OTP Login.
- [ ] Password Reset کامل نیست. Phone Verification endpoint/service و تست‌های service موجود است، اما تست end-to-end و hardening مقصد/حساب باید تکمیل شود.
- [x] تست‌های خودکار جریان‌های موجود و تست‌های منفی پایه (4 files / 19 tests passed).
- [ ] Rate limiting سطح HTTP/IP برای login/OTP وجود ندارد؛ OTP فقط cooldown و daily-limit مقصد دارد.
- [x] تنظیم CORS بر اساس allowlist و بررسی Cookieهای HttpOnly/SameSite/Secure.
- [x] تست هم‌زمانی Refresh و OTP replay؛ race در ایجاد challenge متزامن و unique conflict mapping همچنان نیازمند تکمیل است.
- [ ] بازبینی/پیاده‌سازی CSRF protection برای refresh با Cookie پیش از production و نهایی شدن معماری client.

**معیار تکمیل:**
- مسیرهای موفق و ناموفق با تست خودکار پوشش داده شوند.
- Tokenهای منقضی، مصرف‌شده و لغوشده پذیرفته نشوند.
- رفتار هم‌زمانی Refresh و OTP بررسی شود.
- هیچ Secret یا کد OTP در Logهای Production نباشد.

**وضعیت Phase 1:** **Partial / production hardening required**. Password Reset، HTTP/IP rate limit و CSRF باز هستند؛ Phone Verification هنوز end-to-end و با policy مالکیت مقصد کامل نشده است.

### Phase 2 — Authorization & User Management

**هدف:** تعریف مجوزهای قابل اتکا و مدیریت چرخه عمر حساب.

کارها:
- [x] طراحی پایه Role Guard و Permission policy برای endpointهای فعلی Auth.
- [x] API پایه پروفایل کاربر فعلی با ownership مبتنی بر session و فیلدهای قابل ویرایش محدود.
- [x] مدیریت فعال/غیرفعال‌سازی حساب توسط Admin با reason، audit، لغو session و حفاظت آخرین Admin فعال.
- [x] فهرست کاربران Admin با فیلتر role/status، cursor pagination و فیلدهای حداقلی.
- [x] API فایل private با کنترل مالکیت برای خود مالک؛ مجوزهای رابطه درمانی هنوز وجود ندارد.
- [x] API پایه پروفایل Doctor با مالکیت مبتنی بر هویت احرازشده و فیلدهای قابل ویرایش allowlist شده.
- [ ] اکشن‌های Appointment/Clinical در policy تعریف شده‌اند، اما route/service enforcement و تست IDOR برایشان وجود ندارد.
- [ ] جلوگیری از دسترسی کاربر به منابع متعلق به دیگران در ماژول‌های Doctor/Appointment/Medical Records (بدون endpoint دامنه‌ای قابل اجرا نیست).
- [x] تکمیل User Profile API و سیاست‌های verification برای اطلاعات تماس (contact/send-otp + verify).
- [ ] Appeal کد/مدل/route و تست دارد، اما migration history باید reconcile شود؛ MFA/strong auth و audited role transition باز هستند.
- [x] ثبت AuditLog برای تغییر وضعیت حساب توسط Admin.
- [x] تست منفی دسترسی عمودی برای Admin endpoints و دسترسی افقی برای self-profile و private files.

**معیار تکمیل:**
- هر Endpoint محافظت‌شده نقش و مالکیت منابع را بررسی کند.
- تغییر Role فقط از مسیر مجاز مدیریتی انجام شود.
- تست‌های منفی برای دسترسی غیرمجاز وجود داشته باشد.
- برای هر resource domain جدید (appointments, medical records, doctor resources)، مالکیت/رابطه دسترسی قبل از افزودن endpoint تعریف و جداگانه تست شود.

**پیشرفت (بازبینی فعلی):** Auth/self-profile، Admin user list/status، owner-only file، Doctor profile و directory پایه پیاده‌اند. Appeal در test DB اجرا نشده بود اما اکنون تست‌ها active هستند؛ migration reconciliation dev هنوز باقی است. Policyهای آینده جای route enforcement نیستند؛ Appointment/Clinical endpoints و IDOR آن‌ها موجود نیستند. MFA، audited role transition و production hardening باز هستند. Phase 2 **Partial / foundation only** است.

### Phase 3 — Medical Specialties & Doctor Profiles

**هدف:** ایجاد اطلاعات تخصص و پروفایل حرفه‌ای پزشک.

کارها:
- [x] طراحی Specialty و ارتباط پزشک با تخصص.
- [x] طراحی DoctorProfile.
- [x] فیلدهای معرفی، سوابق حرفه‌ای و اطلاعات مطب.
- [x] وضعیت تأیید پزشک و گردش کار بررسی توسط Admin.
- [x] API مدیریت پروفایل پزشک.
- [x] API فهرست و جزئیات پزشکان.
- [x] فیلتر بر اساس تخصص و وضعیت تأیید.
- [x] API مدیریت تخصص و مدارک پزشک.
- [x] ساخت اولیه پروفایل پزشک (`POST /api/doctor/profile`) و ارسال برای بررسی (`POST /api/doctor/profile/submit`).

**معیار تکمیل:**
- پزشک فقط پروفایل مجاز خود را ویرایش کند.
- پزشک تأییدنشده در جستجوی عمومی نمایش داده نشود، مگر سیاست محصول خلاف آن باشد.
- داده‌های تخصصی دارای اعتبارسنجی و تست باشند.

**پیشرفت (بازبینی فعلی):** Directory/public detail و create/submit/review flow پیاده و تست شده‌اند؛ 64 تست کل suite سبز است. Specialty/credential routes و admin review route هنوز integration test اختصاصی ندارند و credential ownership/deletion policy باید تکمیل شود. Phase 3 **Partial / API foundation complete** است، نه fully closed.

### Phase 4 — Availability & Scheduling

**هدف:** تعریف زمان‌های کاری و زمان‌های قابل رزرو.

کارها:
- [ ] طراحی برنامه هفتگی تکرارشونده.
- [ ] پشتیبانی از چند بازه کاری در یک روز.
- [ ] تعریف مدت Slot؛ مقدار پیش‌فرض محصول یک ساعت است اما بهتر است قابل تنظیم باشد.
- [ ] تعریف تعطیلات و استثناهای روزانه.
- [ ] تعریف منطقه زمانی برای مطب/پزشک.
- [ ] تولید زمان‌های آزاد برای بازه تاریخی مشخص.
- [ ] جلوگیری از تداخل برنامه‌ها و استثناها.

**معیار تکمیل:**
- زمان‌های آزاد از برنامه هفتگی و استثناها به‌درستی محاسبه شوند.
- تغییر ساعت تابستانی و timezone به‌صورت صریح مدیریت شود.
- تست مرزی برای ابتدا/انتهای بازه‌ها وجود داشته باشد.

### Phase 5 — Appointment Booking

**هدف:** چرخه کامل رزرو و مدیریت نوبت.

کارها:
- [ ] جستجوی پزشک و مشاهده زمان‌های آزاد.
- [ ] رزرو نوبت توسط Patient.
- [ ] وضعیت‌های Appointment و انتقال‌های مجاز.
- [ ] لغو نوبت و سیاست مهلت لغو.
- [ ] تغییر زمان نوبت.
- [ ] مشاهده نوبت‌های آینده و گذشته.
- [ ] مدیریت نوبت توسط Doctor و Admin.
- [ ] ثبت تاریخچه تغییرات مهم.

**معیار تکمیل:**
- دو درخواست هم‌زمان نتوانند یک Slot را دوبار رزرو کنند.
- یکپارچگی با Transaction و قیدهای دیتابیس تضمین شود.
- تمام انتقال‌های وضعیت تست شوند.
- سیاست لغو و تغییر زمان مستند باشد.

### Phase 6 — Patient Medical Records

**هدف:** نگهداری امن اطلاعات پزشکی بیمار.

کارها:
- [ ] سوابق بیماری و شرایط پزشکی.
- [ ] حساسیت‌ها.
- [ ] داروهای مصرفی فعلی.
- [ ] سابقه پزشکی و یادداشت‌های مرتبط.
- [ ] کنترل دسترسی مبتنی بر رابطه درمانی و مجوز.
- [ ] ثبت Audit Log برای مشاهده/تغییر اطلاعات حساس.

**معیار تکمیل:**
- بیمار فقط اطلاعات مجاز خود را ببیند.
- پزشک فقط در چارچوب رابطه و مجوز معتبر به اطلاعات دسترسی داشته باشد.
- عملیات خواندن و تغییر داده‌های حساس قابل ممیزی باشد.

### Phase 7 — Visits, Diagnoses & Prescriptions

**هدف:** ثبت فرآیند ویزیت و خروجی درمانی.

کارها:
- [ ] ثبت Visit و وضعیت حضور.
- [ ] ثبت شرح حال و یادداشت پزشک.
- [ ] ثبت تشخیص.
- [ ] ثبت Prescription.
- [ ] ثبت دارو، مقدار، دفعات، مدت و دستور مصرف.
- [ ] امکان مشاهده نسخه‌های قبلی با مجوز.
- [ ] نسخه قابل چاپ/خروجی در صورت نیاز محصول.

**معیار تکمیل:**
- نسخه به ویزیت و پزشک مربوط باشد.
- تغییرات مهم ثبت شوند.
- دسترسی بیمار و پزشک مطابق سیاست محرمانگی باشد.

### Phase 8 — Web & Admin Applications

**هدف:** تکمیل تجربه کاربری فارسی و RTL روی API پایدار.

کارها:
- [ ] Design system و کامپوننت‌های مشترک.
- [ ] Landing و صفحات معرفی.
- [ ] Register / Login / OTP.
- [ ] Patient dashboard.
- [ ] Doctor dashboard.
- [ ] جستجو و صفحه جزئیات پزشک.
- [ ] انتخاب تاریخ و Slot و رزرو.
- [ ] مدیریت پروفایل و برنامه پزشک.
- [ ] Admin dashboard و مدیریت کاربران/پزشکان.
- [ ] مدیریت حالت‌های Loading، Empty، Error و Success.
- [ ] دسترس‌پذیری و واکنش‌گرایی.

**معیار تکمیل:**
- جریان‌های اصلی از ابتدا تا انتها روی محیط تست اجرا شوند.
- RTL، تاریخ و زمان محلی، خطاها و اعتبارسنجی فرم‌ها بررسی شوند.
- UI به‌جای اتکا به داده ساختگی، از API واقعی استفاده کند.

### Phase 9 — Production Readiness

**هدف:** آماده‌سازی برای استقرار قابل اتکا.

کارها:
- [ ] تست واحد، Integration و End-to-End.
- [ ] بازبینی امنیتی و dependencyها.
- [ ] Docker image و محیط‌های مجزا.
- [ ] مدیریت Secretها.
- [ ] Logging ساختاریافته و حذف داده حساس از Log.
- [ ] Health checks و Monitoring.
- [ ] Backup و آزمایش Restore.
- [ ] CI pipeline و بررسی Build/Test.
- [ ] مستندات Deployment و Rollback.
- [ ] تست بار و بررسی عملکرد queryها.

**معیار تکمیل:**
- استقرار از pipeline تکرارپذیر باشد.
- Backup واقعاً قابل Restore باشد.
- مانیتورینگ خطاهای حیاتی را آشکار کند.
- فرآیند Rollback مستند و آزمایش شده باشد.

## 5. وابستگی فازها

```mermaid
flowchart TD
    A[Phase 0: Foundation] --> B[Phase 1: Authentication]
    B --> C[Phase 2: Authorization]
    C --> D[Phase 3: Doctor Profiles]
    D --> E[Phase 4: Availability]
    E --> F[Phase 5: Appointments]
    F --> G[Phase 6: Medical Records]
    G --> H[Phase 7: Visits & Prescriptions]
    C --> I[Phase 8: Web & Admin]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    I --> J[Phase 9: Production Readiness]
```

این نمودار ترتیب مفهومی را نشان می‌دهد؛ برخی کارهای Frontend می‌توانند هم‌زمان با توسعه API و با قراردادهای تثبیت‌شده پیش بروند.

## 6. Definition of Done

هر قابلیت زمانی Done محسوب می‌شود که:

- [ ] ورودی‌ها و خروجی‌های آن مشخص باشند.
- [ ] اعتبارسنجی ورودی انجام شود.
- [ ] مجوز و مالکیت منابع بررسی شود.
- [ ] خطاهای قابل انتظار مدیریت شوند.
- [ ] تست‌های مرتبط نوشته و اجرا شده باشند.
- [ ] migrationها بررسی و قابل اعمال باشند.
- [ ] مستندات API و معماری به‌روز باشند.
- [ ] Logها حاوی Secret یا داده حساس غیرضروری نباشند.
- [ ] Build و بررسی‌های CI موفق باشند.

## 7. نحوه به‌روزرسانی Roadmap

- Checkboxها فقط پس از تکمیل و بررسی معیار پذیرش علامت زده شوند.
- وضعیت واقعی هر فاز در جدول وضعیت ثبت شود.
- تغییر ترتیب فازها باید با دلیل فنی/محصولی همراه باشد.
- این Roadmap برنامه قطعی زمانی نیست؛ اولویت‌ها با بازخورد و ریسک‌های فنی بازبینی می‌شوند.
