export interface UpdateJobPreferencesRequest {
    profileVisibility?: "PRIVATE" | "VISIBLE_TO_EMPLOYERS";
    jobSearchStatus?: "OPEN_TO_WORK" | "NOT_LOOKING"
    desiredJobTitle?: string;
    preferredLocation?: string;
}

// The request can omit certain fields/can be partial
// E.g. The user can only update jobSearchStatus