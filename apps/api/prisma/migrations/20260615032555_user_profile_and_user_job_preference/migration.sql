-- CreateEnum
CREATE TYPE "profileVisibility" AS ENUM ('PUBLIC', 'VISIBLE_TO_EMPLOYER', 'PRIVATE');

-- CreateEnum
CREATE TYPE "jobSearchStatus" AS ENUM ('OPEN_FOR_JOBS', 'CLOSED');

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "headline" TEXT,
    "summary" TEXT,
    "phone_number" TEXT,
    "city" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userJobPreference" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "profile_visibility" "profileVisibility" NOT NULL,
    "job_search_status" "jobSearchStatus" NOT NULL,
    "desired_job_title" TEXT NOT NULL,
    "preffered_location" TEXT NOT NULL,

    CONSTRAINT "userJobPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "userProfile_user_id_key" ON "userProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "userJobPreference_user_id_key" ON "userJobPreference"("user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userProfile" ADD CONSTRAINT "userProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userJobPreference" ADD CONSTRAINT "userJobPreference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
