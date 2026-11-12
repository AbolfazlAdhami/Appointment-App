# Admin User Status API

## Change account status

`PATCH /api/admin/users/:userId/status`

Only an authenticated `ADMIN` may call this endpoint.

Request body:

```json
{
  "isActive": false,
  "reason": "Account review completed"
}
```

`isActive` must be boolean and `reason` is required (3–500 characters). Additional fields, including `role`, are rejected. The endpoint does not modify roles.

On a real status transition, the API updates the account and writes an `AuditLog` entry in one serializable transaction. Deactivation also revokes the target user's active sessions. An administrator cannot deactivate their own account or the last active administrator. Repeating the current status is idempotent and does not create another audit event.

Responses: `200` with `{ user, changed }`, `400` invalid request, `401` unauthenticated, `403` non-admin, `404` unknown user, `409` protected admin deactivation.

## List users

`GET /api/admin/users`

Only an authenticated `ADMIN` may call this endpoint. Optional query parameters:

- `cursor`: user ID returned as the prior page's `pagination.nextCursor`.
- `limit`: integer from 1 to 100; defaults to 25.
- `role`: `PATIENT`, `DOCTOR`, or `ADMIN`.
- `isActive`: `true` or `false`.

The response contains `users` and `pagination` (`limit`, `nextCursor`, `hasMore`). User rows expose only ID, first/last name, email, role, active state, created time, and last login time. Phone, national ID, password hash, and other sensitive fields are not selected. Unknown query parameters are rejected.

## Scope limitations

This endpoint does not provide free-text search, role changes, account deletion, appeal flow, or admin MFA. Those need separate product/security decisions and audited workflows.