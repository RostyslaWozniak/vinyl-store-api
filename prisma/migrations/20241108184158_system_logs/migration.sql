/*
  Warnings:

  - You are about to drop the column `entity_id` on the `system_logs` table. All the data in the column will be lost.
  - Added the required column `status_code` to the `system_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "system_logs" DROP COLUMN "entity_id",
ADD COLUMN     "status_code" INTEGER NOT NULL;
