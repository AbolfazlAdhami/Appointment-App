import { z } from "zod";

export const UpdateProfileSchema = z
  .object({
    firstName: z.string().trim().min(2).max(100).optional(),
    lastName: z.string().trim().min(2).max(100).optional(),
  })
  .strict()
  .refine((profile) => Object.keys(profile).length > 0, {
    message: "At least one profile field must be provided",
  });

export const UserProfileSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().nullable(),
  phone: z.string(),
  role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]),
  isActive: z.boolean(),
  createdAt: z.date(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;