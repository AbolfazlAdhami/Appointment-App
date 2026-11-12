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
| `profile.read.self` | Allow | Allow | Allow | User ID comes only from authenticated session |
| `profile.update.self` | Allow | Allow | Allow | Only first/last name; no client-selected owner or role change |
| `admin.users.status.update` | Deny | Deny | Allow | Reason required; no self-deactivation or last-active-admin deactivation; audit and session revoke on deactivation |

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
- CSRF protections for refresh-cookie requests remain a Phase 1 security-hardening item.

## Verification

`apps/api/src/middlewares/__tests__/authorization.middleware.test.ts` checks unauthenticated denial, role denial, allowed roles, action policy entries, and multi-role checks. `apps/api/src/services/__tests__/admin-user.service.test.ts` checks status transitions, session revocation, audit, self/last-admin protections, and validation. Route-level DB integration covers authorized/unauthorized status updates. Domain ownership/IDOR tests remain required as those routes are introduced.