import { EmploymentType } from '../../api-shared/type/EmploymentType';

export interface CreateJobPostingResponse {
    jobId: string;
    title: string;
    description: string;
    requirement: string;
    employmentType: EmploymentType;
    location: string;
    deadline: Date;
    status: "PENDING_APPROVAL";
    createdAt: Date;
}