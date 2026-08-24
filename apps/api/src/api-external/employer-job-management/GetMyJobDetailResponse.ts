export interface GetMyJobDetailResponse {
    jobId: string;
    title: string;
    description: string;
    requirement: string;
    employmentType: "ON_SITE" | "REMOTE" | "HYBRID";
    location: string;
    status: "PENDING_APPROVAL" | "ACTIVE" | "REJECTED" | "CLOSED" | "EXPIRED" | "DELETED";
    deadline: Date;
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    deletedAt?: Date;
    approvedAt?: Date;
    rejectedAt?: Date;
    rejectionReason?: string;
}