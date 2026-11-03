import type { ID, DateString, DateTimeString } from "./common";

import type { AllergySeverity, AllergyStatus, FamilyRelation, InsuranceStatus, MedicalHistoryStatus, MedicationStatus } from "./enums";

export interface PatientProfile {
  userId: ID;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface PatientMedicalHistory {
  id: ID;
  patientProfileId: ID;
  conditionName: string;
  description: string | null;
  diagnosedAt: DateString | null;
  resolvedAt: DateString | null;
  status: MedicalHistoryStatus;
  notes: string | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface PatientAllergy {
  id: ID;
  patientProfileId: ID;
  allergen: string;
  reaction: string | null;
  severity: AllergySeverity;
  status: AllergyStatus;
  notes: string | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface PatientMedication {
  id: ID;
  patientProfileId: ID;
  medicationName: string;
  dosage: string | null;
  frequency: string | null;
  startedAt: DateString | null;
  endedAt: DateString | null;
  status: MedicationStatus;
  notes: string | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface PatientFamilyHistory {
  id: ID;
  patientProfileId: ID;
  relation: FamilyRelation;
  conditionName: string;
  notes: string | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface InsuranceProvider {
  id: ID;
  name: string;
  code: string | null;
  isActive: boolean;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface PatientInsurance {
  id: ID;
  patientProfileId: ID;
  providerId: ID;
  policyNumber: string | null;
  status: InsuranceStatus;
  validFrom: DateString | null;
  validUntil: DateString | null;
  notes: string | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
  provider?: InsuranceProvider;
}

export interface CreatePatientMedicalHistoryInput {
  conditionName: string;
  description?: string;
  diagnosedAt?: DateString;
  notes?: string;
}

export interface CreatePatientAllergyInput {
  allergen: string;
  reaction?: string;
  severity?: AllergySeverity;
  notes?: string;
}

export interface CreatePatientMedicationInput {
  medicationName: string;
  dosage?: string;
  frequency?: string;
  startedAt?: DateString;
  endedAt?: DateString;
  notes?: string;
}
