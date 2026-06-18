import { PersonalInformationDto } from './PersonalInformationDto';

export interface UpdatePersonalInformationResponse {
    message: string;
    userProfile: PersonalInformationDto;
}