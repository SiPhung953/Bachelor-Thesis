import { ApplicationStatus } from '../../api-shared/type/ApplicationStatus';

export interface EmployerApplicationListItemDto {
    applicationId: string;
    candidateName?: string; // userProfile.fullName is nullable
    candidateEmail: string;
    resumeId: string;
    resumeTitle: string;
    applicationStatus: ApplicationStatus;
    appliedAt: Date;
}