import { ApplicationStatus } from '../../api-shared/type/ApplicationStatus';

export interface ApplicationListDto {
    applicationId: string;
    
    jobId: string;
    jobTitle: string;

    companyId: string;
    companyName: string;

    status: ApplicationStatus;

    appliedAt: Date;
}