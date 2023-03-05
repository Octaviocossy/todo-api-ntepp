/*
  Warnings:

  - You are about to drop the column `updated_at` on the `AuthToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AuthToken" DROP COLUMN "updated_at",
ADD COLUMN     "expires_at" TIMESTAMP(3);
