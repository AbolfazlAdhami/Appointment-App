# Production Readiness

## 1. Security

- HTTPS اجباری.
- Secure Cookie در Production.
- CORS محدود به Originهای موردنیاز.
- CSRF protection متناسب با استفاده از Cookie.
- Rate limiting برای Login، OTP و مسیرهای حساس.
- کنترل دسترسی و مالکیت منابع.
- مدیریت امن Secretها.
- dependency scanning و به‌روزرسانی منظم.

## 2. Privacy

- حداقل‌سازی داده شخصی جمع‌آوری‌شده.
- عدم ثبت اطلاعات پزشکی، OTP، Password یا Token در Log.
- تعریف سیاست نگهداری و حذف داده.
- Audit برای دسترسی‌ها و تغییرات حساس.
- محدودسازی دسترسی پشتیبانی و مدیران.

## 3. Reliability

- Health checks.
- Logging ساختاریافته.
- Monitoring و alerting.
- Database backup و آزمون restore.
- مدیریت graceful shutdown.
- محدودیت timeout و retry برای Providerهای خارجی.

## 4. Deployment

- Build تکرارپذیر.
- Migration به‌عنوان مرحله کنترل‌شده Deployment.
- عدم اجرای migration مخرب بدون بازبینی و برنامه rollback.
- جداسازی محیط‌های Development، Staging و Production.
- مستندسازی نسخه و تغییرات هر Release.

## 5. Go-live Checklist

- [ ] HTTPS و Secure Cookie فعال است.
- [ ] Mock Provider غیرفعال است.
- [ ] Secretها در Secret Manager هستند.
- [ ] Rate limiting و CSRF review تکمیل شده است.
- [ ] تست‌های امنیتی و Integration سبز هستند.
- [ ] Backup و Restore آزمایش شده‌اند.
- [ ] Monitoring و Alerting فعال است.
- [ ] Migration plan و rollback plan تأیید شده‌اند.
- [ ] سیاست Privacy و دسترسی به داده پزشکی بازبینی شده است.
