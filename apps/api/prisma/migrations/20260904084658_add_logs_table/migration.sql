-- CreateEnum
CREATE TYPE "LogTargetType" AS ENUM ('USER', 'JOB', 'APPLICATION', 'RESUME', 'COMPANY', 'AUTH', 'SYSTEM');

-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARN', 'ERROR');

-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('USER_REGISTERED', 'USER_LOGGED_IN', 'USER_LOGGED_OUT', 'USER_LOGIN_FAILED', 'USER_BANNED', 'USER_UNBANNED', 'PASSWORD_RESET_REQUESTED', 'PASSWORD_RESET_COMPLETED', 'PASSWORD_CHANGED', 'COMPANY_CREATED', 'COMPANY_UPDATED', 'JOB_CREATED', 'JOB_UPDATED', 'JOB_APPROVED', 'JOB_REJECTED', 'JOB_REOPENED', 'JOB_CLOSED', 'JOB_DELETED', 'JOB_EXPIRED', 'APPLICATION_SUBMITTED', 'APPLICATION_UNDER_REVIEW', 'APPLICATION_STATUS_UPDATED', 'APPLICATION_WITHDRAWN', 'RESUME_UPLOADED', 'RESUME_DELETED', 'PROFILE_UPDATED', 'AVATAR_CHANGED', 'JOB_PREFERENCE_UPDATED', 'SYSTEM_ERROR');

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "action" "LogAction" NOT NULL,
    "target_type" "LogTargetType" NOT NULL,
    "target_id" TEXT,
    "message" TEXT NOT NULL,
    "level" "LogLevel" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "logs_target_type_target_id_idx" ON "logs"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "logs_actor_id_idx" ON "logs"("actor_id");

-- CreateIndex
CREATE INDEX "logs_created_at_idx" ON "logs"("created_at");

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
