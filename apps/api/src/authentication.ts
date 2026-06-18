import "dotenv/config";

import { Request, Response } from 'express';
import { JwtService } from "./utils/JwtService";
import { prisma } from './lib/prisma';
import { CurrentUser } from './security/CurrentAuthenticatedUser';

interface JwtPayload {
    userId: string;
}

interface AuthenticatedRequest extends Request {
    currentUser?: CurrentUser;
}

function createError(message: string, status: number) {
    const error = new Error(message) as Error & { status?: number };
    error.status = status;
    return error;
}

export async function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[],
    response?: Response
): Promise<CurrentUser> {
    if (securityName !== "jwt") {
        throw createError("Unsupported authentication method", 401);
    }

    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw createError("Missing access token", 401);
    }

    const token = authorization.replace("Bearer ", "");
    const jwtService = new JwtService();

    let payload: JwtPayload;

    try {
        payload = jwtService.verify(token);
    } catch {
        throw createError("Invalid access token", 401);
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
            id: true,
            email: true,
            roleId: true,
            status: true,
        },
    });

    if (!user) {
        throw createError("Invalid access token", 401);
    }

    if (user.status == "BANNED") {
        throw createError("User is banned", 403);
    }

    const currentUser: CurrentUser = {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        status: user.status,
    };

    (request as AuthenticatedRequest).currentUser = currentUser;
    return currentUser;
}