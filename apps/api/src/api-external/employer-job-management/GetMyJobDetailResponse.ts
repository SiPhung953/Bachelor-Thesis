import { EmploymentType } from '../../api-shared/type/EmploymentType';
import { JobStatus } from '../../api-shared/type/JobStatus';

export interface GetMyJobDetailResponse {
    jobId: string;
    title: string;
    description: string;
    requirement: string;
    employmentType: EmploymentType;
    location: string;
    status: JobStatus;
    deadline: Date;
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    deletedAt?: Date;
    approvedAt?: Date;
    rejectedAt?: Date;
    rejectionReason?: string;
}