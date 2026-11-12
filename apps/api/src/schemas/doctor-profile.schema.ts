import { z } from "zod";

export const UpdateDoctorProfileSchema = z
  .object({
    headline: z.string().trim().max(160).nullable().optional(),
    shortIntroduction: z.string().trim().max(500).nullable().optional(),
    biography: z.string().trim().max(10_000).nullable().optional(),
    yearsOfExperience: z.number().int().min(0).max(80).nullable().optional(),
    videoUrl: z.url().max(2048).nullable().optional(),
  })
  .strict()
  .refine((profile) => Object.keys(profile).length > 0, {
    message: "At least one profile field must be provided",
  });

export type UpdateDoctorProfileInput = z.infer<typeof UpdateDoctorProfileSchema>;