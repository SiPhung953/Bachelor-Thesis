/*
  Warnings:

  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `user_job_preference` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[owner_employer_id]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_employer_id` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PRIVATE', 'VISIBLE_TO_EMPLOYERS');

-- CreateEnum
CREATE TYPE "JobSearchStatus" AS ENUM ('OPEN_TO_WORK', 'NOT_LOOKING');

-- CreateEnum
CREATE TYPE "ResumeFileType" AS ENUM ('PDF', 'DOC', 'DOCX');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- DropForeignKey
ALTER TABLE "user_job_preference" DROP CONSTRAINT "user_job_preference_user_id_fkey";

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "owner_employer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_profiles" ALTER COLUMN "full_name" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "updated_at" DROP DEFAULT;

-- DropTable
DROP TABLE "user_job_preference";

-- DropEnum
DROP TYPE "jobSearchStatus";

-- DropEnum
DROP TYPE "profileVisibility";

-- CreateTable
CREATE TABLE "user_job_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "profile_visibility" "ProfileVisibility" NOT NULL DEFAULT 'VISIBLE_TO_EMPLOYERS',
    "job_search_status" "JobSearchStatus" NOT NULL DEFAULT 'OPEN_TO_WORK',
    "desired_job_title" TEXT,
    "preffered_location" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_job_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" "ResumeFileType" NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "underReviewAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rejectionReason" TEXT,
    "withdrawnAt" TIMESTAMP(3),

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_job_preferences_user_id_key" ON "user_job_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_userId_jobId_key" ON "applications"("userId", "jobId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_owner_employer_id_key" ON "companies"("owner_employer_id");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_employer_id_fkey" FOREIGN KEY ("owner_employer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_job_preferences" ADD CONSTRAINT "user_job_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
