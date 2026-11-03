import type { ID, DateTimeString, DecimalString } from "./common";

import type { AppointmentType, AvailabilityOverrideType, ClinicMembershipRole, ConsultationMode, CredentialStatus, DoctorCredentialType, DoctorVerificationStatus, DayOfWeek } from "./enums";

export interface DoctorProfile {
  id: ID;
  userId: ID;
  headline: string | null;
  shortIntroduction: string | null;
  biography: string | null;
  yearsOfExperience: number | null;
  videoUrl: string | null;
  verificationStatus: DoctorVerificationStatus;
  submittedAt: DateTimeString | null;
  reviewedAt: DateTimeString | null;
  isPublished: boolean;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface Specialty {
  id: ID;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
}

export interface DoctorSpecialty {
  id: ID;
  specialtyId: ID;
  isPrimary: boolean;
  specialty?: Specialty;
}

export interface DoctorCredential {
  id: ID;
  doctorProfileId: ID;
  fileAssetId: ID;
  type: DoctorCredentialType;
  status: CredentialStatus;
  credentialNumber: string | null;
  issuedAt: DateTimeString | null;
  expiresAt: DateTimeString | null;
  submittedAt: DateTimeString;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface DoctorService {
  id: ID;
  doctorProfileId: ID;
  name: string;
  description: string | null;
  appointmentType: AppointmentType;
  consultationMode: ConsultationMode;
  durationMinutes: number;
  price: DecimalString;
  currency: string;
  isActive: boolean;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface DoctorWeeklyAvailability {
  id: ID;
  doctorProfileId: ID;
  dayOfWeek: DayOfWeek;
  startMinute: number;
  endMinute: number;
  timezone: string;
  isActive: boolean;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface AvailabilityOverride {
  id: ID;
  doctorProfileId: ID;
  type: AvailabilityOverrideType;
  startsAt: DateTimeString;
  endsAt: DateTimeString;
  reason: string | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface Clinic {
  id: ID;
  name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  latitude: DecimalString | null;
  longitude: DecimalString | null;
  isActive: boolean;
}

export interface ClinicMembership {
  id: ID;
  clinicId: ID;
  doctorProfileId: ID;
  role: ClinicMembershipRole;
  isPrimary: boolean;
  createdAt: DateTimeString;
  clinic?: Clinic;
}

export interface CreateDoctorServiceInput {
  name: string;
  description?: string;
  appointmentType?: AppointmentType;
  consultationMode: ConsultationMode;
  durationMinutes: number;
  price: DecimalString;
  currency?: string;
}

export interface CreateWeeklyAvailabilityInput {
  dayOfWeek: DayOfWeek;
  startMinute: number;
  endMinute: number;
  timezone?: string;
}

export interface CreateAvailabilityOverrideInput {
  type: AvailabilityOverrideType;
  startsAt: DateTimeString;
  endsAt: DateTimeString;
  reason?: string;
}
