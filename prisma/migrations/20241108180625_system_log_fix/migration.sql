/*
  Warnings:

  - You are about to drop the column `http_method` on the `system_logs` table. All the data in the column will be lost.
  - Added the required column `method` to the `system_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "system_logs" DROP COLUMN "http_method",
ADD COLUMN     "method" "HttpMethod" NOT NULL;
