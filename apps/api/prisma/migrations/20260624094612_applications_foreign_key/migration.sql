/*
  Warnings:

  - You are about to drop the column `appliedAt` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `rejectionReason` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `resumeId` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `underReviewAt` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `withdrawnAt` on the `applications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,job_id]` on the table `applications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `job_id` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume_id` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_resumeId_fkey";

-- DropIndex
DROP INDEX "applications_userId_jobId_key";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "appliedAt",
DROP COLUMN "jobId",
DROP COLUMN "rejectionReason",
DROP COLUMN "resumeId",
DROP COLUMN "underReviewAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "withdrawnAt",
ADD COLUMN     "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "job_id" TEXT NOT NULL,
ADD COLUMN     "rejection_reason" TEXT,
ADD COLUMN     "resume_id" TEXT NOT NULL,
ADD COLUMN     "under_review_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "withdrawn_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "applications_user_id_job_id_key" ON "applications"("user_id", "job_id");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
