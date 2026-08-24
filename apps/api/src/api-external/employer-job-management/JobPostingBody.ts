export interface JobPostingBody {
    title: string;
    description: string;
    requirement: string;
    employmentType: "ON_SITE" | "REMOTE" | "HYBRID";
    location: string;
    deadline: Date;
}