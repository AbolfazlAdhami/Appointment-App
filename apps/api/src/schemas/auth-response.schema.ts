import { z } from "zod";

export const AuthUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]),
});

export const AuthUserResponseSchema = z.object({
  user: AuthUserSchema,
});

export const LogoutResponseSchema = z.object({
  message: z.string(),
});

export const ErrorResponseSchema = z.object({
  message: z.string(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthUserResponse = z.infer<typeof AuthUserResponseSchema>;
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
