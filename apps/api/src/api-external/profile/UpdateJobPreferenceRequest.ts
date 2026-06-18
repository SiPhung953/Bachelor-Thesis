export interface UpdateJobPreferencesRequest {
    profileVisibility?: "VISIBLE_TO_EMPLOYERS" | "PRIVATE";
    jobSearchStatus?: "OPEN_TO_WORK" | "NOT_LOOKING"
    desiredJobTitle?: string;
    preferredLocation?: string;
}