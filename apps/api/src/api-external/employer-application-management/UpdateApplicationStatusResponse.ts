export interface UpdateApplicationStatusResponse {
    applicationId: string;
    applicationStatus: "ACCEPTED" | "REJECTED";
    decidedAt?: Date;
    rejectionReason?: string;
    message: string;
}
