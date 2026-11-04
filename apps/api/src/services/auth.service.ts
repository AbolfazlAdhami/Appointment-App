import bcrypt from "bcrypt";
import { Role } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import { generateAccessToken } from "../utils/jwt";

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string | null;
    role: Role;
  };
  token: string;
}

interface LoginInput {
  email: string;
  password: string;
}

function toAuthUser(user: { id: string; firstName: string; lastName: string; email: string | null; role: Role }) {
  return {
    id: user.id,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    email: user.email,
    role: user.role,
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Use the same error for unknown email and missing password hash.
  if (!user || !user.passwordHash) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("User account is inactive");
  }

  const passwordIsValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordIsValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: toAuthUser(user),
  };
}
