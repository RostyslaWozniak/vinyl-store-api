/*
  Warnings:

  - You are about to drop the column `timestamp` on the `system_logs` table. All the data in the column will be lost.
  - Changed the type of `level` on the `system_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `method` on the `system_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "system_logs" DROP COLUMN "timestamp",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "level",
ADD COLUMN     "level" TEXT NOT NULL,
DROP COLUMN "method",
ADD COLUMN     "method" TEXT NOT NULL,
ALTER COLUMN "status_code" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "HttpMethod";

-- DropEnum
DROP TYPE "LogLevel";
