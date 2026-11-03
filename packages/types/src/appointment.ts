import type { ID, DateTimeString, DecimalString, JsonValue } from "./common";

import type { AppointmentOfferStatus, AppointmentStatus, AppointmentType, AttendanceStatus, ConsultationMode, FollowUpStatus, OnlineConsultationStatus, RescheduleStatus, WaitlistStatus } from "./enums";

export interface Appointment {
  id: ID;
  patientProfileId: ID;
  doctorProfileId: ID;
  doctorServiceId: ID;

  appointmentType: AppointmentType;
  consultationMode: ConsultationMode;
  status: AppointmentStatus;

  startsAt: DateTimeString;
  endsAt: DateTimeString;
  timezone: string;
  bookedDurationMinutes: number;

  price: DecimalString;
  currency: string;

  paymentHoldExpiresAt: DateTimeString | null;
  confirmedAt: DateTimeString | null;
  cancelledAt: DateTimeString | null;
  cancellationReason: string | null;

  cancellationPolicyId: ID | null;
  cancellationPolicySnapshot: JsonValue | null;

  patientNotes: string | null;
  doctorNotes: string | null;

  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface AppointmentAttendance {
  id: ID;
  appointmentId: ID;
  status: AttendanceStatus;
  arrivedAt: DateTimeString | null;
  startedAt: DateTimeString | null;
  completedAt: DateTimeString | null;
  note: string | null;
  updatedById: ID | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface AppointmentReschedule {
  id: ID;
  appointmentId: ID;
  requestedStartsAt: DateTimeString;
  requestedEndsAt: DateTimeString;
  status: RescheduleStatus;
  reason: string | null;
  responseNote: string | null;
  respondedAt: DateTimeString | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface WaitlistEntry {
  id: ID;
  patientProfileId: ID;
  doctorProfileId: ID;
  doctorServiceId: ID;
  desiredFrom: DateTimeString | null;
  desiredUntil: DateTimeString | null;
  status: WaitlistStatus;
  notes: string | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface AppointmentOffer {
  id: ID;
  waitlistEntryId: ID;
  doctorServiceId: ID;
  startsAt: DateTimeString;
  endsAt: DateTimeString;
  status: AppointmentOfferStatus;
  expiresAt: DateTimeString;
  respondedAt: DateTimeString | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface OnlineConsultation {
  id: ID;
  appointmentId: ID;
  provider: string;
  externalMeetingId: string | null;
  meetingUrl: string | null;
  status: OnlineConsultationStatus;
  startsAt: DateTimeString;
  endsAt: DateTimeString;
  startedAt: DateTimeString | null;
  completedAt: DateTimeString | null;
  metadata: JsonValue | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface FollowUpRecommendation {
  id: ID;
  visitRecordId: ID;
  patientProfileId: ID;
  doctorProfileId: ID;
  suggestedFrom: DateTimeString | null;
  suggestedUntil: DateTimeString | null;
  recommendedDate: string | null;
  notes: string | null;
  status: FollowUpStatus;
  respondedAt: DateTimeString | null;
  expiresAt: DateTimeString | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface CreateAppointmentInput {
  doctorProfileId: ID;
  doctorServiceId: ID;
  startsAt: DateTimeString;
  patientNotes?: string;
}

export interface RequestAppointmentRescheduleInput {
  requestedStartsAt: DateTimeString;
  requestedEndsAt: DateTimeString;
  reason?: string;
}

export interface CreateWaitlistEntryInput {
  doctorProfileId: ID;
  doctorServiceId: ID;
  desiredFrom?: DateTimeString;
  desiredUntil?: DateTimeString;
  notes?: string;
}
