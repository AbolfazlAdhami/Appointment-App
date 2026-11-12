import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { UpdateUserStatusSchema } from "../schemas/admin-user.schema";
import { updateUserStatus } from "../services/admin-user.service";
import { AdminUserListQuerySchema } from "../schemas/admin-user-list.schema";
import { listUsers } from "../services/admin-user-list.service";

export async function getUsers(req: Request, res: Response): Promise<void> {
  const validation = AdminUserListQuerySchema.safeParse(req.query);
  if (!validation.success) {
    res.status(400).json({ message: "Invalid user list query", errors: validation.error.flatten() });
    return;
  }

  const result = await listUsers(validation.data);
  res.status(200).json(result);
}

export async function setUserStatus(req: Request, res: Response): Promise<void> {
  const actor = (req as AuthenticatedRequest).user;
  if (!actor) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const validation = UpdateUserStatusSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: "Invalid account status update", errors: validation.error.flatten() });
    return;
  }

  const targetUserId = req.params.userId;
  if (typeof targetUserId !== "string" || !targetUserId.trim()) {
    res.status(400).json({ message: "Invalid user identifier" });
    return;
  }

  const result = await updateUserStatus({
    actorUserId: actor.userId,
    targetUserId,
    payload: validation.data,
  });

  switch (result.kind) {
    case "not_found":
      res.status(404).json({ message: "User not found" });
      return;
    case "self_deactivation":
      res.status(409).json({ message: "Administrators cannot deactivate their own account" });
      return;
    case "last_active_admin":
      res.status(409).json({ message: "The last active administrator cannot be deactivated" });
      return;
    case "unchanged":
      res.status(200).json({ user: result.user, changed: false });
      return;
    case "updated":
      res.status(200).json({ user: result.user, changed: true });
      return;
  }
}