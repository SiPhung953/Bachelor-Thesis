export interface JobPreferencesDto {
    profileVisibility: "PRIVATE" | "VISIBLE_TO_EMPLOYERS";
    jobSearchStatus: "OPEN_TO_WORK" | "NOT_LOOKING";
    desiredJobTitle: string | null;
    preferredLocation: string | null;
    updatedAt: Date;
}