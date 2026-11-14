import { CredentialStatus } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import type { DoctorCredentialCreateInput } from "../schemas/doctor-credential.schema";

export async function listDoctorCredentials(actorUserId: string) {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: actorUserId },
    select: {
      credentials: {
        select: {
          id: true,
          type: true,
          status: true,
          credentialNumber: true,
          issuedAt: true,
          expiresAt: true,
          submittedAt: true,
          fileAsset: { select: { id: true, originalName: true, mimeType: true, sizeBytes: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!doctorProfile) return null;

  return doctorProfile.credentials;
}

export async function createDoctorCredential(params: {
  actorUserId: string;
  payload: DoctorCredentialCreateInput;
}) {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: params.actorUserId },
    select: { id: true, verificationStatus: true },
  });

  if (!doctorProfile) {
    return { kind: "not_found" as const };
  }

  if (["APPROVED", "SUSPENDED"].includes(doctorProfile.verificationStatus)) {
    return { kind: "read_only" as const };
  }

  const ownedFile = await prisma.fileAsset.findFirst({
    where: { id: params.payload.fileAssetId, ownerUserId: params.actorUserId, isPrivate: true },
    select: { id: true },
  });
  if (!ownedFile) {
    return { kind: "file_not_owned" as const };
  }

  const credential = await prisma.doctorCredential.create({
    data: {
      doctorProfileId: doctorProfile.id,
      fileAssetId: params.payload.fileAssetId,
      type: params.payload.type,
      status: CredentialStatus.PENDING_REVIEW,
      credentialNumber: params.payload.credentialNumber || null,
      issuedAt: params.payload.issuedAt ? new Date(params.payload.issuedAt) : null,
      expiresAt: params.payload.expiresAt ? new Date(params.payload.expiresAt) : null,
    },
    select: {
      id: true,
      type: true,
      status: true,
      credentialNumber: true,
      issuedAt: true,
      expiresAt: true,
      submittedAt: true,
      fileAsset: { select: { id: true, originalName: true, mimeType: true } },
    },
  });

  return { kind: "created" as const, credential };
}

export async function removeDoctorCredential(params: {
  actorUserId: string;
  credentialId: string;
}) {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: params.actorUserId },
    select: { id: true, verificationStatus: true },
  });

  if (!doctorProfile) {
    return { kind: "not_found" as const };
  }

  if (["APPROVED", "SUSPENDED"].includes(doctorProfile.verificationStatus)) {
    return { kind: "read_only" as const };
  }

  const credential = await prisma.doctorCredential.findFirst({
    where: { id: params.credentialId, doctorProfileId: doctorProfile.id },
    select: { id: true, status: true },
  });
  if (!credential) return { kind: "removed" as const, count: 0 };
  if (credential.status !== "PENDING_REVIEW") return { kind: "read_only" as const };

  const deleted = await prisma.doctorCredential.deleteMany({
    where: {
      doctorProfileId: doctorProfile.id,
      id: params.credentialId,
    },
  });

  return { kind: "removed" as const, count: deleted.count };
}
