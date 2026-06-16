import { JobPreferencesDto } from './JobPreferenceDto';

export interface GetJobPreferenceResponse {
    userJobPreference: JobPreferencesDto | null;
}