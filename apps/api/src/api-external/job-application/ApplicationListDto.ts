export interface ApplicationListDto {
    applicationId: string;
    
    jobId: string;
    jobTitle: string;

    companyId: string;
    companyName: string;

    status: 
    | "SUBMITTED" 
    | "UNDER_REVIEW"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";

    appliedAt: Date;
}