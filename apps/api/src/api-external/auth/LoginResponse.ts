// Server return this
export interface LoginResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        roleId: number;
        status: string;
    }
}

// the user: {} is a public subset of the model User