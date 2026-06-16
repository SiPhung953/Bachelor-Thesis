export interface RegisterRequest {
    email: string;
    password: string;
    // roleId: number;
    // TODO: When the user can register as Employer, allow RegisterRequest to send roleId
}