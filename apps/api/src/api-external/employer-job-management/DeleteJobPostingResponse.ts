export interface DeleteJobPostingResponse {
    jobId: string;
    status: "DELETED";
    deletedAt: Date;
    message: string;
}
