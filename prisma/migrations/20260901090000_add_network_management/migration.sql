-- CreateEnum
CREATE TYPE "PersonKind" AS ENUM ('ACCOUNT', 'CONTACT');

-- CreateEnum
CREATE TYPE "EngagementRole" AS ENUM ('TEAM', 'FELLOW', 'SPEAKER', 'MENTOR', 'TRAINER', 'ADVISOR', 'PARTNER', 'OTHER');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "kind" "PersonKind" NOT NULL DEFAULT 'ACCOUNT',
ADD COLUMN     "note" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramEdition" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "label" TEXT,

    CONSTRAINT "ProgramEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Engagement" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "role" "EngagementRole" NOT NULL,
    "title" TEXT,
    "departmentId" TEXT,
    "organizationId" TEXT,
    "editionId" TEXT,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "note" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "aId" TEXT NOT NULL,
    "bId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "note" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramEdition_programId_year_key" ON "ProgramEdition"("programId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE INDEX "Engagement_memberId_idx" ON "Engagement"("memberId");

-- CreateIndex
CREATE INDEX "Engagement_editionId_idx" ON "Engagement"("editionId");

-- CreateIndex
CREATE INDEX "Engagement_role_startYear_idx" ON "Engagement"("role", "startYear");

-- CreateIndex
CREATE INDEX "Connection_aId_idx" ON "Connection"("aId");

-- CreateIndex
CREATE INDEX "Connection_bId_idx" ON "Connection"("bId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_aId_bId_label_key" ON "Connection"("aId", "bId", "label");

-- CreateIndex
CREATE INDEX "Member_kind_idx" ON "Member"("kind");

-- AddForeignKey
ALTER TABLE "ProgramEdition" ADD CONSTRAINT "ProgramEdition_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "ProgramEdition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_aId_fkey" FOREIGN KEY ("aId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_bId_fkey" FOREIGN KEY ("bId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Data migration: seed each member's current role as their first engagement, so
-- role timelines start populated instead of empty. One deterministic row per
-- member (id = eng_<memberId>), TEAM and ongoing, starting from the year in
-- their cohort text when it holds one, else the year they were approved or
-- signed up. A best-effort starting point — people correct their own history in
-- /me from here.
INSERT INTO "Engagement" ("id", "memberId", "role", "title", "departmentId", "startYear", "endYear", "createdAt", "updatedAt")
SELECT
    concat('eng_', m."id"),
    m."id",
    'TEAM',
    m."title",
    m."departmentId",
    COALESCE(
        substring(m."cohort" from '[0-9]{4}')::int,
        EXTRACT(YEAR FROM COALESCE(m."approvedAt", m."requestedAt"))::int
    ),
    NULL,
    NOW(),
    NOW()
FROM "Member" m
WHERE m."title" IS NOT NULL OR m."departmentId" IS NOT NULL OR m."cohort" IS NOT NULL
ON CONFLICT ("id") DO NOTHING;
