import "dotenv/config";

import jwt from "jsonwebtoken";

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return secret;
}

const JWT_SECRET = getJwtSecret();

export interface JwtPayload {
    userId: string;
    email: string;
    roleId: number;
}

export class JwtService {
    public sign(payload: JwtPayload): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    }

    public verify(token: string): JwtPayload {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    }

    public decode(token: string): JwtPayload | null {
        const decoded = jwt.decode(token);
        return decoded as JwtPayload | null;
    }
}
