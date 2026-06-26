import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/HttpError';
import { RoleConstant } from '../../api-shared/constant/RoleConstant';

import { CurrentUser } from '../../security/CurrentAuthenticatedUser';

import { ApplyJobRequest } from './ApplyJobRequest';
import { ApplyJobResponse } from './ApplyJobResponse';

export class ApplicationService {
    public async applyJob(
        currentUser: CurrentUser,
        requestBody: ApplyJobRequest
    ): Promise<ApplyJobResponse> {
        // 1. If the user is not a JOB_SEEKER or is banned, they can't apply
        if (currentUser?.roleId !== RoleConstant.JOB_SEEKER || currentUser.status === "BANNED") {
            throw new HttpError(403, "You can't apply for jobs");
        }

        // 2. Check whether Job exist and ACTIVE
        const job = await prisma.job.findUnique({
            where: { 
                id: requestBody.jobId,
                // I could use `status: "ACTIVE"` here
            },
            select: {
                id: true,
                status: true,
            },
        });

        if (!job) {
            throw new HttpError(404, "Job not found");
        }
        if (job.status !== "ACTIVE") {
            throw new HttpError(400, "This job posting is no longer available");
        }
        // 3. Check whether Resume exist, and belong to current user
        const resume = await prisma.resume.findFirst({
            where: { 
                id: requestBody.resumeId,
                deletedAt: null,
            },
        });
        
        if (!resume) {
            throw new HttpError(404, "Resume not found");
        }
        if (resume.userId !== currentUser.id) {
            throw new HttpError(403, "You are not allowed to use this resume")
        }
        // 4. Check whether Application have already been sent/applied
        const application = await prisma.application.findUnique({
            where: {
                userId_jobId: {
                    userId: currentUser.id,
                    jobId: job.id,
                }
            },
        });

        if (application) {
            throw new HttpError(409, "You have already applied to this job")
        }
        // 5. If nothing goes wrong, create an application row
        const createdApplication = await prisma.application.create({
            data: {
                userId: currentUser.id,
                jobId: job.id,
                resumeId: resume.id,
                status: "SUBMITTED"
            },
            select: {
                id: true,
                status: true,
                appliedAt: true,
            },
        });

        return {
            applicationId: createdApplication.id,
            status: createdApplication.status,
            appliedAt: createdApplication.appliedAt
        };
    }
}