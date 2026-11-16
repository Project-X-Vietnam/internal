-- AlterTable
-- Marks that a member reached the end of the /welcome flow. Additive and
-- nullable: everyone approved before the flow existed reads as not-yet-onboarded
-- and is walked through it once on their next request.
ALTER TABLE "Member" ADD COLUMN "onboardedAt" TIMESTAMP(3);
