import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({ user: { findMany: vi.fn() } }));
vi.mock("../../libs/prisma", () => ({ prisma: prismaMock }));

import { Role } from "../../generated/prisma/client";
import { AdminUserListQuerySchema } from "../../schemas/admin-user-list.schema";
import { listUsers } from "../admin-user-list.service";

describe("Admin user list", () => {
  beforeEach(() => vi.clearAllMocks());

  it("filters and pages using bounded page size and safe response projection", async () => {
    const rows = Array.from({ length: 3 }, (_, index) => ({
      id: `user-${index}`,
      firstName: "Test",
      lastName: `User${index}`,
      email: null,
      role: Role.PATIENT,
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: null,
    }));
    prismaMock.user.findMany.mockResolvedValue(rows);

    const result = await listUsers({ limit: 2, role: Role.PATIENT, isActive: true, cursor: "cursor-id" });

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: { role: Role.PATIENT, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 3,
      cursor: { id: "cursor-id" },
      skip: 1,
    });
    expect(result.users).toHaveLength(2);
    expect(result.pagination).toEqual({ limit: 2, nextCursor: "user-1", hasMore: true });
    expect(result.users[0]).not.toHaveProperty("phone");
    expect(result.users[0]).not.toHaveProperty("nationalId");
  });

  it("validates filters, rejects extra fields and caps page sizes", () => {
    expect(AdminUserListQuerySchema.parse({}).limit).toBe(25);
    expect(AdminUserListQuerySchema.parse({ role: "DOCTOR", isActive: "false", limit: "50" })).toMatchObject({
      role: "DOCTOR",
      isActive: false,
      limit: 50,
    });
    expect(AdminUserListQuerySchema.safeParse({ limit: "101" }).success).toBe(false);
    expect(AdminUserListQuerySchema.safeParse({ userId: "some-user" }).success).toBe(false);
  });
});