import { z } from "zod";

export const AdminUserListQuerySchema = z.object({
  cursor: z.string().trim().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]).optional(),
  isActive: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
}).strict();

export type AdminUserListQuery = z.infer<typeof AdminUserListQuerySchema>;