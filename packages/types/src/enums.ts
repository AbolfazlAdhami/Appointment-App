export const Role = ["PATIENT", "DOCTOR", "ADMIN"] as const;
export type Role = (typeof Role)[number];

export const OtpPurpose = ["SIGNUP", "LOGIN", "PHONE_VERIFICATION", "PASSWORD_RESET"] as const;
export type OtpPurpose = (typeof OtpPurpose)[number];

export const OtpChannel = ["SMS", "EMAIL"] as const;
export type OtpChannel = (typeof OtpChannel)[number];

export const NationalIdChangeStatus = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"] as const;
export type NationalIdChangeStatus = (typeof NationalIdChangeStatus)[number];

export const AuditActorType = ["USER", "ADMIN", "SYSTEM", "EXTERNAL_SERVICE"] as const;
export type AuditActorType = (typeof AuditActorType)[number];

export const AuditOutcome = ["SUCCESS", "FAILURE"] as const;
export type AuditOutcome = (typeof AuditOutcome)[number];

export const SecurityEventType = ["LOGIN_SUCCESS", "LOGIN_FAILURE", "LOGOUT", "OTP_FAILURE", "PASSWORD_CHANGED", "ACCOUNT_LOCKED", "SUSPICIOUS_ACTIVITY", "SESSION_REVOKED"] as const;
export type SecurityEventType = (typeof SecurityEventType)[number];

export const DoctorCredentialType = ["MEDICAL_LICENSE", "MEDICAL_COUNCIL_CARD", "EDUCATION_CERTIFICATE", "CV", "ID_DOCUMENT", "OTHER"] as const;
export type DoctorCredentialType = (typeof DoctorCredentialType)[number];

export const CredentialStatus = ["PENDING_REVIEW", "APPROVED", "REJECTED", "NEEDS_CORRECTION", "EXPIRED"] as const;
export type CredentialStatus = (typeof CredentialStatus)[number];

export const CredentialReviewDecision = ["APPROVED", "REJECTED", "NEEDS_CORRECTION"] as const;
export type CredentialReviewDecision = (typeof CredentialReviewDecision)[number];

export const DoctorVerificationStatus = ["DRAFT", "PENDING_REVIEW", "NEEDS_CORRECTION", "APPROVED", "REJECTED", "SUSPENDED"] as const;
export type DoctorVerificationStatus = (typeof DoctorVerificationStatus)[number];

export const MedicalHistoryStatus = ["ACTIVE", "RESOLVED", "INACTIVE"] as const;
export type MedicalHistoryStatus = (typeof MedicalHistoryStatus)[number];

export const AllergySeverity = ["MILD", "MODERATE", "SEVERE", "LIFE_THREATENING", "UNKNOWN"] as const;
export type AllergySeverity = (typeof AllergySeverity)[number];

export const AllergyStatus = ["ACTIVE", "INACTIVE", "UNCONFIRMED"] as const;
export type AllergyStatus = (typeof AllergyStatus)[number];

export const MedicationStatus = ["ACTIVE", "COMPLETED", "DISCONTINUED", "ON_HOLD"] as const;
export type MedicationStatus = (typeof MedicationStatus)[number];

export const FamilyRelation = ["MOTHER", "FATHER", "SISTER", "BROTHER", "CHILD", "MATERNAL_GRANDMOTHER", "MATERNAL_GRANDFATHER", "PATERNAL_GRANDMOTHER", "PATERNAL_GRANDFATHER", "OTHER", "UNKNOWN"] as const;
export type FamilyRelation = (typeof FamilyRelation)[number];

export const AppointmentType = ["REGULAR", "URGENT", "PRE_OPERATIVE", "POST_OPERATIVE", "FOLLOW_UP", "CONSULTATION"] as const;
export type AppointmentType = (typeof AppointmentType)[number];

export const ConsultationMode = ["IN_PERSON", "ONLINE"] as const;
export type ConsultationMode = (typeof ConsultationMode)[number];

export const AvailabilityOverrideType = ["AVAILABLE", "UNAVAILABLE"] as const;
export type AvailabilityOverrideType = (typeof AvailabilityOverrideType)[number];

export const RescheduleStatus = ["REQUESTED", "ACCEPTED", "REJECTED", "CANCELLED"] as const;
export type RescheduleStatus = (typeof RescheduleStatus)[number];

export const WaitlistStatus = ["ACTIVE", "OFFERED", "BOOKED", "CANCELLED", "EXPIRED"] as const;
export type WaitlistStatus = (typeof WaitlistStatus)[number];

export const DayOfWeek = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const;
export type DayOfWeek = (typeof DayOfWeek)[number];

export const AppointmentStatus = ["PENDING_PAYMENT", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"] as const;
export type AppointmentStatus = (typeof AppointmentStatus)[number];

export const AppointmentOfferStatus = ["PENDING", "ACCEPTED", "DECLINED", "EXPIRED", "CANCELLED"] as const;
export type AppointmentOfferStatus = (typeof AppointmentOfferStatus)[number];

export const AttendanceStatus = ["SCHEDULED", "ARRIVED", "IN_PROGRESS", "COMPLETED", "NO_SHOW"] as const;
export type AttendanceStatus = (typeof AttendanceStatus)[number];

export const PaymentProvider = ["GATEWAY", "CASH", "MANUAL"] as const;
export type PaymentProvider = (typeof PaymentProvider)[number];

export const PaymentPurpose = ["CONSULTATION", "PLATFORM_FEE", "OTHER"] as const;
export type PaymentPurpose = (typeof PaymentPurpose)[number];

export const PaymentStatus = ["PENDING", "PROCESSING", "PAID", "FAILED", "REFUND_PENDING", "PARTIALLY_REFUNDED", "REFUNDED"] as const;
export type PaymentStatus = (typeof PaymentStatus)[number];

export const RefundStatus = ["PENDING", "PROCESSING", "SUCCEEDED", "FAILED", "CANCELLED"] as const;
export type RefundStatus = (typeof RefundStatus)[number];

export const FeePayer = ["PATIENT", "DOCTOR"] as const;
export type FeePayer = (typeof FeePayer)[number];

export const PlatformFeeType = ["FIXED", "PERCENTAGE", "FIXED_PLUS_PERCENTAGE"] as const;
export type PlatformFeeType = (typeof PlatformFeeType)[number];

export const WalletTransactionType = ["CONSULTATION_INCOME", "PLATFORM_FEE", "REFUND_DEBIT", "PAYOUT_RESERVATION", "PAYOUT_RELEASE", "PAYOUT_COMPLETED", "ADJUSTMENT_CREDIT", "ADJUSTMENT_DEBIT"] as const;
export type WalletTransactionType = (typeof WalletTransactionType)[number];

export const WalletTransactionStatus = ["PENDING", "POSTED", "REVERSED"] as const;
export type WalletTransactionStatus = (typeof WalletTransactionStatus)[number];

export const PayoutPeriodUnit = ["WEEKLY", "MONTHLY", "CUSTOM"] as const;
export type PayoutPeriodUnit = (typeof PayoutPeriodUnit)[number];

export const PayoutRequestStatus = ["REQUESTED", "APPROVED", "REJECTED", "PROCESSING", "PAID", "FAILED", "CANCELLED"] as const;
export type PayoutRequestStatus = (typeof PayoutRequestStatus)[number];

export const PayoutTransferStatus = ["PENDING", "PROCESSING", "SUCCEEDED", "FAILED"] as const;
export type PayoutTransferStatus = (typeof PayoutTransferStatus)[number];

export const PayoutApprovalDecision = ["APPROVED", "REJECTED"] as const;
export type PayoutApprovalDecision = (typeof PayoutApprovalDecision)[number];

export const VisitStatus = ["IN_PROGRESS", "COMPLETED", "AMENDED"] as const;
export type VisitStatus = (typeof VisitStatus)[number];

export const PrescriptionStatus = ["DRAFT", "ISSUED", "CANCELLED", "EXPIRED"] as const;
export type PrescriptionStatus = (typeof PrescriptionStatus)[number];

export const PrescriptionItemStatus = ["ACTIVE", "DISCONTINUED"] as const;
export type PrescriptionItemStatus = (typeof PrescriptionItemStatus)[number];

export const DoctorOrderStatus = ["ACTIVE", "COMPLETED", "CANCELLED"] as const;
export type DoctorOrderStatus = (typeof DoctorOrderStatus)[number];

export const DoctorOrderType = ["LAB_TEST", "IMAGING", "REFERRAL", "PROCEDURE", "LIFESTYLE", "OTHER"] as const;
export type DoctorOrderType = (typeof DoctorOrderType)[number];

export const MedicalDocumentType = ["LAB_RESULT", "IMAGING", "REFERRAL", "DISCHARGE_SUMMARY", "PRESCRIPTION", "OTHER"] as const;
export type MedicalDocumentType = (typeof MedicalDocumentType)[number];

export const ExternalPrescriptionStatus = ["PENDING", "SUBMITTED", "ACCEPTED", "REJECTED", "FAILED"] as const;
export type ExternalPrescriptionStatus = (typeof ExternalPrescriptionStatus)[number];

export const OnlineConsultationStatus = ["SCHEDULED", "STARTED", "COMPLETED", "CANCELLED", "FAILED"] as const;
export type OnlineConsultationStatus = (typeof OnlineConsultationStatus)[number];

export const FollowUpStatus = ["PENDING", "ACCEPTED", "DECLINED", "BOOKED", "EXPIRED", "CANCELLED"] as const;
export type FollowUpStatus = (typeof FollowUpStatus)[number];

export const ConversationType = ["PATIENT_DOCTOR", "SUPPORT"] as const;
export type ConversationType = (typeof ConversationType)[number];

export const MessageType = ["TEXT", "IMAGE", "FILE", "SYSTEM"] as const;
export type MessageType = (typeof MessageType)[number];

export const NotificationChannel = ["IN_APP", "SMS", "EMAIL"] as const;
export type NotificationChannel = (typeof NotificationChannel)[number];

export const NotificationStatus = ["PENDING", "PROCESSING", "SENT", "FAILED", "READ"] as const;
export type NotificationStatus = (typeof NotificationStatus)[number];

export const NotificationDeliveryStatus = ["PENDING", "PROCESSING", "SENT", "DELIVERED", "FAILED"] as const;
export type NotificationDeliveryStatus = (typeof NotificationDeliveryStatus)[number];

export const ClinicMembershipRole = ["OWNER", "ADMIN", "STAFF"] as const;
export type ClinicMembershipRole = (typeof ClinicMembershipRole)[number];

export const InsuranceStatus = ["ACTIVE", "EXPIRED", "INACTIVE"] as const;
export type InsuranceStatus = (typeof InsuranceStatus)[number];

export const CancellationPolicyScope = ["PATIENT", "DOCTOR", "BOTH"] as const;
export type CancellationPolicyScope = (typeof CancellationPolicyScope)[number];
