# Doctor Self-Profile API

## Endpoints

### Read own profile

`GET /api/doctor/profile/me`

Requires an authenticated account with role `DOCTOR`. The API finds the `DoctorProfile` through the authenticated session's `userId`; it does not accept a user ID or profile ID from the client.

### Update own profile

`PATCH /api/doctor/profile/me`

Requires an authenticated `DOCTOR`. Accepts only `headline`, `shortIntroduction`, `biography`, `yearsOfExperience`, and `videoUrl`. Unknown fields such as `userId`, `verificationStatus`, `isPublished`, reviewer fields, specialties, credentials, or role are rejected.

Profiles in `APPROVED` or `SUSPENDED` status are read-only and return `409`. Other statuses can update only the allowlisted descriptive fields; this endpoint does not submit, publish, approve, or otherwise advance verification workflow.

Responses: `200` profile, `400` invalid fields, `401` unauthenticated, `403` non-doctor role, `404` no profile exists for the authenticated user, `409` approved/suspended profile is read-only.

## Authorization boundary and open decisions

- Ownership is enforced using authenticated `userId` in database reads and conditional writes.
- Admin review endpoints and public doctor directory are not included here.
- Editing a profile after submission but before approval is currently allowed. Product/security should decide whether submitted profiles must become read-only or edits should invalidate/restart review.
- Credentials, specialty changes, publication, clinic membership, and any patient/appointment/clinical data access require separate policies and audited workflows.