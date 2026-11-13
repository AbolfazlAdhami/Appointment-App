# Authorization Policy — Phase 2 (Increment 1)

**Status:** Foundational policy only; not a complete application permission matrix.  
**Reviewed:** 2026-11-07

## Policy layers

Authorization has two separate checks:

1. **Role/action policy:** whether the authenticated account type may invoke an action. The API centralizes current auth-action rules in `apps/api/src/policies/authorization.policy.ts` and enforces them with `authenticate` followed by `authorizeAction`.
2. **Resource ownership/relationship:** whether this account may access the particular record. This must be enforced in the relevant service/database query, using the authenticated user ID and the resource's patient/doctor relationship. A role check alone is never sufficient for patient data.

Missing policy actions must not be treated as public access. Protected routes must explicitly use authentication and authorization middleware. Public routes should be intentionally declared public in route code and API documentation.

## Current auth action matrix

| Action | Patient | Doctor | Admin | Additional authorization |
|---|---:|---:|---:|---|
| `auth.me` | Allow | Allow | Allow | Session must be active |
| `auth.logout` | Allow | Allow | Allow | Revokes only the caller's session |
| `contact.sendOtp` | Allow | Allow | Allow | Requires phone/email destination + purpose enum; rate-limited per destination |
| `contact.verifyPhone` | Allow | Allow | Allow | Authenticated; verifies OTP against `OtpPurpose.PHONE_VERIFICATION` challenge, sets `phoneVerifiedAt` |
| `contact.verifyEmail` | Allow | Allow | Allow | Authenticated; verifies OTP against EMAIL channel challenge, sets `emailVerifiedAt` |
| `profile.read.self` | Allow | Allow | Allow | User ID comes only from authenticated session |
| `profile.update.self` | Allow | Allow | Allow | Only first/last name; no client-selected owner or role change |
| `admin.users.list` | Deny | Deny | Allow | Bounded cursor pagination; sensitive identifiers omitted |
| `admin.users.status.update` | Deny | Deny | Allow | Reason required; no self-deactivation or last-active-admin deactivation; audit and session revoke on deactivation; extended to role-transition logging |
| `doctor.profile.read.self` | Deny | Allow | Deny | DoctorProfile selected by authenticated User ID |
| `doctor.profile.update.self` | Deny | Allow | Deny | Allowlisted fields only; approved/suspended profiles are read-only |
| `appeal.create` | Allow | Allow | Deny | Submitted by deactivated/pending users; enters PENDING state |
| `appeal.list` | Deny | Deny | Allow | Admin-only list of non-rejected appeals with cursor pagination |
| `appeal.read` | Deny | Deny | Allow | Admin review action; records reviewer ID, note, and timestamp |
| `admin.credential.review` | Deny | Deny | Allow | Restricted to assigned reviewers |
| `admin.doctorProfile.approve` | Deny | Deny | Allow | Triggers published state transition |
| `admin.doctorProfile.reject` | Deny | Deny | Allow | Returns profile to DRAFT/NEEDS_CORRECTION |
| `appointment.read.own` | Allow | Deny | Deny | Patient sees own appointments only |
| `appointment.read.doctorOwn` | Deny | Allow | Deny | Doctor sees assigned schedule only |
| `appointment.read.admin` | Deny | Deny | Allow | Audit access; requires justification logged |
| `appointment.cancel.own` | Allow | Deny | Deny | Patient may cancel pending payments only |
| `appointment.attendance.update` | Deny | Allow | Deny | Doctor marks arrival/completion |
| `appointment.reassign` | Deny | Deny | Allow | Admin override |
| `appointment.forceCancel` | Deny | Deny | Allow | Admin override for policy violations |
| `clinical.record.read.doctorOwn` | Deny | Allow | Deny | Doctor reads/writes own visit records |
| `clinical.record.read.own` | Allow | Deny | Deny | Patient reads own clinical records |
| `clinical.record.read.admin` | Deny | Deny | Allow | Audit access; justification logged via `clinical.auditLogRead` |
| `clinical.auditLogRead` | Deny | Deny | Allow | Gate for admin clinical audit trails |

Registration, OTP request, login, and refresh remain public/session-bootstrap actions. Their own request validation and OTP/session rules still apply.

## Role boundaries

- Role is loaded from the database during authentication; do not accept a role from request input or trust one from an access token.
- Registration creates a Patient. No public API may assign Doctor or Admin role.
- Admin role changes require a separately defined, audited administrative workflow; account status management does not grant role-management capability.
- Patient/doctor record ownership rules must be specified before their endpoints are implemented. Do not infer ownership from a client-provided profile ID.

## Current limitations / next decisions

- This policy is not yet the complete Patient/Doctor/Admin business-module permission matrix.
- No doctor, appointment, or medical-record routes are present; IDOR protection must be implemented and tested with those resources when added.
- Self-profile routes expose/update only the authenticated user's own basic profile. Admin account status actions are limited to activate/deactivate and do not allow role changes.
- Admin identity provisioning, MFA, role transitions, and broader audit retention/access policies need product/security decisions.
- Admin user list intentionally has no national ID, phone, password hash, arbitrary search, or bulk actions.
- Doctor self-profile endpoints do not accept a doctor/profile ID from the client. Public listing, admin review, specialties, credentials, and doctor-patient data access remain separate scopes.
- No appointment or clinical-record HTTP route exists yet. The Prisma relations are not an authorization decision; clinical sharing rules must be approved before adding those routes.
- Email/phone verification lifecycle, account appeal/reinstatement, and admin role transition workflows remain unimplemented.
- CSRF protections for refresh-cookie requests remain a Phase 1 security-hardening item.

## Verification

`apps/api/src/middlewares/__tests__/authorization.middleware.test.ts` checks unauthenticated denial, role denial, allowed roles, action policy entries, and multi-role checks. `apps/api/src/services/__tests__/admin-user.service.test.ts` checks status transitions, session revocation, audit, self/last-admin protections, and validation. `apps/api/src/services/__tests__/admin-user-list.service.test.ts` checks bounded paging and field selection. `apps/api/src/services/__tests__/doctor-profile.service.test.ts` checks user-scoped lookup, writes, and immutable approved/suspended status. DB integration covers Patient denial and Doctor self-profile behavior. Appointment/clinical IDOR tests are a prerequisite for those routes and remain open.