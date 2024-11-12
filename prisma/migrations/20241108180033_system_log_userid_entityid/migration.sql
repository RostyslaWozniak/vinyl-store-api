/*
  Warnings:

  - The primary key for the `system_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `method` on the `system_logs` table. All the data in the column will be lost.
  - Added the required column `entity_id` to the `system_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `http_method` to the `system_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `system_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "system_logs" DROP CONSTRAINT "system_logs_pkey",
DROP COLUMN "method",
ADD COLUMN     "entity_id" TEXT NOT NULL,
ADD COLUMN     "http_method" "HttpMethod" NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "system_logs_id_seq";
