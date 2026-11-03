import type { ID, DateTimeString } from "./common";
import type { OtpChannel, OtpPurpose } from "./enums";
import type { AuthenticatedUser } from "./user";

export interface RequestOtpInput {
  destination: string;
  channel: OtpChannel;
  purpose: OtpPurpose;
}

export interface VerifyOtpInput {
  destination: string;
  channel: OtpChannel;
  purpose: OtpPurpose;
  code: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string;
  phone: string;
  email?: string;
  password?: string;
}

export interface PasswordLoginInput {
  /** Phone number or email, depending on the API login policy. */
  identifier: string;
  password: string;
}

export interface OtpLoginInput {
  phone: string;
  code: string;
}

export interface AuthSessionInfo {
  id: ID;
  expiresAt: DateTimeString;
  createdAt: DateTimeString;
}

export interface AuthResponse {
  user: AuthenticatedUser;
  session: AuthSessionInfo;
}

export interface PasswordResetRequestInput {
  destination: string;
  channel: OtpChannel;
}

export interface PasswordResetInput {
  token: string;
  newPassword: string;
}
