import type { NextFunction, Request, Response } from 'express';
import { JwtService } from '../utils/JwtService';
import { prisma } from '../lib/prisma';
import { CurrentUser } from '../security/CurrentAuthenticatedUser';

const jwtService = new JwtService();

export interface AuthenticatedRequest extends Request {
    currentUser?: CurrentUser;
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing access token" });
    }

    const token = authorization.replace("Bearer ", "");

    try {
        const payload = jwtService.verify(token)

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                email: true,
                roleId: true,
                status: true,
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid access token" });
        }

        if (user.status.toLowerCase() === "banned") {
            return res.status(403).json({ message: "Account is banned" });
        }

        req.currentUser = user;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid access token "});
    }
}