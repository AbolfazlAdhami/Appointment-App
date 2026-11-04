/*
  Warnings:

  - The values [PENDING] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `diagnosis` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `followUpDate` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `prescription` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `visitNotes` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `AvailabilityOverride` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `AvailabilityOverride` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `AvailabilityOverride` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `AvailabilityOverride` table. All the data in the column will be lost.
  - You are about to drop the column `about` on the `DoctorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `consultationFee` on the `DoctorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `DoctorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `experienceYears` on the `DoctorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `DoctorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `DoctorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `DoctorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `DoctorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `DoctorWeeklyAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `slotDurationMin` on the `DoctorWeeklyAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `DoctorWeeklyAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `allergies` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `chronicDiseases` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `currentMedications` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContact` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nationalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatarFileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointmentType` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookedDurationMinutes` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consultationMode` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorProfileId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorServiceId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endsAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientProfileId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startsAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endsAt` to the `AvailabilityOverride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startsAt` to the `AvailabilityOverride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `AvailabilityOverride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endMinute` to the `DoctorWeeklyAvailability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startMinute` to the `DoctorWeeklyAvailability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('SIGNUP', 'LOGIN', 'PHONE_VERIFICATION', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "OtpChannel" AS ENUM ('SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "NationalIdChangeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuditActorType" AS ENUM ('USER', 'ADMIN', 'SYSTEM', 'EXTERNAL_SERVICE');

-- CreateEnum
CREATE TYPE "AuditOutcome" AS ENUM ('SUCCESS', 'FAILURE');

-- CreateEnum
CREATE TYPE "SecurityEventType" AS ENUM ('LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT', 'OTP_FAILURE', 'PASSWORD_CHANGED', 'ACCOUNT_LOCKED', 'SUSPICIOUS_ACTIVITY', 'SESSION_REVOKED');

-- CreateEnum
CREATE TYPE "DoctorCredentialType" AS ENUM ('MEDICAL_LICENSE', 'MEDICAL_COUNCIL_CARD', 'EDUCATION_CERTIFICATE', 'CV', 'ID_DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "CredentialStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_CORRECTION', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CredentialReviewDecision" AS ENUM ('APPROVED', 'REJECTED', 'NEEDS_CORRECTION');

-- CreateEnum
CREATE TYPE "DoctorVerificationStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'NEEDS_CORRECTION', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MedicalHistoryStatus" AS ENUM ('ACTIVE', 'RESOLVED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AllergySeverity" AS ENUM ('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AllergyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'UNCONFIRMED');

-- CreateEnum
CREATE TYPE "MedicationStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DISCONTINUED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "FamilyRelation" AS ENUM ('MOTHER', 'FATHER', 'SISTER', 'BROTHER', 'CHILD', 'MATERNAL_GRANDMOTHER', 'MATERNAL_GRANDFATHER', 'PATERNAL_GRANDMOTHER', 'PATERNAL_GRANDFATHER', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('REGULAR', 'URGENT', 'PRE_OPERATIVE', 'POST_OPERATIVE', 'FOLLOW_UP', 'CONSULTATION');

-- CreateEnum
CREATE TYPE "ConsultationMode" AS ENUM ('IN_PERSON', 'ONLINE');

-- CreateEnum
CREATE TYPE "AvailabilityOverrideType" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "RescheduleStatus" AS ENUM ('REQUESTED', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WaitlistStatus" AS ENUM ('ACTIVE', 'OFFERED', 'BOOKED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AppointmentOfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('SCHEDULED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('GATEWAY', 'CASH', 'MANUAL');

-- CreateEnum
CREATE TYPE "PaymentPurpose" AS ENUM ('CONSULTATION', 'PLATFORM_FEE', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUND_PENDING', 'PARTIALLY_REFUNDED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FeePayer" AS ENUM ('PATIENT', 'DOCTOR');

-- CreateEnum
CREATE TYPE "PlatformFeeType" AS ENUM ('FIXED', 'PERCENTAGE', 'FIXED_PLUS_PERCENTAGE');

-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('CONSULTATION_INCOME', 'PLATFORM_FEE', 'REFUND_DEBIT', 'PAYOUT_RESERVATION', 'PAYOUT_RELEASE', 'PAYOUT_COMPLETED', 'ADJUSTMENT_CREDIT', 'ADJUSTMENT_DEBIT');

-- CreateEnum
CREATE TYPE "WalletTransactionStatus" AS ENUM ('PENDING', 'POSTED', 'REVERSED');

-- CreateEnum
CREATE TYPE "PayoutPeriodUnit" AS ENUM ('WEEKLY', 'MONTHLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PayoutRequestStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayoutTransferStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "PayoutApprovalDecision" AS ENUM ('APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'AMENDED');

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('DRAFT', 'ISSUED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PrescriptionItemStatus" AS ENUM ('ACTIVE', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "DoctorOrderStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DoctorOrderType" AS ENUM ('LAB_TEST', 'IMAGING', 'REFERRAL', 'PROCEDURE', 'LIFESTYLE', 'OTHER');

-- CreateEnum
CREATE TYPE "MedicalDocumentType" AS ENUM ('LAB_RESULT', 'IMAGING', 'REFERRAL', 'DISCHARGE_SUMMARY', 'PRESCRIPTION', 'OTHER');

-- CreateEnum
CREATE TYPE "ExternalPrescriptionStatus" AS ENUM ('PENDING', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "OnlineConsultationStatus" AS ENUM ('SCHEDULED', 'STARTED', 'COMPLETED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "FollowUpStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BOOKED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('PATIENT_DOCTOR', 'SUPPORT');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'READ');

-- CreateEnum
CREATE TYPE "NotificationDeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'DELIVERED', 'FAILED');

-- CreateEnum
CREATE TYPE "ClinicMembershipRole" AS ENUM ('OWNER', 'ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "InsuranceStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CancellationPolicyScope" AS ENUM ('PATIENT', 'DOCTOR', 'BOTH');

-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
ALTER TABLE "public"."Appointment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Appointment" ALTER COLUMN "status" TYPE "AppointmentStatus_new" USING ("status"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "public"."AppointmentStatus_old";
ALTER TABLE "Appointment" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "AvailabilityOverride" DROP CONSTRAINT "AvailabilityOverride_doctorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorProfile" DROP CONSTRAINT "DoctorProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorWeeklyAvailability" DROP CONSTRAINT "DoctorWeeklyAvailability_doctorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "PatientProfile" DROP CONSTRAINT "PatientProfile_userId_fkey";

-- DropIndex
DROP INDEX "Appointment_doctorId_startTime_idx";

-- DropIndex
DROP INDEX "Appointment_doctorId_startTime_key";

-- DropIndex
DROP INDEX "Appointment_patientId_startTime_idx";

-- DropIndex
DROP INDEX "Appointment_status_startTime_idx";

-- DropIndex
DROP INDEX "AvailabilityOverride_doctorProfileId_date_idx";

-- DropIndex
DROP INDEX "AvailabilityOverride_doctorProfileId_date_key";

-- DropIndex
DROP INDEX "DoctorProfile_isVerified_isAvailable_idx";

-- DropIndex
DROP INDEX "DoctorProfile_specialization_idx";

-- DropIndex
DROP INDEX "DoctorWeeklyAvailability_doctorProfileId_dayOfWeek_idx";

-- DropIndex
DROP INDEX "DoctorWeeklyAvailability_doctorProfileId_dayOfWeek_startTim_key";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_role_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "diagnosis",
DROP COLUMN "doctorId",
DROP COLUMN "endTime",
DROP COLUMN "followUpDate",
DROP COLUMN "notes",
DROP COLUMN "patientId",
DROP COLUMN "prescription",
DROP COLUMN "reason",
DROP COLUMN "startTime",
DROP COLUMN "visitNotes",
ADD COLUMN     "appointmentType" "AppointmentType" NOT NULL,
ADD COLUMN     "bookedDurationMinutes" INTEGER NOT NULL,
ADD COLUMN     "cancellationPolicyId" TEXT,
ADD COLUMN     "cancellationPolicySnapshot" JSONB,
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "consultationMode" "ConsultationMode" NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'IRR',
ADD COLUMN     "doctorNotes" TEXT,
ADD COLUMN     "doctorProfileId" TEXT NOT NULL,
ADD COLUMN     "doctorServiceId" TEXT NOT NULL,
ADD COLUMN     "endsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "patientNotes" TEXT,
ADD COLUMN     "patientProfileId" TEXT NOT NULL,
ADD COLUMN     "paymentHoldExpiresAt" TIMESTAMP(3),
ADD COLUMN     "price" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Tehran',
ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "AvailabilityOverride" DROP COLUMN "date",
DROP COLUMN "endTime",
DROP COLUMN "isAvailable",
DROP COLUMN "startTime",
ADD COLUMN     "endsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" "AvailabilityOverrideType" NOT NULL;

-- AlterTable
ALTER TABLE "DoctorProfile" DROP COLUMN "about",
DROP COLUMN "consultationFee",
DROP COLUMN "education",
DROP COLUMN "experienceYears",
DROP COLUMN "isAvailable",
DROP COLUMN "isVerified",
DROP COLUMN "languages",
DROP COLUMN "specialization",
ADD COLUMN     "biography" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewNote" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "shortIntroduction" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "verificationStatus" "DoctorVerificationStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "yearsOfExperience" INTEGER;

-- AlterTable
ALTER TABLE "DoctorWeeklyAvailability" DROP COLUMN "endTime",
DROP COLUMN "slotDurationMin",
DROP COLUMN "startTime",
ADD COLUMN     "endMinute" INTEGER NOT NULL,
ADD COLUMN     "startMinute" INTEGER NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Tehran';

-- AlterTable
ALTER TABLE "PatientProfile" DROP COLUMN "allergies",
DROP COLUMN "bloodType",
DROP COLUMN "chronicDiseases",
DROP COLUMN "currentMedications",
DROP COLUMN "dateOfBirth",
DROP COLUMN "emergencyContact",
DROP COLUMN "gender",
DROP COLUMN "notes",
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
DROP COLUMN "password",
ADD COLUMN     "avatarFileId" TEXT,
ADD COLUMN     "dateOfBirth" DATE NOT NULL,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "nationalId" TEXT NOT NULL,
ADD COLUMN     "passwordChangedAt" TIMESTAMP(3),
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "phoneVerifiedAt" TIMESTAMP(3),
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- CreateTable
CREATE TABLE "AppointmentAttendance" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "arrivedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "note" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentReschedule" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "requestedStartsAt" TIMESTAMP(3) NOT NULL,
    "requestedEndsAt" TIMESTAMP(3) NOT NULL,
    "status" "RescheduleStatus" NOT NULL DEFAULT 'REQUESTED',
    "reason" TEXT,
    "responseNote" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentReschedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL,
    "patientProfileId" TEXT NOT NULL,
    "doctorProfileId" TEXT NOT NULL,
    "doctorServiceId" TEXT NOT NULL,
    "desiredFrom" TIMESTAMP(3),
    "desiredUntil" TIMESTAMP(3),
    "status" "WaitlistStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentOffer" (
    "id" TEXT NOT NULL,
    "waitlistEntryId" TEXT NOT NULL,
    "doctorServiceId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentOfferStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineConsultation" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'GOOGLE_MEET',
    "externalMeetingId" TEXT,
    "meetingUrl" TEXT,
    "status" "OnlineConsultationStatus" NOT NULL DEFAULT 'SCHEDULED',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnlineConsultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUpRecommendation" (
    "id" TEXT NOT NULL,
    "visitRecordId" TEXT NOT NULL,
    "patientProfileId" TEXT NOT NULL,
    "doctorProfileId" TEXT NOT NULL,
    "suggestedFrom" TIMESTAMP(3),
    "suggestedUntil" TIMESTAMP(3),
    "recommendedDate" DATE,
    "notes" TEXT,
    "status" "FollowUpStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUpRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitRecord" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "patientProfileId" TEXT NOT NULL,
    "doctorProfileId" TEXT NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "chiefComplaint" TEXT,
    "symptoms" TEXT,
    "examinationNotes" TEXT,
    "assessment" TEXT,
    "treatmentPlan" TEXT,
    "followUpNotes" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitDiagnosis" (
    "id" TEXT NOT NULL,
    "visitRecordId" TEXT NOT NULL,
    "codeSystem" TEXT,
    "diagnosisCode" TEXT,
    "diagnosisName" TEXT NOT NULL,
    "notes" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitDiagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "visitRecordId" TEXT NOT NULL,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'DRAFT',
    "issuedAt" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionItem" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "activeIngredient" TEXT,
    "strength" TEXT,
    "dosage" TEXT,
    "route" TEXT,
    "frequency" TEXT,
    "durationDays" INTEGER,
    "quantity" DECIMAL(10,2),
    "quantityUnit" TEXT,
    "instructions" TEXT,
    "status" "PrescriptionItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrescriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorOrder" (
    "id" TEXT NOT NULL,
    "visitRecordId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderType" "DoctorOrderType" NOT NULL,
    "status" "DoctorOrderStatus" NOT NULL DEFAULT 'ACTIVE',
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalDocument" (
    "id" TEXT NOT NULL,
    "visitRecordId" TEXT NOT NULL,
    "fileAssetId" TEXT NOT NULL,
    "documentType" "MedicalDocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalPrescriptionReference" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalReference" TEXT,
    "status" "ExternalPrescriptionStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3),
    "synchronizedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalPrescriptionReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorSpecialty" (
    "id" TEXT NOT NULL,
    "doctorProfileId" TEXT NOT NULL,
    "specialtyId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorCredential" (
    "id" TEXT NOT NULL,
    "doctorProfileId" TEXT NOT NULL,
    "fileAssetId" TEXT NOT NULL,
    "type" "DoctorCredentialType" NOT NULL,
    "status" "CredentialStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "credentialNumber" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorCredentialReview" (
    "id" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "decision" "CredentialReviewDecision" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorCredentialReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorService" (
    "id" TEXT NOT NULL,
    "doctorProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "appointmentType" "AppointmentType" NOT NULL DEFAULT 'REGULAR',
    "consultationMode" "ConsultationMode" NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IRR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicMembership" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "doctorProfileId" TEXT NOT NULL,
    "role" "ClinicMembershipRole" NOT NULL DEFAULT 'STAFF',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "payerUserId" TEXT,
    "purpose" "PaymentPurpose" NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'GATEWAY',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IRR',
    "providerReference" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "checkoutUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "feePayer" "FeePayer",
    "feeBaseAmount" DECIMAL(12,2),
    "feeFixedSnapshot" DECIMAL(12,2),
    "feePercentSnapshot" DECIMAL(7,4),
    "feeAmount" DECIMAL(12,2),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IRR',
    "status" "RefundStatus" NOT NULL DEFAULT 'PENDING',
    "providerReference" TEXT,
    "reason" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3),
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformFeePolicy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serviceId" TEXT,
    "feeType" "PlatformFeeType" NOT NULL,
    "payer" "FeePayer" NOT NULL DEFAULT 'PATIENT',
    "fixedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "percentage" DECIMAL(7,4) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'IRR',
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformFeePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorWallet" (
    "id" TEXT NOT NULL,
    "doctorProfileId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IRR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "status" "WalletTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IRR',
    "referenceType" TEXT,
    "referenceId" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postedAt" TIMESTAMP(3),

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutPeriod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" "PayoutPeriodUnit" NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "requestFrom" TIMESTAMP(3),
    "requestUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoutPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutRequest" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IRR',
    "status" "PayoutRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "processedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoutRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutApproval" (
    "id" TEXT NOT NULL,
    "payoutRequestId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "decision" "PayoutApprovalDecision" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayoutApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutTransaction" (
    "id" TEXT NOT NULL,
    "payoutRequestId" TEXT NOT NULL,
    "status" "PayoutTransferStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IRR',
    "providerReference" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "failureMessage" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoutTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CancellationPolicy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serviceId" TEXT,
    "scope" "CancellationPolicyScope" NOT NULL DEFAULT 'BOTH',
    "minimumNoticeHours" INTEGER NOT NULL DEFAULT 0,
    "refundPercentage" DECIMAL(5,2) NOT NULL DEFAULT 100,
    "fixedPenalty" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'IRR',
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CancellationPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpChallenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "channel" "OtpChannel" NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "destination" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NationalIdChangeRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestedNationalId" TEXT NOT NULL,
    "reason" TEXT,
    "status" "NationalIdChangeStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NationalIdChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAsset" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "storageKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "checksum" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorType" "AuditActorType" NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "outcome" "AuditOutcome" NOT NULL DEFAULT 'SUCCESS',
    "reason" TEXT,
    "changes" JSONB,
    "requestId" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" "SecurityEventType" NOT NULL,
    "success" BOOLEAN NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "requestId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalIntegration" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB,
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalEvent" (
    "id" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "externalEventId" TEXT,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "payload" JSONB,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "failureReason" TEXT,

    CONSTRAINT "ExternalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "type" "ConversationType" NOT NULL,
    "appointmentId" TEXT,
    "subject" TEXT,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "lastReadAt" TIMESTAMP(3),

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fileAssetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReadReceipt" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReadReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "actionUrl" TEXT,
    "metadata" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDelivery" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "destination" TEXT,
    "provider" TEXT,
    "providerReference" TEXT,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "category" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientMedicalHistory" (
    "id" TEXT NOT NULL,
    "patientProfileId" TEXT NOT NULL,
    "conditionName" TEXT NOT NULL,
    "description" TEXT,
    "diagnosedAt" DATE,
    "resolvedAt" DATE,
    "status" "MedicalHistoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientMedicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientAllergy" (
    "id" TEXT NOT NULL,
    "patientProfileId" TEXT NOT NULL,
    "allergen" TEXT NOT NULL,
    "reaction" TEXT,
    "severity" "AllergySeverity" NOT NULL DEFAULT 'UNKNOWN',
    "status" "AllergyStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientAllergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientMedication" (
    "id" TEXT NOT NULL,
    "patientProfileId" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT,
    "frequency" TEXT,
    "startedAt" DATE,
    "endedAt" DATE,
    "status" "MedicationStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientMedication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientFamilyHistory" (
    "id" TEXT NOT NULL,
    "patientProfileId" TEXT NOT NULL,
    "relation" "FamilyRelation" NOT NULL,
    "conditionName" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientFamilyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientInsurance" (
    "id" TEXT NOT NULL,
    "patientProfileId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "policyNumber" TEXT,
    "status" "InsuranceStatus" NOT NULL DEFAULT 'ACTIVE',
    "validFrom" DATE,
    "validUntil" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientInsurance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentAttendance_appointmentId_key" ON "AppointmentAttendance"("appointmentId");

-- CreateIndex
CREATE INDEX "AppointmentAttendance_status_createdAt_idx" ON "AppointmentAttendance"("status", "createdAt");

-- CreateIndex
CREATE INDEX "AppointmentReschedule_appointmentId_createdAt_idx" ON "AppointmentReschedule"("appointmentId", "createdAt");

-- CreateIndex
CREATE INDEX "AppointmentReschedule_status_createdAt_idx" ON "AppointmentReschedule"("status", "createdAt");

-- CreateIndex
CREATE INDEX "WaitlistEntry_doctorProfileId_status_desiredFrom_idx" ON "WaitlistEntry"("doctorProfileId", "status", "desiredFrom");

-- CreateIndex
CREATE INDEX "WaitlistEntry_patientProfileId_status_idx" ON "WaitlistEntry"("patientProfileId", "status");

-- CreateIndex
CREATE INDEX "AppointmentOffer_waitlistEntryId_status_idx" ON "AppointmentOffer"("waitlistEntryId", "status");

-- CreateIndex
CREATE INDEX "AppointmentOffer_status_expiresAt_idx" ON "AppointmentOffer"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "AppointmentOffer_doctorServiceId_startsAt_endsAt_idx" ON "AppointmentOffer"("doctorServiceId", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "OnlineConsultation_appointmentId_key" ON "OnlineConsultation"("appointmentId");

-- CreateIndex
CREATE INDEX "OnlineConsultation_status_startsAt_idx" ON "OnlineConsultation"("status", "startsAt");

-- CreateIndex
CREATE INDEX "FollowUpRecommendation_patientProfileId_status_idx" ON "FollowUpRecommendation"("patientProfileId", "status");

-- CreateIndex
CREATE INDEX "FollowUpRecommendation_doctorProfileId_status_idx" ON "FollowUpRecommendation"("doctorProfileId", "status");

-- CreateIndex
CREATE INDEX "FollowUpRecommendation_status_expiresAt_idx" ON "FollowUpRecommendation"("status", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "VisitRecord_appointmentId_key" ON "VisitRecord"("appointmentId");

-- CreateIndex
CREATE INDEX "VisitRecord_patientProfileId_startedAt_idx" ON "VisitRecord"("patientProfileId", "startedAt");

-- CreateIndex
CREATE INDEX "VisitRecord_doctorProfileId_startedAt_idx" ON "VisitRecord"("doctorProfileId", "startedAt");

-- CreateIndex
CREATE INDEX "VisitRecord_status_startedAt_idx" ON "VisitRecord"("status", "startedAt");

-- CreateIndex
CREATE INDEX "VisitDiagnosis_visitRecordId_isPrimary_idx" ON "VisitDiagnosis"("visitRecordId", "isPrimary");

-- CreateIndex
CREATE INDEX "VisitDiagnosis_diagnosisCode_idx" ON "VisitDiagnosis"("diagnosisCode");

-- CreateIndex
CREATE INDEX "Prescription_visitRecordId_status_idx" ON "Prescription"("visitRecordId", "status");

-- CreateIndex
CREATE INDEX "Prescription_status_issuedAt_idx" ON "Prescription"("status", "issuedAt");

-- CreateIndex
CREATE INDEX "PrescriptionItem_prescriptionId_status_idx" ON "PrescriptionItem"("prescriptionId", "status");

-- CreateIndex
CREATE INDEX "PrescriptionItem_medicationName_idx" ON "PrescriptionItem"("medicationName");

-- CreateIndex
CREATE INDEX "DoctorOrder_visitRecordId_status_idx" ON "DoctorOrder"("visitRecordId", "status");

-- CreateIndex
CREATE INDEX "DoctorOrder_orderType_orderedAt_idx" ON "DoctorOrder"("orderType", "orderedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalDocument_fileAssetId_key" ON "MedicalDocument"("fileAssetId");

-- CreateIndex
CREATE INDEX "MedicalDocument_visitRecordId_documentType_idx" ON "MedicalDocument"("visitRecordId", "documentType");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalPrescriptionReference_prescriptionId_key" ON "ExternalPrescriptionReference"("prescriptionId");

-- CreateIndex
CREATE INDEX "ExternalPrescriptionReference_provider_externalReference_idx" ON "ExternalPrescriptionReference"("provider", "externalReference");

-- CreateIndex
CREATE INDEX "ExternalPrescriptionReference_status_createdAt_idx" ON "ExternalPrescriptionReference"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_slug_key" ON "Specialty"("slug");

-- CreateIndex
CREATE INDEX "Specialty_isActive_name_idx" ON "Specialty"("isActive", "name");

-- CreateIndex
CREATE INDEX "DoctorSpecialty_specialtyId_isPrimary_idx" ON "DoctorSpecialty"("specialtyId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorSpecialty_doctorProfileId_specialtyId_key" ON "DoctorSpecialty"("doctorProfileId", "specialtyId");

-- CreateIndex
CREATE INDEX "DoctorCredential_doctorProfileId_status_idx" ON "DoctorCredential"("doctorProfileId", "status");

-- CreateIndex
CREATE INDEX "DoctorCredential_type_status_idx" ON "DoctorCredential"("type", "status");

-- CreateIndex
CREATE INDEX "DoctorCredentialReview_credentialId_createdAt_idx" ON "DoctorCredentialReview"("credentialId", "createdAt");

-- CreateIndex
CREATE INDEX "DoctorCredentialReview_reviewerId_createdAt_idx" ON "DoctorCredentialReview"("reviewerId", "createdAt");

-- CreateIndex
CREATE INDEX "DoctorService_doctorProfileId_isActive_idx" ON "DoctorService"("doctorProfileId", "isActive");

-- CreateIndex
CREATE INDEX "DoctorService_doctorProfileId_appointmentType_idx" ON "DoctorService"("doctorProfileId", "appointmentType");

-- CreateIndex
CREATE INDEX "Clinic_city_isActive_idx" ON "Clinic"("city", "isActive");

-- CreateIndex
CREATE INDEX "ClinicMembership_doctorProfileId_isPrimary_idx" ON "ClinicMembership"("doctorProfileId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicMembership_clinicId_doctorProfileId_key" ON "ClinicMembership"("clinicId", "doctorProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_idempotencyKey_key" ON "Payment"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Payment_appointmentId_purpose_createdAt_idx" ON "Payment"("appointmentId", "purpose", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_status_createdAt_idx" ON "Payment"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_provider_providerReference_idx" ON "Payment"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "Payment_payerUserId_createdAt_idx" ON "Payment"("payerUserId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_idempotencyKey_key" ON "Refund"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Refund_paymentId_status_idx" ON "Refund"("paymentId", "status");

-- CreateIndex
CREATE INDEX "Refund_status_createdAt_idx" ON "Refund"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PlatformFeePolicy_isActive_effectiveFrom_effectiveUntil_idx" ON "PlatformFeePolicy"("isActive", "effectiveFrom", "effectiveUntil");

-- CreateIndex
CREATE INDEX "PlatformFeePolicy_serviceId_isActive_idx" ON "PlatformFeePolicy"("serviceId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorWallet_doctorProfileId_key" ON "DoctorWallet"("doctorProfileId");

-- CreateIndex
CREATE INDEX "DoctorWallet_isActive_idx" ON "DoctorWallet"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_idempotencyKey_key" ON "WalletTransaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "WalletTransaction_walletId_status_createdAt_idx" ON "WalletTransaction"("walletId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "WalletTransaction_referenceType_referenceId_idx" ON "WalletTransaction"("referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "WalletTransaction_type_createdAt_idx" ON "WalletTransaction"("type", "createdAt");

-- CreateIndex
CREATE INDEX "PayoutPeriod_isActive_startsAt_endsAt_idx" ON "PayoutPeriod"("isActive", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutRequest_idempotencyKey_key" ON "PayoutRequest"("idempotencyKey");

-- CreateIndex
CREATE INDEX "PayoutRequest_walletId_status_requestedAt_idx" ON "PayoutRequest"("walletId", "status", "requestedAt");

-- CreateIndex
CREATE INDEX "PayoutRequest_periodId_status_idx" ON "PayoutRequest"("periodId", "status");

-- CreateIndex
CREATE INDEX "PayoutRequest_status_requestedAt_idx" ON "PayoutRequest"("status", "requestedAt");

-- CreateIndex
CREATE INDEX "PayoutApproval_payoutRequestId_createdAt_idx" ON "PayoutApproval"("payoutRequestId", "createdAt");

-- CreateIndex
CREATE INDEX "PayoutApproval_reviewerId_createdAt_idx" ON "PayoutApproval"("reviewerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutTransaction_idempotencyKey_key" ON "PayoutTransaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "PayoutTransaction_payoutRequestId_status_idx" ON "PayoutTransaction"("payoutRequestId", "status");

-- CreateIndex
CREATE INDEX "PayoutTransaction_status_createdAt_idx" ON "PayoutTransaction"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PayoutTransaction_providerReference_idx" ON "PayoutTransaction"("providerReference");

-- CreateIndex
CREATE INDEX "CancellationPolicy_isActive_effectiveFrom_effectiveUntil_idx" ON "CancellationPolicy"("isActive", "effectiveFrom", "effectiveUntil");

-- CreateIndex
CREATE INDEX "CancellationPolicy_serviceId_isActive_idx" ON "CancellationPolicy"("serviceId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_refreshTokenHash_key" ON "AuthSession"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "AuthSession_userId_revokedAt_idx" ON "AuthSession"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");

-- CreateIndex
CREATE INDEX "OtpChallenge_destination_purpose_createdAt_idx" ON "OtpChallenge"("destination", "purpose", "createdAt");

-- CreateIndex
CREATE INDEX "OtpChallenge_expiresAt_consumedAt_idx" ON "OtpChallenge"("expiresAt", "consumedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON "PasswordResetToken"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "NationalIdChangeRequest_userId_status_idx" ON "NationalIdChangeRequest"("userId", "status");

-- CreateIndex
CREATE INDEX "NationalIdChangeRequest_status_createdAt_idx" ON "NationalIdChangeRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "NationalIdChangeRequest_requestedNationalId_status_idx" ON "NationalIdChangeRequest"("requestedNationalId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "FileAsset_storageKey_key" ON "FileAsset"("storageKey");

-- CreateIndex
CREATE INDEX "FileAsset_ownerUserId_createdAt_idx" ON "FileAsset"("ownerUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx" ON "AuditLog"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "AuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_requestId_idx" ON "AuditLog"("requestId");

-- CreateIndex
CREATE INDEX "SecurityEvent_userId_createdAt_idx" ON "SecurityEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "SecurityEvent_eventType_createdAt_idx" ON "SecurityEvent"("eventType", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- CreateIndex
CREATE INDEX "SystemSetting_updatedById_idx" ON "SystemSetting"("updatedById");

-- CreateIndex
CREATE INDEX "ExternalIntegration_isEnabled_provider_idx" ON "ExternalIntegration"("isEnabled", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIntegration_provider_name_key" ON "ExternalIntegration"("provider", "name");

-- CreateIndex
CREATE INDEX "ExternalEvent_integrationId_receivedAt_idx" ON "ExternalEvent"("integrationId", "receivedAt");

-- CreateIndex
CREATE INDEX "ExternalEvent_eventType_receivedAt_idx" ON "ExternalEvent"("eventType", "receivedAt");

-- CreateIndex
CREATE INDEX "ExternalEvent_status_receivedAt_idx" ON "ExternalEvent"("status", "receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalEvent_integrationId_externalEventId_key" ON "ExternalEvent"("integrationId", "externalEventId");

-- CreateIndex
CREATE INDEX "Conversation_type_updatedAt_idx" ON "Conversation"("type", "updatedAt");

-- CreateIndex
CREATE INDEX "Conversation_appointmentId_idx" ON "Conversation"("appointmentId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_leftAt_idx" ON "ConversationParticipant"("userId", "leftAt");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_senderId_createdAt_idx" ON "Message"("senderId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageAttachment_fileAssetId_key" ON "MessageAttachment"("fileAssetId");

-- CreateIndex
CREATE INDEX "MessageAttachment_messageId_idx" ON "MessageAttachment"("messageId");

-- CreateIndex
CREATE INDEX "MessageReadReceipt_userId_readAt_idx" ON "MessageReadReceipt"("userId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReadReceipt_messageId_userId_key" ON "MessageReadReceipt"("messageId", "userId");

-- CreateIndex
CREATE INDEX "Notification_userId_status_createdAt_idx" ON "Notification"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_category_createdAt_idx" ON "Notification"("category", "createdAt");

-- CreateIndex
CREATE INDEX "NotificationDelivery_notificationId_channel_idx" ON "NotificationDelivery"("notificationId", "channel");

-- CreateIndex
CREATE INDEX "NotificationDelivery_status_nextAttemptAt_idx" ON "NotificationDelivery"("status", "nextAttemptAt");

-- CreateIndex
CREATE INDEX "NotificationDelivery_provider_providerReference_idx" ON "NotificationDelivery"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "NotificationPreference_userId_isEnabled_idx" ON "NotificationPreference"("userId", "isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_channel_category_key" ON "NotificationPreference"("userId", "channel", "category");

-- CreateIndex
CREATE INDEX "PatientMedicalHistory_patientProfileId_status_idx" ON "PatientMedicalHistory"("patientProfileId", "status");

-- CreateIndex
CREATE INDEX "PatientMedicalHistory_patientProfileId_conditionName_idx" ON "PatientMedicalHistory"("patientProfileId", "conditionName");

-- CreateIndex
CREATE INDEX "PatientAllergy_patientProfileId_status_idx" ON "PatientAllergy"("patientProfileId", "status");

-- CreateIndex
CREATE INDEX "PatientMedication_patientProfileId_status_idx" ON "PatientMedication"("patientProfileId", "status");

-- CreateIndex
CREATE INDEX "PatientFamilyHistory_patientProfileId_relation_idx" ON "PatientFamilyHistory"("patientProfileId", "relation");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceProvider_name_key" ON "InsuranceProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceProvider_code_key" ON "InsuranceProvider"("code");

-- CreateIndex
CREATE INDEX "InsuranceProvider_isActive_name_idx" ON "InsuranceProvider"("isActive", "name");

-- CreateIndex
CREATE INDEX "PatientInsurance_patientProfileId_status_idx" ON "PatientInsurance"("patientProfileId", "status");

-- CreateIndex
CREATE INDEX "PatientInsurance_providerId_status_idx" ON "PatientInsurance"("providerId", "status");

-- CreateIndex
CREATE INDEX "Appointment_patientProfileId_startsAt_idx" ON "Appointment"("patientProfileId", "startsAt");

-- CreateIndex
CREATE INDEX "Appointment_doctorProfileId_startsAt_endsAt_idx" ON "Appointment"("doctorProfileId", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Appointment_doctorProfileId_status_startsAt_idx" ON "Appointment"("doctorProfileId", "status", "startsAt");

-- CreateIndex
CREATE INDEX "Appointment_status_paymentHoldExpiresAt_idx" ON "Appointment"("status", "paymentHoldExpiresAt");

-- CreateIndex
CREATE INDEX "Appointment_cancellationPolicyId_idx" ON "Appointment"("cancellationPolicyId");

-- CreateIndex
CREATE INDEX "AvailabilityOverride_doctorProfileId_startsAt_endsAt_idx" ON "AvailabilityOverride"("doctorProfileId", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "DoctorProfile_verificationStatus_isPublished_idx" ON "DoctorProfile"("verificationStatus", "isPublished");

-- CreateIndex
CREATE INDEX "DoctorWeeklyAvailability_doctorProfileId_dayOfWeek_isActive_idx" ON "DoctorWeeklyAvailability"("doctorProfileId", "dayOfWeek", "isActive");

-- CreateIndex
CREATE INDEX "PatientProfile_createdAt_idx" ON "PatientProfile"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalId_key" ON "User"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarFileId_key" ON "User"("avatarFileId");

-- CreateIndex
CREATE INDEX "User_role_isActive_idx" ON "User"("role", "isActive");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientProfileId_fkey" FOREIGN KEY ("patientProfileId") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorServiceId_fkey" FOREIGN KEY ("doctorServiceId") REFERENCES "DoctorService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_cancellationPolicyId_fkey" FOREIGN KEY ("cancellationPolicyId") REFERENCES "CancellationPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentAttendance" ADD CONSTRAINT "AppointmentAttendance_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentReschedule" ADD CONSTRAINT "AppointmentReschedule_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_patientProfileId_fkey" FOREIGN KEY ("patientProfileId") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_doctorServiceId_fkey" FOREIGN KEY ("doctorServiceId") REFERENCES "DoctorService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentOffer" ADD CONSTRAINT "AppointmentOffer_waitlistEntryId_fkey" FOREIGN KEY ("waitlistEntryId") REFERENCES "WaitlistEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentOffer" ADD CONSTRAINT "AppointmentOffer_doctorServiceId_fkey" FOREIGN KEY ("doctorServiceId") REFERENCES "DoctorService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineConsultation" ADD CONSTRAINT "OnlineConsultation_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpRecommendation" ADD CONSTRAINT "FollowUpRecommendation_visitRecordId_fkey" FOREIGN KEY ("visitRecordId") REFERENCES "VisitRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpRecommendation" ADD CONSTRAINT "FollowUpRecommendation_patientProfileId_fkey" FOREIGN KEY ("patientProfileId") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpRecommendation" ADD CONSTRAINT "FollowUpRecommendation_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitRecord" ADD CONSTRAINT "VisitRecord_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitRecord" ADD CONSTRAINT "VisitRecord_patientProfileId_fkey" FOREIGN KEY ("patientProfileId") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitRecord" ADD CONSTRAINT "VisitRecord_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitDiagnosis" ADD CONSTRAINT "VisitDiagnosis_visitRecordId_fkey" FOREIGN KEY ("visitRecordId") REFERENCES "VisitRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_visitRecordId_fkey" FOREIGN KEY ("visitRecordId") REFERENCES "VisitRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorOrder" ADD CONSTRAINT "DoctorOrder_visitRecordId_fkey" FOREIGN KEY ("visitRecordId") REFERENCES "VisitRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalDocument" ADD CONSTRAINT "MedicalDocument_visitRecordId_fkey" FOREIGN KEY ("visitRecordId") REFERENCES "VisitRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalDocument" ADD CONSTRAINT "MedicalDocument_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "FileAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalPrescriptionReference" ADD CONSTRAINT "ExternalPrescriptionReference_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorProfile" ADD CONSTRAINT "DoctorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorProfile" ADD CONSTRAINT "DoctorProfile_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorCredential" ADD CONSTRAINT "DoctorCredential_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorCredential" ADD CONSTRAINT "DoctorCredential_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "FileAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorCredentialReview" ADD CONSTRAINT "DoctorCredentialReview_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "DoctorCredential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorCredentialReview" ADD CONSTRAINT "DoctorCredentialReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorService" ADD CONSTRAINT "DoctorService_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorWeeklyAvailability" ADD CONSTRAINT "DoctorWeeklyAvailability_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityOverride" ADD CONSTRAINT "AvailabilityOverride_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicMembership" ADD CONSTRAINT "ClinicMembership_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicMembership" ADD CONSTRAINT "ClinicMembership_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payerUserId_fkey" FOREIGN KEY ("payerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformFeePolicy" ADD CONSTRAINT "PlatformFeePolicy_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "DoctorService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorWallet" ADD CONSTRAINT "DoctorWallet_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "DoctorWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutRequest" ADD CONSTRAINT "PayoutRequest_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "DoctorWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutRequest" ADD CONSTRAINT "PayoutRequest_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "PayoutPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutApproval" ADD CONSTRAINT "PayoutApproval_payoutRequestId_fkey" FOREIGN KEY ("payoutRequestId") REFERENCES "PayoutRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutApproval" ADD CONSTRAINT "PayoutApproval_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutTransaction" ADD CONSTRAINT "PayoutTransaction_payoutRequestId_fkey" FOREIGN KEY ("payoutRequestId") REFERENCES "PayoutRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CancellationPolicy" ADD CONSTRAINT "CancellationPolicy_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "DoctorService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarFileId_fkey" FOREIGN KEY ("avatarFileId") REFERENCES "FileAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpChallenge" ADD CONSTRAINT "OtpChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NationalIdChangeRequest" ADD CONSTRAINT "NationalIdChangeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NationalIdChangeRequest" ADD CONSTRAINT "NationalIdChangeRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityEvent" ADD CONSTRAINT "SecurityEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemSetting" ADD CONSTRAINT "SystemSetting_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalEvent" ADD CONSTRAINT "ExternalEvent_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "ExternalIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAttachment" ADD CONSTRAINT "MessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAttachment" ADD CONSTRAINT "MessageAttachment_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "FileAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReadReceipt" ADD CONSTRAINT "MessageReadReceipt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReadReceipt" ADD CONSTRAINT "MessageReadReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientProfile" ADD CONSTRAINT "PatientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientMedicalHistory" ADD CONSTRAINT "PatientMedicalHistory_patientProfileId_fkey" FOREIGN KEY ("patientProfileId") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAllergy" ADD CONSTRAINT "PatientAllergy_patientProfileId_fkey" FOREIGN KEY ("patientProfileId") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientMedication" ADD CONSTRAINT "PatientMedication_patientProfileId_fkey" FOREIGN KEY ("patientProfileId") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientFamilyHistory" ADD CONSTRAINT "PatientFamilyHistory_patientProfileId_fkey" FOREIGN KEY ("patientProfileId") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientInsurance" ADD CONSTRAINT "PatientInsurance_patientProfileId_fkey" FOREIGN KEY ("patientProfileId") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientInsurance" ADD CONSTRAINT "PatientInsurance_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "InsuranceProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
