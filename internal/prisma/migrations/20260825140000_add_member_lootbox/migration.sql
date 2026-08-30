-- AlterTable
-- Six-slot personal object shelf shown on the directory profile. Additive and
-- nullable, so existing rows simply read as an empty lootbox.
ALTER TABLE "Member" ADD COLUMN "lootbox" JSONB;
