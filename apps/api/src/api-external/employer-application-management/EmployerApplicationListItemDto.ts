export interface EmployerApplicationListItemDto {
    applicationId: string;
    candidateName?: string; // userProfile.fullName is nullable
    candidateEmail: string;
    resumeId: string;
    resumeTitle: string;
    applicationStatus: "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
    appliedAt: Date;
}