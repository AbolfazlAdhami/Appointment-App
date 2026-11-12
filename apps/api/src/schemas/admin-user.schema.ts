import { z } from "zod";

export const UpdateUserStatusSchema = z.object({
  isActive: z.boolean(),
  reason: z.string().trim().min(3).max(500),
}).strict();

export type UpdateUserStatusInput = z.infer<typeof UpdateUserStatusSchema>;