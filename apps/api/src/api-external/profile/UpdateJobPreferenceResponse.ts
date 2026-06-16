import { JobPreferencesDto } from './JobPreferenceDto';

export interface UpdateJobPreferencesResponse {
    message: string;
    userJobPreference: JobPreferencesDto;
}

// The response have to return in full, everything of the user