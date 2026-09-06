import { EmploymentType } from '../../api-shared/type/EmploymentType';

export interface UpdateJobPostingResponse {
    jobId: string;
    title: string;
    description: string;
    requirement: string;
    employmentType: EmploymentType;
    location: string;
    deadline: Date;
    status: "PENDING_APPROVAL";
    updatedAt: Date;
}