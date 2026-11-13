import { z } from "zod";

const DoctorVerificationStatusEnum = z.enum([
  "DRAFT",
  "PENDING_REVIEW",
  "NEEDS_CORRECTION",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
]);

export const DoctorListQuerySchema = z.object({
  specialty: z.string().cuid().optional(),
  verificationStatus: DoctorVerificationStatusEnum.optional(),
  isPublished: z.preprocess((val) => (val === "true" ? true : val === "false" ? false : undefined), z.boolean().optional()),
  city: z.string().trim().min(1).max(100).optional(),
  search: z.string().trim().min(1).max(200).optional(),
  limit: z.preprocess((val) => {
    const parsed = parseInt(String(val ?? "25"), 10);
    return Number.isNaN(parsed) || parsed < 1 ? 25 : Math.min(parsed, 100);
  }, z.number().int().min(1).max(100)),
  cursor: z.string().cuid().optional(),
});

export type DoctorListQuery = z.infer<typeof DoctorListQuerySchema>;
