# Authentication API

**Base path:** `/api/auth`  
**Status:** قرارداد اولیه بر اساس مسیرهای فعلی گزارش‌شده؛ قبل از انتشار نسخه API با Controller و Router تطبیق داده شود.

## 1. Endpoint Summary

| Method | Path | Authentication | Description |
|---|---|---|---|
| POST | `/otp/request` | Public | درخواست OTP |
| POST | `/register` | Public | ثبت‌نام Patient با OTP |
| POST | `/login` | Public | ورود با Email/Password |
| POST | `/refresh` | Refresh Cookie | تمدید و Rotation |
| POST | `/logout` | Access JWT | لغو Session فعلی |
| GET | `/me` | Access JWT | اطلاعات کاربر فعلی |

## 2. Request OTP

`POST /api/auth/otp/request`

```json
{
  "phone": "+989121234567",
  "purpose": "SIGNUP"
}
```

مقادیر فعلی قابل استفاده در این مسیر طبق schema درخواست: `SIGNUP` و `LOGIN`.

پاسخ دقیق باید با Controller بررسی شود. در Development، Mock Provider کد را در ترمینال API چاپ می‌کند؛ این رفتار برای Production مجاز نیست.

## 3. Register

`POST /api/auth/register`

```json
{
  "firstName": "Test",
  "lastName": "Patient",
  "nationalId": "TEST-10001",
  "dateOfBirth": "1995-05-10",
  "phone": "+989121234567",
  "code": "123456",
  "email": "test@example.com",
  "password": "ExamplePassword123"
}
```

`email` و `password` اختیاری‌اند؛ در صورت ارسال password، email الزامی است.

پاسخ موفق نمونه:

```json
{
  "user": {
    "id": "example-user-id",
    "name": "Test Patient",
    "email": "test@example.com",
    "role": "PATIENT"
  },
  "accessToken": "<access-token>"
}
```

Refresh Token باید از طریق `Set-Cookie` ارسال شود، نه در JSON.

## 4. Login

`POST /api/auth/login`

```json
{
  "email": "test@example.com",
  "password": "ExamplePassword123"
}
```

پاسخ موفق شامل `user` و `accessToken` است و Refresh Token از طریق Cookie تنظیم می‌شود.

برای ایمیل ناشناخته و رمز اشتباه، پاسخ عمومی یکسان استفاده شود تا امکان تشخیص وجود حساب کاهش یابد. رفتار حساب غیرفعال باید مطابق سیاست امنیتی محصول بازبینی شود؛ در حال حاضر پاسخ اختصاصی `User account is inactive` گزارش شده است.

## 5. Refresh

`POST /api/auth/refresh`

Cookie موردنیاز:

```http
Cookie: refreshToken=<refresh-token>
```

پاسخ موفق نمونه:

```json
{
  "accessToken": "<new-access-token>"
}
```

همراه پاسخ باید Refresh Cookie جدید تنظیم شود. Token قبلی باید غیرقابل استفاده شود.

## 6. Logout

`POST /api/auth/logout`

Header:

```http
Authorization: Bearer <access-token>
```

درخواست باید Cookie Refresh را نیز ارسال کند تا پاک‌سازی سمت Client انجام شود، مطابق پیاده‌سازی Controller.

پاسخ موفق نمونه:

```json
{
  "message": "Logged out successfully"
}
```

## 7. Current User

`GET /api/auth/me`

Header:

```http
Authorization: Bearer <access-token>
```

پاسخ نمونه:

```json
{
  "user": {
    "id": "example-user-id",
    "name": "Test Patient",
    "email": "test@example.com",
    "role": "PATIENT"
  }
}
```

## 8. Error Handling

نمونه پیام‌های مشاهده‌شده:
- `Invalid email or password`
- `User account is inactive`
- `Invalid or expired session`
- `Invalid or expired refresh token`
- `Invalid or expired access token`

کدهای HTTP و شکل نهایی Error Response باید از Controllerهای واقعی استخراج و در تست قرارداد تثبیت شوند.

## 9. Client Integration Notes

- Access Token را در حافظه برنامه نگه دارید؛ از ذخیره‌سازی ناامن و طولانی‌مدت خودداری کنید.
- Refresh Cookie باید از طریق تنظیمات credentials مناسب Client ارسال شود.
- برای درخواست‌های cross-origin، CORS و Cookie policy باید هماهنگ باشند.
- هرگز Access یا Refresh Token را در Log، Analytics یا پیام خطا قرار ندهید.
- در صورت شکست Refresh، وضعیت احراز هویت Client پاک شود.
