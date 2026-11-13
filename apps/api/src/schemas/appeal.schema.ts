import { z } from "zod";

export const CreateAppealSchema = z.object({
  reason: z.string().trim().min(10).max(2000),
});

export const ReviewAppealSchema = z.object({
  decision: z.enum(["ACCEPTED", "REJECTED"]),
  note: z.string().trim().max(1000).optional(),
});

export type CreateAppealInput = z.infer<typeof CreateAppealSchema>;
export type ReviewAppealInput = z.infer<typeof ReviewAppealSchema>;
