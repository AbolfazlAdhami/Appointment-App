import { Role } from "../generated/prisma/client";

/**
 * Central policy table for HTTP actions. A missing action is denied by default.
 * Keep resource ownership checks in the relevant service/query; role membership
 * alone never grants access to another user's resource.
 */
export const authorizationPolicy = {
  "auth.me": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "auth.logout": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "profile.read.self": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "profile.update.self": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "file.upload.self": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
  "file.read.self": [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
} as const satisfies Record<string, readonly Role[]>;

export type AuthorizationAction = keyof typeof authorizationPolicy;

export function rolesForAction(action: AuthorizationAction): readonly Role[] {
  return authorizationPolicy[action];
}