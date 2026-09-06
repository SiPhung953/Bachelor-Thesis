import { ApplicationStatus } from '../../api-shared/type/ApplicationStatus';

export interface EmployerApplicationResponse {
    applicationId: string;
    
    // Application candidate info
    candidateName?: string;
    candidateEmail: string;
    candidateHeadline?: string;
    candidatePhoneNumber?: string;
    candidateCity?: string;

    // Attached resume
    resumeId: string;
    resumeTitle: string;
    resumeFileUrl: string;

    // The applications belong to which job posting
    jobId: string;
    jobTitle: string;

    // Application info
    applicationStatus: ApplicationStatus;
    appliedAt: Date;
    underReviewAt?: Date;
    withdrawnAt?: Date;
    decidedAt?: Date;
    rejectionReason?: string;
    updatedAt: Date;
}