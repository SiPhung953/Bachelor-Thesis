import { EmploymentType } from '../../api-shared/type/EmploymentType';
import { JobStatus } from '../../api-shared/type/JobStatus';

export interface MyJobListItemDto {
    jobId: string;
    title: string;
    employmentType: EmploymentType;
    location: string;
    status: JobStatus;
    deadline: Date;
    createdAt: Date;
    closedAt?: Date;
    deletedAt?: Date;
}