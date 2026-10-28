import bcrypt from "bcrypt";
import { Prisma, Role } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import { generateAccessToken } from "../utils/jwt";

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  token: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

function toAuthUser(user: { id: string; firstName: string; lastName: string; email: string; role: Role }) {
  return {
    id: user.id,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    email: user.email,
    role: user.role,
  };
}

export async function registerUser(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  if (name.length < 2) {
    throw new Error("Name must contain at least 2 characters");
  }

  if (input.password.length < 8) {
    throw new Error("Password must contain at least 8 characters");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const nameParts = name.split(/\s+/);
  const firstName = nameParts.shift()!;
  const lastName = nameParts.join(" ");

  const hashedPassword = await bcrypt.hash(input.password, 12);

  let user;

  try {
    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: Role.PATIENT,
      },
    });
  } catch (error) {
    // Handles concurrent registrations for the same email.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Email already registered");
    }

    throw error;
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

export async function loginUser(input: LoginInput) {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("User account is inactive");
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
