export interface UpdateApplicationStatusRequest {
    decision: "ACCEPTED" | "REJECTED";
    rejectionReason?: string;
}