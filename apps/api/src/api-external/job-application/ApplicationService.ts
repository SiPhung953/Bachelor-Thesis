import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/HttpError';
import { RoleConstant } from '../../api-shared/constant/RoleConstant';

import { CurrentUser } from '../../security/CurrentAuthenticatedUser';

import { ApplyJobRequest } from './ApplyJobRequest';
import { ApplyJobResponse } from './ApplyJobResponse';
import { ApplicationListDto } from './ApplicationListDto';
import { WithdrawApplicationResponse } from './WithdrawApplicationResponse';

export class ApplicationService {
    public async applyJob(
        currentUser: CurrentUser,
        requestBody: ApplyJobRequest
    ): Promise<ApplyJobResponse> {
        // 1. If the user is not a JOB_SEEKER or is banned, they can't apply
        if (
            currentUser?.roleId !== RoleConstant.JOB_SEEKER || 
            currentUser.status === "BANNED"
        ) {
            throw new HttpError(403, "Only Job Seekers can perform this action.");
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
            throw new HttpError(404, "Job not found.");
        }
        if (job.status !== "ACTIVE") {
            throw new HttpError(400, "Job posting is no longer available.");
        }
        // 3. Check whether Resume exist, and belong to current user
        const resume = await prisma.resume.findFirst({
            where: { 
                id: requestBody.resumeId,
                deletedAt: null,
            },
        });
        
        if (!resume) {
            throw new HttpError(404, "Resume not found.");
        }
        if (resume.userId !== currentUser.id) {
            throw new HttpError(403, "You do not own this resume.")
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
            throw new HttpError(409, "You have already applied for this job.")
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

    public async getMyApplications(currentUser: CurrentUser): Promise<ApplicationListDto[]> {
        if (
            currentUser?.roleId !== RoleConstant.JOB_SEEKER || 
            currentUser.status === "BANNED"
        ) {
            throw new HttpError(403, "Only Job Seekers can perform this action.");
        }

        const applications = await prisma.application.findMany({
            where: { userId: currentUser.id },
            // You can query like this
            select: {
                id: true,
                status: true,
                appliedAt: true,

                // Since application have a relation with job,
                // and job have a relation with company
                // you have this waterfall-ish query
                job: {
                    select: {
                        id: true,
                        title: true,
                        
                        company: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        // Since findMany return an array, we have to map the value
        // to their field in the Dto
        // Each applications entry will be mapped to an array object
        return applications.map(application => ({
            applicationId: application.id,

            jobId: application.job.id,
            jobTitle: application.job.title,

            companyId: application.job.company.id,
            companyName: application.job.company.name,

            status: application.status,
            appliedAt: application.appliedAt,
        }));
    }

    public async withdrawApplication(
        currentUser: CurrentUser,
        applicationId: string
    ): Promise<WithdrawApplicationResponse> {
        if (
            currentUser?.roleId !== RoleConstant.JOB_SEEKER || 
            currentUser.status === "BANNED"
        ) {
            throw new HttpError(403, "Only Job Seekers can perform this action.");
        }

        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: {
                id: true,
                userId: true,
                status: true,
            },
        });
        // existence check
        if (!application) {
            throw new HttpError(404, "Application not found.");
        }
        // ownership check
        if (application.userId !== currentUser.id) {
            throw new HttpError(403, "You are not allowed to withdraw this application.");
        }
        // status check
        // NOTE: UNDER_REVIEW cannot be withdrawn
        if (application.status !== "SUBMITTED") {
            throw new HttpError(400, "Application cannot be withdrawn at its current status.");
        }

        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: {
                status: "WITHDRAWN",
                withdrawnAt: new Date(),
            },
            select: {
                status: true,
                withdrawnAt: true,
            },
        });

        return {
            status: updatedApplication.status,
            withdrawnAt: updatedApplication.withdrawnAt || new Date(),
            message: "Application withdrawn successfully"
        }
    }
}