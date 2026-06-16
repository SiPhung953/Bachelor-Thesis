import jwt from "jsonwebtoken";

const JWT_SECRET = String(process.env.JWT_SECRET) || "default-jwt-secret-key-for-dev";

export interface JwtPayload {
    id: string;
    email: string;
    roleId: number;
}

export class JwtService {
    public sign(payload: JwtPayload): string {
        const accessToken = jwt.sign(payload, JWT_SECRET, { 
            expiresIn: "1d" 
        });
        return accessToken;
    }

    public verify(token: string): JwtPayload {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    }

    public decode(token: string): JwtPayload | null {
        const decoded = jwt.decode(token);
        return decoded as JwtPayload | null;
    }
}
