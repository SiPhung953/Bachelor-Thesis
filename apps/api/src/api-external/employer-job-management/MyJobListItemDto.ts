export interface MyJobListItemDto {
    jobId: string;
    title: string;
    employmentType: string;
    location: string;
    status: "PENDING_APPROVAL" | "ACTIVE" | "REJECTED" | "CLOSED" | "EXPIRED" | "DELETED";
    deadline: Date;
    createdAt: Date;
    closedAt?: Date;
    deletedAt?: Date;
}