import { z } from "zod";
const PhoneSchema = z
  .string()
  .trim()
  .min(8)
  .max(20)
  .regex(/^\+?[0-9\s()-]+$/, "Invalid phone number");
export const RequestPhoneOtpSchema = z.object({
  phone: PhoneSchema,
  purpose: z.enum(["SIGNUP", "LOGIN"]),
});

export const RegisterSchema = z
  .object({
    firstName: z.string().trim().min(2).max(100),
    lastName: z.string().trim().min(2).max(100),
    nationalId: z.string().trim().min(1).max(30),
    dateOfBirth: z.iso.date(),
    phone: PhoneSchema,
    code: z.string().regex(/^\d{6}$/),
    email: z.email().optional(),
    password: z.string().min(8).max(128).optional(),
  })
  .refine((data) => !data.password || Boolean(data.email), {
    message: "Email is required when setting a password",
    path: ["email"],
  });
