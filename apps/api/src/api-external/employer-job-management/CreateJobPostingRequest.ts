export interface CreateJobPostingRequest {
    title: string;
    description: string;
    employmentType: "ON_SITE" | "REMOTE" | "HYBRID";
    location: string;
    requirement: string;
    deadline: Date;
}