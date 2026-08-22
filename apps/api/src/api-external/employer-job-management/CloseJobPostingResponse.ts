export interface CloseJobPostingResponse {
    jobId: string;
    status: "CLOSED";
    closedAt: Date;
    message: string;
}
