import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    updateMany: vi.fn(),
  },
}));

vi.mock("../../libs/prisma", () => ({ prisma: prismaMock }));

import { Role } from "../../generated/prisma/client";
import { UpdateProfileSchema } from "../../schemas/profile.schema";
import { getUserProfile, updateUserProfile } from "../profile.service";

const profile = {
  id: "user-1",
  firstName: "Test",
  lastName: "Patient",
  email: "test@example.com",
  phone: "+491511234567",
  role: Role.PATIENT,
  isActive: true,
  createdAt: new Date("2020-01-01T00:00:00.000Z"),
};

describe("Self profile service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries the profile only by the authenticated user ID and selects safe fields", async () => {
    prismaMock.user.findUnique.mockResolvedValue(profile);

    await expect(getUserProfile("authenticated-user")).resolves.toEqual(profile);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: "authenticated-user" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  });

  it("updates only allowed fields, scoped to the authenticated user", async () => {
    prismaMock.user.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.user.findUnique.mockResolvedValue({ ...profile, firstName: "Updated" });

    await expect(updateUserProfile("authenticated-user", { firstName: "Updated" })).resolves.toMatchObject({ firstName: "Updated" });

    expect(prismaMock.user.updateMany).toHaveBeenCalledWith({
      where: { id: "authenticated-user" },
      data: { firstName: "Updated" },
    });
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
  });

  it("never applies a client-selected profile identifier", async () => {
    prismaMock.user.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.user.findUnique.mockResolvedValue({ ...profile, firstName: "OwnName" });

    await updateUserProfile("authenticated-user", { firstName: "OwnName" });

    expect(prismaMock.user.updateMany).toHaveBeenCalledWith({
      where: { id: "authenticated-user" },
      data: { firstName: "OwnName" },
    });
    expect(prismaMock.user.updateMany.mock.calls[0]?.[0]).toEqual({
      where: { id: "authenticated-user" },
      data: { firstName: "OwnName" },
    });
  });

  it("returns null when the authenticated user no longer exists", async () => {
    prismaMock.user.updateMany.mockResolvedValue({ count: 0 });

    await expect(updateUserProfile("missing-user", { lastName: "Patient" })).resolves.toBeNull();
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });
});

describe("UpdateProfileSchema", () => {
  it("accepts allowed names and rejects role, identifiers, and empty updates", () => {
    expect(UpdateProfileSchema.safeParse({ firstName: "Updated" }).success).toBe(true);
    expect(UpdateProfileSchema.safeParse({ role: "ADMIN" }).success).toBe(false);
    expect(UpdateProfileSchema.safeParse({ userId: "other-user", firstName: "Updated" }).success).toBe(false);
    expect(UpdateProfileSchema.safeParse({}).success).toBe(false);
    expect(UpdateProfileSchema.safeParse({ firstName: "x" }).success).toBe(false);
  });
});