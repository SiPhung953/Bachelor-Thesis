import { User } from "../dtos/somethingModel.js";

export type SomethingParams = Pick<User, "email" | "name" | "phoneNumber">;

export class SomethingService {
    public get(id: number, name?: string): User {
        return {
            id,
            email: "something@abc.com",
            name: name ?? "Sum Ting",
            status: "Alive",
            phoneNumber: []
        };
    }

    public create(somethingParams: SomethingParams): User {
        return {
            id: Math.floor(Math.random() * 1000),
            ...somethingParams
        }
    }

    public kill(id: number): User {
        const existingUser = this.get(id);
        return {
            ...existingUser,
            status: "Dead"
        }
    }
}

/*
// userModel.ts
interface User {
    id: number
    name: string
    email: string
    status: "ACTIVE" | "BANNED"
}

// userService.ts
export type LoginReq = Pick<User, "name" | "email" | "status">

method get(id: number): User {
    return {
        name: name ?? "John Doe"
        email: email ?? "john@doe.com"
        status: "ACTIVE"
    }
}

method create(loginReq: LoginReq): User { 
    return {
        id: random(1 - 1000)
        ...loginReq
    }
}

method ban(id: number): User {
    return {
        status: "BANNED"
        ...LoginReq
    }
}
*/