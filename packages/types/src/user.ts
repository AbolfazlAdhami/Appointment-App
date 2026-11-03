import type { ID, DateString, DateTimeString } from "./common";
import type { Role } from "./enums";

/**
 * Minimum user information suitable for displaying
 * a user in general application interfaces.
 */
export interface UserSummary {
  id: ID;
  firstName: string;
  lastName: string;
  role: Role;
  avatarFileId: ID | null;
}

/**
 * Private account information.
 * Use only in authorized self-profile or admin responses.
 */
export interface UserAccount {
  id: ID;
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: DateString;
  phone: string;
  phoneVerifiedAt: DateTimeString | null;
  email: string | null;
  emailVerifiedAt: DateTimeString | null;
  role: Role;
  isActive: boolean;
  lastLoginAt: DateTimeString | null;
  avatarFileId: ID | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

/** User information attached to an authenticated request. */
export interface AuthenticatedUser {
  id: ID;
  firstName: string;
  lastName: string;
  email: string | null;
  role: Role;
  isActive: boolean;
}

export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: DateString;
  email?: string | null;
  avatarFileId?: ID | null;
}
