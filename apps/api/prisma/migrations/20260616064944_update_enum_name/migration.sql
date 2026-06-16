/*
  Warnings:

  - The values [OPEN_FOR_JOBS,CLOSED] on the enum `jobSearchStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [VISIBLE_TO_EMPLOYER] on the enum `profileVisibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "jobSearchStatus_new" AS ENUM ('OPEN_TO_WORK', 'NOT_LOOKING');
ALTER TABLE "user_job_preference" ALTER COLUMN "job_search_status" TYPE "jobSearchStatus_new" USING ("job_search_status"::text::"jobSearchStatus_new");
ALTER TYPE "jobSearchStatus" RENAME TO "jobSearchStatus_old";
ALTER TYPE "jobSearchStatus_new" RENAME TO "jobSearchStatus";
DROP TYPE "public"."jobSearchStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "profileVisibility_new" AS ENUM ('PUBLIC', 'VISIBLE_TO_EMPLOYERS', 'PRIVATE');
ALTER TABLE "user_job_preference" ALTER COLUMN "profile_visibility" TYPE "profileVisibility_new" USING ("profile_visibility"::text::"profileVisibility_new");
ALTER TYPE "profileVisibility" RENAME TO "profileVisibility_old";
ALTER TYPE "profileVisibility_new" RENAME TO "profileVisibility";
DROP TYPE "public"."profileVisibility_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
