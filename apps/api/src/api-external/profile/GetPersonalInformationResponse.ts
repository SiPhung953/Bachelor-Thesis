import { PersonalInformationDto } from './PersonalInformationDto';

export interface GetPersonalInformationResponse {
    userProfile: PersonalInformationDto | null;
}

// Personal Information can be null, this handle the case where the user exists but has not created
// job preference yet. 
// After ProfileService upsert, the row should exist in DB and thus can be Updated