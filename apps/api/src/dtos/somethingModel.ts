// For testing purpose atm.
export interface User {
    id: number;
    email: string;
    name: string;
    status?: "Alive" | "Dead";
    phoneNumber: string[];
}