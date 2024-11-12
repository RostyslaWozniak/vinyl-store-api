-- AlterTable
ALTER TABLE "system_logs" ALTER COLUMN "entity_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;
