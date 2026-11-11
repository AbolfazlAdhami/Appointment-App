import type { Role } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import type { UpdateProfileInput, UserProfile } from "../schemas/profile.schema";

const profileSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
} as const;

type ProfileRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
};

function toUserProfile(user: ProfileRecord): UserProfile {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  });

  return user ? toUserProfile(user) : null;
}

export async function updateUserProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile | null> {
  const updatedUser = await prisma.user.updateMany({
    where: { id: userId },
    data: input,
  });

  if (updatedUser.count === 0) {
    return null;
  }

  return getUserProfile(userId);
}