export interface PutApplicationUnderReviewResponse {
    applicationId: string;
    applicationStatus: "UNDER_REVIEW";
    underReviewAt: Date;
    message: string;
}