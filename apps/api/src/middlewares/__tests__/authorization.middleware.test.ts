import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";

import { Role } from "../../generated/prisma/client";
import { authorize } from "../authorization.middleware";
import { authorizeAction } from "../authorization.middleware";
import { rolesForAction } from "../../policies/authorization.policy";
import type { AuthenticatedRequest } from "../auth.middleware";

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

function createRequest(role?: Role): Request {
  return {
    user: role
      ? {
          userId: "test-user-id",
          sessionId: "test-session-id",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          role,
        }
      : undefined,
  } as unknown as AuthenticatedRequest;
}

describe("authorize middleware", () => {
  it("should return 401 when user is not authenticated", () => {
    const req = createRequest();
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    authorize(Role.ADMIN)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 when user role is not allowed", () => {
    const req = createRequest(Role.PATIENT);
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    authorize(Role.ADMIN)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it.each([Role.PATIENT, Role.DOCTOR, Role.ADMIN])("should allow user with role %s", (role) => {
    const req = createRequest(role);
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    authorize(role)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should allow multiple roles", () => {
    const req = createRequest(Role.DOCTOR);
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    authorize(Role.DOCTOR, Role.ADMIN)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("defines explicit access policy for every currently protected auth action", () => {
    expect(rolesForAction("auth.me")).toEqual([Role.PATIENT, Role.DOCTOR, Role.ADMIN]);
    expect(rolesForAction("auth.logout")).toEqual([Role.PATIENT, Role.DOCTOR, Role.ADMIN]);
    expect(rolesForAction("profile.read.self")).toEqual([Role.PATIENT, Role.DOCTOR, Role.ADMIN]);
    expect(rolesForAction("profile.update.self")).toEqual([Role.PATIENT, Role.DOCTOR, Role.ADMIN]);
    expect(rolesForAction("file.upload.self")).toEqual([Role.PATIENT, Role.DOCTOR, Role.ADMIN]);
    expect(rolesForAction("file.read.self")).toEqual([Role.PATIENT, Role.DOCTOR, Role.ADMIN]);
    expect(rolesForAction("admin.users.status.update")).toEqual([Role.ADMIN]);
    expect(rolesForAction("admin.users.list")).toEqual([Role.ADMIN]);
  });

  it("allows only administrators to update account status", () => {
    const patientReq = createRequest(Role.PATIENT);
    const patientRes = createResponse();
    const patientNext = vi.fn() as NextFunction;
    authorizeAction("admin.users.status.update")(patientReq, patientRes, patientNext);
    expect(patientRes.status).toHaveBeenCalledWith(403);
    expect(patientNext).not.toHaveBeenCalled();

    const adminReq = createRequest(Role.ADMIN);
    const adminRes = createResponse();
    const adminNext = vi.fn() as NextFunction;
    authorizeAction("admin.users.status.update")(adminReq, adminRes, adminNext);
    expect(adminNext).toHaveBeenCalledOnce();
  });

  it.each([Role.PATIENT, Role.DOCTOR, Role.ADMIN])("allows role %s for current-user action", (role) => {
    const req = createRequest(role);
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    authorizeAction("auth.me")(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("rejects a role not present in the action policy", () => {
    const req = createRequest(Role.PATIENT);
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    authorize(Role.ADMIN)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
