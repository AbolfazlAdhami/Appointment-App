import { z } from "zod";

export const DoctorReviewSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED", "NEEDS_CORRECTION"]),
  reviewNote: z.string().trim().max(1000).optional(),
});

export type DoctorReviewInput = z.infer<typeof DoctorReviewSchema>;
