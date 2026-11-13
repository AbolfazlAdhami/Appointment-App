import { z } from "zod";

export const DoctorCredentialCreateSchema = z.object({
  fileAssetId: z.string().cuid("Invalid file asset ID"),
  type: z.enum(["MEDICAL_LICENSE", "MEDICAL_COUNCIL_CARD", "EDUCATION_CERTIFICATE", "CV", "ID_DOCUMENT", "OTHER"]),
  credentialNumber: z.string().trim().max(100).optional(),
  issuedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
});

export type DoctorCredentialCreateInput = z.infer<typeof DoctorCredentialCreateSchema>;
