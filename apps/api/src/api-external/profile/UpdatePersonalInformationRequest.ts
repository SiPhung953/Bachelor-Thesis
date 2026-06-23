export interface UpdatePersonalInformationRequest {
    fullName?: string;
    dateOfBirth?: Date | null;
    headline?: string;
    phoneNumber?: string;
    city?: string;
    summary?: string;
}