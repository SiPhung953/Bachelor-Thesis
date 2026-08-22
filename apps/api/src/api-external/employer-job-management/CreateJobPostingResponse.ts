export interface CreateJobPostingResponse {
    jobId: string;
    title: string;
    description: string;
    requirement: string;
    employmentType: "ON_SITE" | "REMOTE" | "HYBRID";
    location: string;
    deadline: Date;
    status: "PENDING_APPROVAL";
    createdAt: Date;
}