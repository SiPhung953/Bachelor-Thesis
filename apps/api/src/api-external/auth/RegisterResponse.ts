export interface RegisterResponse {
    user: {
        id: string;
        email: string;
        roleId: number;
        status: "ACTIVE" | "BANNED";
    }
}