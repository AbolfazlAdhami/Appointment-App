# Authentication & Authorization

**Project:** Pezeshki — Doctor Appointment Platform  
**Module:** API Authentication  
**Status:** Core registration, password login, OTP login and sessions implemented; Password Reset, Phone Verification and production security hardening remain incomplete. Reviewed 2026-11-07.

---

## 1. Overview

The authentication module is responsible for:

- Patient registration using phone number verification.
- Email and password authentication.
- OTP generation and verification.
- Access token generation and validation.
- Refresh token rotation.
- Session creation, validation, and revocation.
- User account status validation.
- Role-based authorization foundation.

### Technology

| Component | Technology |
|---|---|
| API | Express 5 + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Password hashing | bcrypt |
| Access token | JWT |
| Session storage | PostgreSQL |
| OTP hashing | HMAC-SHA256 |
| SMS provider | Mock / LimoSMS |
| Validation | Zod |

---

## 2. Authentication Architecture

The application uses a hybrid JWT + database session architecture.

### Access Token

- JWT-based.
- Lifetime: 15 minutes.
- Returned in the API response.
- Sent by the client using the Authorization header.
- Contains `userId` and `sessionId`.
- Does not contain the user's role.

Example:

```http
Authorization: Bearer <access_token>
```

### Refresh Token

- Random, cryptographically secure token.
- Lifetime: 7 days.
- Delivered through an HttpOnly cookie.
- Stored in the database only as a hash.
- Rotated when the refresh endpoint is called.
- Revoked when the user logs out.

Cookie configuration:

```http
HttpOnly
Path=/api/auth
SameSite=Lax
Secure=true (production)
```

### Session Validation

For authenticated requests, the middleware should verify:

1. Access JWT signature and expiration.
2. Session existence in the database.
3. Session expiration.
4. Session revocation status.
5. User account active status.

The user's role should be loaded from the database rather than trusted from the JWT.

---

## 3. Database Models

### User

Responsible for identity and account information.

Important fields:

- `id`
- `firstName`
- `lastName`
- `nationalId`
- `dateOfBirth`
- `phone`
- `phoneVerifiedAt`
- `email`
- `emailVerifiedAt`
- `passwordHash`
- `passwordChangedAt`
- `role`
- `isActive`
- `lastLoginAt`

### AuthSession

Stores authenticated sessions.

Important fields:

- `id`
- `userId`
- `refreshTokenHash`
- `expiresAt`
- `revokedAt`
- `lastUsedAt`
- `createdAt`

### OtpChallenge

Stores OTP verification challenges.

Important fields:

- `id`
- `userId`
- `channel`
- `purpose`
- `destination`
- `codeHash`
- `attempts`
- `maxAttempts`
- `expiresAt`
- `consumedAt`
- `createdAt`

OTP values must never be stored as plaintext.

---

## 4. API Endpoints

Base URL:

```text
/api/auth
```

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/otp/request` | Request an OTP |
| POST | `/register` | Register a patient |
| POST | `/login` | Login using email and password |
| POST | `/login/otp` | Login using phone OTP |
| POST | `/refresh` | Rotate refresh token |
| POST | `/logout` | Revoke current session |
| GET | `/me` | Get authenticated user |

### 4.1 Request OTP

```http
POST /api/auth/otp/request
Content-Type: application/json
```

Request:

```json
{
  "phone": "+989121234567",
  "purpose": "SIGNUP"
}
```

Supported purposes in the current schema:

- `SIGNUP`
- `LOGIN`
- `PHONE_VERIFICATION`
- `PASSWORD_RESET`

The request endpoint currently accepts `SIGNUP` and `LOGIN`.

The complete OTP login and other OTP-based flows require separate implementation.

### 4.2 Patient Registration

```http
POST /api/auth/register
Content-Type: application/json
```

Request:

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

Email and password are optional. If a password is supplied, email is required.

Registration workflow:

1. Validate input using Zod.
2. Normalize phone number and email.
3. Check duplicate phone, national ID, and email.
4. Verify and consume the signup OTP.
5. Create a User with `PATIENT` role.
6. Create PatientProfile.
7. Create AuthSession.
8. Generate Access Token.
9. Set the Refresh Token cookie.
10. Return user information and Access Token.

User creation, OTP consumption, profile creation, and session creation should be performed transactionally.

The client must not be allowed to choose its own role.

### 4.3 Email and Password Login

```http
POST /api/auth/login
Content-Type: application/json
```

Request:

```json
{
  "email": "test@example.com",
  "password": "ExamplePassword123"
}
```

Workflow:

1. Normalize email.
2. Find the user.
3. Verify account status.
4. Compare password using bcrypt.
5. Create a new session.
6. Update `lastLoginAt`.
7. Issue Access Token.
8. Set Refresh Token cookie.

Invalid credentials should return a generic response.

### 4.4 Refresh Token

```http
POST /api/auth/refresh
```

The client sends the Refresh Token using the HttpOnly cookie.

Workflow:

1. Read the refresh cookie.
2. Hash the supplied token.
3. Find the matching active session.
4. Validate session expiration and account status.
5. Rotate the Refresh Token.
6. Store the new token hash.
7. Issue a new Access Token.
8. Set a new Refresh Token cookie.

The previous Refresh Token must no longer be accepted.

### 4.5 Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

The current authenticated session is revoked.

Expected behavior:

- `revokedAt` is set.
- The refresh cookie is cleared.
- The old Access Token can no longer access protected endpoints because its session is revoked.
- The old Refresh Token cannot be used again.

### 4.6 Current User

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

Returns the currently authenticated user's information.

Example:

```json
{
  "user": {
    "id": "user_id",
    "name": "Test Patient",
    "email": "test@example.com",
    "role": "PATIENT"
  }
}
```

---

## 5. OTP Security

OTP implementation requirements:

- Generate cryptographically secure codes.
- Store only HMAC hashes.
- Set expiration time.
- Enforce maximum verification attempts.
- Enforce resend cooldown.
- Enforce daily request limits.
- Consume successful challenges exactly once.
- Prevent reuse of consumed codes.
- Avoid exposing OTP values in production logs.

### SMS Providers

The project uses an SMS provider abstraction.

Development:

```text
MockSmsProvider
```

Production:

```text
LimoSmsProvider
```

Provider selection is controlled by environment configuration.

Mock SMS must never be enabled in production.

---

## 6. Authorization

Authentication answers:

> Who is the current user?

Authorization answers:

> What is this user allowed to do?

Current roles:

| Role | Responsibility |
|---|---|
| PATIENT | Book appointments and manage personal records |
| DOCTOR | Manage doctor profile, availability, appointments, and visits |
| ADMIN | Manage platform resources and users |

Role authorization must be implemented independently from authentication.

A valid Access Token does not automatically grant permission to access every resource.

---

## 7. Environment Configuration

Sensitive configuration must remain in `.env` and must never be committed.

Expected configuration categories:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=
OTP_SECRET=
SMS_PROVIDER=mock
LIMOSMS_API_KEY=
LIMOSMS_SENDER_NUMBER=
NODE_ENV=development
```

The exact variable names must match the application's environment schema.

---

## 8. Current Implementation Status

| Feature | Status |
|---|---|
| OTP request | Implemented and tested |
| Mock SMS provider | Implemented and tested |
| OTP verification | Implemented and tested for registration |
| Patient registration | Implemented and tested |
| Patient profile creation | Implemented |
| Password hashing | Implemented |
| Email/password login | Implemented and tested |
| Access JWT | Implemented and tested |
| Refresh Token rotation | Implemented and tested |
| Session validation | Implemented and tested |
| Logout and session revocation | Implemented and tested |
| Inactive account rejection | Implemented and tested |
| OTP-based login | Pending |
| Password reset | Pending |
| Phone verification for existing accounts | Pending |
| Email verification | Pending |
| Rate limiting and security hardening | Pending |
| Role-based authorization policies | Pending |

---

## 9. Security Notes

Before production deployment:

1. Enable HTTPS and Secure cookies.
2. Add rate limiting to OTP and login endpoints.
3. Implement appropriate CSRF protection for cookie-based refresh requests.
4. Review OTP concurrency and replay protection.
5. Handle Prisma unique constraint errors safely.
6. Avoid logging secrets, passwords, tokens, and OTP values.
7. Implement session cleanup for expired records.
8. Add tests for revoked, expired, and reused tokens.
9. Implement account lockout or progressive delays where appropriate.
10. Review CORS and cookie domain configuration.

---

**Document status:** Initial authentication documentation.  
**Last updated:** 2026-11-07.