import type { Prisma, Role } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import type { AdminUserListQuery } from "../schemas/admin-user-list.schema";

const userListSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  lastLoginAt: true,
} as const;

export async function listUsers(query: AdminUserListQuery) {
  const where: Prisma.UserWhereInput = {
    ...(query.role ? { role: query.role as Role } : {}),
    ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
  };

  const users = await prisma.user.findMany({
    where,
    select: userListSelect,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: query.limit + 1,
    ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
  });

  const hasMore = users.length > query.limit;
  const page = hasMore ? users.slice(0, query.limit) : users;
  const nextCursor = hasMore ? page[page.length - 1]?.id ?? null : null;

  return {
    users: page,
    pagination: {
      limit: query.limit,
      nextCursor,
      hasMore,
    },
  };
}