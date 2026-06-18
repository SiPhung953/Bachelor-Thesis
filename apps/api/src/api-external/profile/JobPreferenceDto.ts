export interface JobPreferencesDto {
    profileVisibility: "VISIBLE_TO_EMPLOYERS" | "PRIVATE";
    jobSearchStatus: "OPEN_TO_WORK" | "NOT_LOOKING";
    desiredJobTitle: string | null;
    preferredLocation: string | null;
    updatedAt: Date;
}