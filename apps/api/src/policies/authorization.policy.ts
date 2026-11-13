import { Role } from "../generated/prisma/client";

/**
 * Central policy table for HTTP actions. A missing action is denied by default.
 * Keep resource ownership checks in the relevant service/query; role membership
 * alone never grants access to another user's resource.
 *
 * IMPLEMENTED actions are enforced in middleware/routes above.
 * PLANNED actions are declared here so future endpoints inherit the correct
 * role constraints without requiring ad-hoc decisions.
 */
export const authorizationPolicy = {
  // ── Auth & Account (IMPLEMENTED) ────────────────────────────────
  "auth.me": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "auth.logout": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "contact.sendOtp": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "contact.verifyEmail": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "contact.verifyPhone": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],

  // ── Self Profile (IMPLEMENTED) ──────────────────────────────────
  "profile.read.self": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "profile.update.self": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "doctor.profile.read.self": [Role.DOCTOR],
  "doctor.profile.update.self": [Role.DOCTOR],
  "doctor.profile.create.self": [Role.DOCTOR],
  "doctor.profile.submit.self": [Role.DOCTOR],

  // ── File Assets (IMPLEMENTED) ───────────────────────────────────
  "file.upload.self": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "file.read.self": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],

  // ── Admin User Management (IMPLEMENTED) ─────────────────────────
  "admin.users.status.update": [Role.ADMIN],
  "admin.users.list": [Role.ADMIN],

  // ── Admin Domain Review (PLANNED) ───────────────────────────────
  "admin.credential.review": [Role.ADMIN],
  "admin.doctorProfile.approve": [Role.ADMIN],
  "admin.doctorProfile.reject": [Role.ADMIN],

  // ── Appointments (PLANNED) ──────────────────────────────────────
  "appointment.read.own": [Role.PATIENT],
  "appointment.read.doctorOwn": [Role.DOCTOR],
  "appointment.read.admin": [Role.ADMIN],
  "appointment.cancel.own": [Role.PATIENT],
  "appointment.attendance.update": [Role.DOCTOR],
  "appointment.reassign": [Role.ADMIN],
  "appointment.forceCancel": [Role.ADMIN],

  // ── Clinical Records (PLANNED) ──────────────────────────────────
  "clinical.record.read.doctorOwn": [Role.DOCTOR],
  "clinical.record.read.own": [Role.PATIENT],
  "clinical.record.read.admin": [Role.ADMIN],
  "clinical.auditLogRead": [Role.ADMIN],

  // ── Appeals & Reinstatement (PLANNED) ───────────────────────────
  "appeal.create": [Role.PATIENT, Role.DOCTOR],
  "appeal.list": [Role.ADMIN],
  "appeal.read": [Role.ADMIN],

  // ── Public Doctor Directory (IMPLEMENTED) ─────────────────────────
  "doctor.list": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "doctor.read.public": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "doctor.services.read": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],

  // ── Doctor Specialty & Credential Management (IMPLEMENTED) ────────
  "doctor.specialty.manage": [Role.DOCTOR],
  "doctor.credential.manage": [Role.DOCTOR],

  // ── Admin Doctor Review (PLANNED) ─────────────────────────────────
  "admin.doctorProfile.review.list": [Role.ADMIN],
  "admin.doctorProfile.review.detail": [Role.ADMIN],
} as const satisfies Record<string, readonly Role[]>;

export type AuthorizationAction = keyof typeof authorizationPolicy;

export function rolesForAction(action: AuthorizationAction): readonly Role[] {
  return authorizationPolicy[action];
}
