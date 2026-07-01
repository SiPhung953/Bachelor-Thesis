import "dotenv/config";

import { Request, Response } from 'express';
import { JwtService } from "./utils/JwtService";
import { prisma } from './lib/prisma';
import { HttpError } from './utils/HttpError';
import { RoleConstant } from './api-shared/constant/RoleConstant';

import { CurrentUser } from './security/CurrentAuthenticatedUser';

interface JwtPayload {
    userId: string;
}

interface AuthenticatedRequest extends Request {
    currentUser?: CurrentUser;
}

export async function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[],
    _response?: Response
): Promise<CurrentUser> {
    if (securityName !== "jwt") {
        throw new HttpError(401, "Unsupported authentication method");
    }

    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new HttpError(401, "Missing access token");
    }

    const token = authorization.replace("Bearer ", "");
    const jwtService = new JwtService();

    let payload: JwtPayload;

    try {
        payload = jwtService.verify(token);
    } catch {
        throw new HttpError(401, "Invalid access token");
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
        throw new HttpError(401, "Invalid access token");
    }

    if (user.status.toLowerCase() === "banned") {
        throw new HttpError(403, "Account is banned");
    }

    if (scopes && scopes.length > 0) {
        const allowedRoleIds = scopes
            .map(scope => RoleConstant[scope as keyof typeof RoleConstant])
            .filter((roleId): roleId is RoleConstant => roleId !== undefined);
            
        if (!allowedRoleIds.includes(user.roleId as RoleConstant)) {
            throw new HttpError(403, "Forbidden");
        }
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