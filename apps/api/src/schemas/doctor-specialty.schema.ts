import { z } from "zod";

export const DoctorSpecialtySchema = z.object({
  specialtyId: z.string().cuid("Invalid specialty ID"),
  isPrimary: z.boolean().default(false),
});

export type DoctorSpecialtyInput = z.infer<typeof DoctorSpecialtySchema>;
