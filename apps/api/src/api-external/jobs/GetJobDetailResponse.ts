export interface GetJobDetailResponse {
    id: string;
    title: string;
    description: string;
    location: string;
    employmentType: "ON_SITE" | "REMOTE" | "HYBRID";

    company: {
        id: string;
        name: string;
    };
}