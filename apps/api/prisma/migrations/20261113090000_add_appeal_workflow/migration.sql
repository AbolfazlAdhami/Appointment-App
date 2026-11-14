CREATE TYPE "AppealStatus" AS ENUM ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED');

CREATE TABLE "Appeal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "AppealStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appeal_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Appeal_userId_status_idx" ON "Appeal"("userId", "status");
CREATE INDEX "Appeal_status_createdAt_idx" ON "Appeal"("status", "createdAt");
CREATE INDEX "Appeal_reviewedById_status_idx" ON "Appeal"("reviewedById", "status");

ALTER TABLE "Appeal"
ADD CONSTRAINT "Appeal_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Appeal"
ADD CONSTRAINT "Appeal_reviewedById_fkey"
FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;