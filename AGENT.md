# Agent Guide — Pezeshki

این سند راهنمای عامل‌های هوش مصنوعی و توسعه‌دهندگان برای تغییر امن و قابل‌نگهداری مخزن Pezeshki است. آن را همراه با `README.md`، `docs/README.md`، `docs/roadmap.md` و اسناد تخصصی بخوانید. کد اجرایی منبع حقیقت رفتار فعلی است؛ roadmap و اسناد برنامه و وضعیت بررسی‌شده را توضیح می‌دهند و ممکن است عقب‌مانده باشند.

## 1. زمینه پروژه

- مخزن یک monorepo مبتنی بر npm workspaces است: `apps/api`، `apps/web`، `apps/admin` و `packages/*`.
- API: Express 5، TypeScript strict، Prisma 7، PostgreSQL، Zod؛ ورودی اجرا `apps/api/src/server.ts` و ساخت اپ `apps/api/src/app.ts` است.
- Web و Admin: React 19 و Vite؛ ورودی‌های UI در `apps/web/src/main.tsx` و `apps/admin/src/main.tsx` قرار دارند. UI فعلی در حد scaffold است، نه محصول کامل.
- قراردادهای TypeScript مشترک در `packages/types/src/` هستند. این typeها جای اعتبارسنجی runtime سمت سرور را نمی‌گیرند.
- Prisma schema در `apps/api/prisma/` چندفایلی است؛ migrations در `apps/api/prisma/migrations/` هستند.
- مستندات معماری، API، راه‌اندازی و تست در `docs/` نگهداری می‌شوند.

## 2. قواعد غیرقابل مذاکره

1. پیش از تغییر، کد، تست‌ها، package scriptها، مستندات و وضعیت Git مرتبط را بخوانید. فرض نکنید مستندات یا گزارش قبلی با شاخه فعلی منطبق است.
2. تغییر را محدود به درخواست و کوچک نگه دارید؛ فایل‌های نامرتبط یا تغییرات از پیش موجود کاربر را بازنویسی، حذف یا stage نکنید.
3. هیچ‌گاه Secret، OTP، refresh/access token، password یا داده واقعی بیمار را در source، test، docs یا log ثبت نکنید. `.env` واقعی را چاپ یا commit نکنید؛ فقط از فایل‌های `.example` استفاده کنید.
4. هیچ دستور مخرب یا برگشت‌ناپذیری اجرا نکنید، از جمله `prisma migrate reset`، حذف volume/database، پاک‌سازی داده یا اعمال migration روی دیتابیس دارای داده. برای migration، ابتدا diff/schema و SQL را بازبینی کنید، backup/restore و target DB را تأیید کنید و فقط با اجازه صریح کاربر migration را اعمال کنید.
5. تست دیتابیسی باید فقط روی دیتابیس مجزای `pezeshki_test` اجرا شود. تست auth integration در `apps/api/src/__tests__/auth.integration.test.ts` نام DB را بررسی می‌کند؛ این حفاظت را دور نزنید.
6. ادعای “تست پاس شد”، “امن است” یا “فاز کامل است” را فقط با اجرای موفق و شواهد قابل اشاره مطرح کنید. نتایج قدیمی را به‌روز فرض نکنید.
7. در تغییر رفتار API، schema، امنیت یا معماری، اسناد متناظر (`docs/api/`, `docs/architecture/`, `docs/roadmap.md`) را هماهنگ کنید.

## 3. معماری و conventionها

### API

الگوی معمول:

`routes → middleware → controllers → schemas/services → Prisma/provider`

- Route فقط مسیر و middleware/controller را متصل می‌کند.
- Controller مسئول HTTP، اعتبارسنجی ورودی و status/response است؛ منطق دامنه را در service بگذارید.
- ورودی درخواست را با Zod در مرز API اعتبارسنجی کنید؛ در صورت امکان schemaهای request/response متمرکز در `apps/api/src/schemas/` باشند.
- خطاهای دامنه را صریح و قابل طبقه‌بندی مدیریت کنید؛ پاسخ client نباید stack trace، SQL، secret یا جزئیات داخلی داشته باشد. برای خطاهای غیرمنتظره از `apps/api/src/middlewares/error.middleware.ts` و قرارداد خطای یکنواخت استفاده کنید.
- مجوز endpointهای محافظت‌شده باید صریح باشد: `authenticate` سپس `authorizeAction`/سیاست مناسب. نقش به تنهایی اثبات مالکیت منبع نیست؛ query/service باید ownership و رابطه درمانی را enforce کند.
- عملیات چندمرحله‌ای دارای invariant (مثلاً OTP مصرف‌شونده همراه ثبت‌نام/session) باید در transaction مناسب باشند. قیدهای دیتابیس را برای یکتایی/هم‌زمانی در نظر بگیرید.
- از provider abstraction موجود برای SMS پیروی کنید؛ provider mock نباید در production فعال باشد.
- Prisma را از `apps/api/src/libs/prisma.ts` مصرف کنید؛ در تست‌ها lifecycle و disconnect را رعایت کنید.

### Frontend

- Web و Admin دو workspace و برنامه مجزا هستند؛ قبل از انتقال یا اشتراک UI، مرز محصول و قراردادهای مشترک را مشخص کنید.
- زبان محصول فارسی و جهت پیش‌فرض RTL است؛ layout واکنش‌گرا، keyboard/accessibility و وضعیت‌های loading/empty/error/success را در نظر بگیرید.
- هیچ authorization واقعی را به UI واگذار نکنید؛ API مرجع نهایی مجوز است.
- پیش از افزودن کتابخانه، packageهای موجود و نیاز واقعی را بررسی کنید؛ dependency جدید را بدون دلیل معماری اضافه نکنید.

### TypeScript و style

- پیکربندی پایه `tsconfig.base.json` strict است. از type دقیق، narrowing و `unknown` به‌جای `any` استفاده کنید؛ `any` باید توجیه‌شده و محدود باشد.
- ورودی/خروجی عمومی serviceها را type کنید؛ Prisma-generated types را دستی ویرایش نکنید.
- conventionهای موجود هر workspace را ادامه دهید و تغییرات فرمت نامرتبط تولید نکنید.
- قراردادهای مشترک را در `packages/types` نگه دارید؛ typeهای server-specific و مدل‌های persistence را بی‌دلیل به frontend صادر نکنید.

## 4. کار با roadmap و وضعیت فازها

- مرجع فازها `docs/roadmap.md` است. checkbox را فقط وقتی بزنید که معیار پذیرش همان مورد، تست متناظر و در صورت نیاز سند به‌روز شده باشد.
- وضعیت فاز را از `Implemented`, `Partial`, `Blocked`, `Not verified` یا `Planned` دقیق انتخاب کنید؛ وجود schema/model یا TODO به معنی قابلیت کامل نیست.
- برای بستن هر فاز، evidence ثبت کنید: فایل/تغییر، فرمان اجراشده، خروجی واقعی، تست‌های منفی/مثبت و موارد باقی‌مانده.
- Phase 0 شامل workspace/build/typecheck، راه‌اندازی تکرارپذیر، تنظیمات و secrets، lint، migration/DB، backup و معیارهای پذیرش است.
- Phase 1 شامل ثبت‌نام/login، OTP، session/JWT، refresh rotation، logout، rate limiting، CSRF review، مدیریت خطا، race/unique conflict، تست و مستندات است. مسیرهای فعلی Auth را کامل‌تر از واقعیت معرفی نکنید.
- پیش از شروع فازهای وابسته، blockerهای Phase 0/1 را اعلام کنید؛ اما کار مستقل و کم‌ریسک را می‌توان هم‌زمان انجام داد.

## 5. چرخه انجام کار

1. **بررسی:** درخواست را به محدوده فایل/رفتار تبدیل کنید؛ `git status --short` را بخوانید و فایل‌های مرتبط را بررسی کنید.
2. **طرح کوتاه:** تصمیم‌ها، ریسک‌ها و معیار پذیرش را روشن کنید؛ برای نیاز مبهم فقط سؤال ضروری بپرسید.
3. **پیاده‌سازی:** کمترین تغییر کامل را انجام دهید؛ تست را همراه تغییر بنویسید؛ migration و dependency را جداگانه و با دلیل اضافه کنید.
4. **اعتبارسنجی:** از ریشه متناسب با تغییر اجرا کنید:

   ```bash
   npm run build
   npm run typecheck
   npm test
   npm run db:validate
   git diff --check
   git status --short
   ```

   این‌ها اهداف اعتبارسنجی‌اند؛ هر دستور به DB یا ابزار محلی وابسته را فقط با ذکر پیش‌نیاز اجرا کنید. `npm test` در API به PostgreSQL test database نیاز دارد. Lint در workspaceها موجود/یکسان نیست؛ scriptها را پیش از اجرا از package.json بخوانید و فقدان lint را صریح گزارش کنید.

5. **بازبینی نهایی:** diff و فایل‌های تغییرکرده را بخوانید؛ مطمئن شوید Secret، داده، dist/generated ناخواسته، فایل کاربر یا تغییر نامرتبط وارد نشده است.
6. **گزارش:** خلاصه فایل‌ها، تصمیم‌ها، شواهد تست و فرمان‌های ناموفق/اجرانشده را با مسیرهای دقیق گزارش کنید. علت محیطی را از شکست محصول تفکیک کنید.

## 6. نکات و ریسک‌های شناخته‌شده برای بازبینی هر بار

این‌ها snapshot نیستند؛ پیش از اقدام دوباره verify کنید:

- تست‌های API در `apps/api/src/services/__tests__/`, `apps/api/src/middlewares/__tests__/` و `apps/api/src/__tests__/` قرار دارند و بخشی از آن‌ها integration واقعی PostgreSQL است.
- `apps/api/package.json` در حال حاضر script `lint` ندارد؛ ریشه `npm run lint` الزاماً lint API را اجرا نمی‌کند.
- migrationهای pending و SQLهای migration را قبل از هر ادعای آمادگی بررسی کنید. فایل `20261104220451_add_auth_otp_sessions/migration.sql` در snapshot بررسی‌شده empty بود؛ وضعیت واقعی DB را بدون اتصال و `migrate status` نمی‌توان نتیجه گرفت.
- اسناد roadmap و docs README در مورد migration pending/destructive risk و تعداد تست‌ها باید با همان snapshot بررسی شوند؛ وضعیت migration خالی و تاریخ/تعداد تست ممکن است با متن مستندات تناقض داشته باشد.
- `apps/web/src/App.tsx` و `apps/admin/src/App.tsx` در snapshot بررسی‌شده placeholder هستند؛ build موفق معادل تکمیل frontend/product workflow نیست.
- پوشش API فعلی متمرکز بر Auth است؛ وجود مدل‌های وسیع Prisma به معنی endpoint یا feature عملیاتی نیست.
- OTP فعلی cooldown و سقف روزانه per destination دارد، ولی این‌ها جای HTTP/IP/device-level abuse throttling را نمی‌گیرند.

## 7. معیار تکمیل برای هر PR/change

- رفتار و دامنه تغییر روشن باشد و با معماری موجود سازگار باشد.
- ورودی نامعتبر، خطا، دسترسی غیرمجاز و حالت‌های مرزی تست شده باشند.
- migration، API contract و documentation در صورت نیاز هماهنگ باشند.
- Build/typecheck و تست مرتبط پاس باشند، یا مانع محیطی دقیق ثبت شده باشد.
- `git diff --check` پاک باشد و فقط فایل‌های مورد انتظار تغییر کرده باشند.
- هیچ regression امنیتی، secret، داده واقعی یا ادعای بدون evidence اضافه نشده باشد.