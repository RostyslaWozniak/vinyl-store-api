/*
  Warnings:

  - You are about to drop the column `user_id` on the `system_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "system_logs" DROP COLUMN "user_id";
