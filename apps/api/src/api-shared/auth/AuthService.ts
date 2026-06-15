import { LoginRequest } from "./LoginRequest";
import { LoginResponse } from "./LoginResponse";
import { RegisterRequest } from "./RegisterRequest";
import { RegisterResponse } from "./RegisterResponse";
import { LogoutResponse } from "./LogoutResponse";
import { ForgotPasswordRequest } from "./ForgotPasswordRequest";
import { ForgotPasswordResponse } from "./ForgotPasswordResponse";
import { ResetPasswordRequest } from "./ResetPasswordRequest";
import { ResetPasswordResponse } from "./ResetPasswordResponse";

import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

import { PasswordHasher } from "../../utils/PasswordHasher";
import { ResetTokenUtils } from "../../utils/ResetTokenUtils";
import { EmailService } from "../email/EmailService";
import { HttpError } from "../../utils/HttpError";

const passwordHasher = new PasswordHasher();
const JWT_SECRET = process.env.JWT_SECRET || "default-jwt-secret-key-for-dev";
const RESET_TOKEN_EXPIRY_TIME = Number(process.env.RESET_TOKEN_EXPIRY_TIME) || 15;
const PASSWORD_RESET_MESSAGE = String(process.env.PASSWORD_RESET_MESSAGE);

export class AuthService {
    constructor(private readonly emailService: EmailService = new EmailService()) {}

    public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
        // 1. Find user by email
        const user = await prisma.user.findUnique({
            where: { email: loginRequest.email }
        });

        // 2. If user does not exist, reject login
        if (!user) {
            throw new HttpError(404, "Invalid email or password.");
        }

        // 3. Compare loginRequest.password with user.passwordHash
        const isPasswordValid = await passwordHasher.compare(loginRequest.password, user.passwordHash);

        // 4. If password invalid, reject login
        if (!isPasswordValid) {
            throw new HttpError(401, "Invalid email or password.");
        }

        // 5. Check user status
        if (user.status.toLowerCase() === "banned") {
            throw new HttpError(403, "Your account has been banned.");
        }

        // 6. Generate access token
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, roleId: user.roleId },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 7. Return accessToken + safe user data
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                roleId: user.roleId,
                status: user.status
            }
        };
    }

    public async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
        // Check for existing email to avoid duplicates
        const existing = await prisma.user.findUnique({
          where: { email: registerRequest.email },
        });
        if (existing) {
          throw new HttpError(400, "Email already registered");
        }

        // Before: hard coding roleId assignment to 1
        // This is created so that if I were to fuck up the Database
        // Then the new user can still register and got the default role.
        const defaultRole = await prisma.role.findUnique({
            where: {
                name: "JOB_SEEKER",
            },
            select: {
                id: true,
            },
            });
        if (!defaultRole) {
            throw new Error("Default role JOB_SEEKER is not seeded");
        }

        const passwordHash = await passwordHasher.hash(registerRequest.password);
        const registeredUser = await prisma.user.create({
          data: {
            email: registerRequest.email,
            roleId: defaultRole.id,
            passwordHash: passwordHash,
          },
          select: {
            id: true,
            email: true,
            roleId: true,
            status: true,
          },
        });
        return {
          user: registeredUser,
        };
    }
    
    public logout(): LogoutResponse {
        // Because the logout happened at frontend level (JWT being stateless)
        // Frontend UI will remove accessToken and redirect user to /login
        // Thus, this method is neither async nor does it return a promise, since the
        // message is only meant as "Backend operation is completed"
        return {
            message: "Logout Successful"
        }
    }

    public async requestPasswordReset(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
        // 1. Find user by email
        const user = await prisma.user.findUnique({
            where: { email: request.email }
        });

        // 2. If user does not exist, send a response
        if (!user) {
            return {
                message: PASSWORD_RESET_MESSAGE,
            };
        }

        // 3. Create reset token and hash
        const rawToken = ResetTokenUtils.generate();
        const tokenHash = ResetTokenUtils.hash(rawToken);

        // 4. create token hash entry in DB
        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash: tokenHash,
                expiresAt: new Date(Date.now() + RESET_TOKEN_EXPIRY_TIME * 60 * 1000)
            }
        });

        // 5. Send email to user
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
        await this.emailService.sendPasswordResetEmail(user.email, resetUrl);

        return {
            message: PASSWORD_RESET_MESSAGE,
        };
    }

    public async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
        // 1. Hash submitted raw token
        const tokenHash = ResetTokenUtils.hash(request.token);

        // 2. Find valid token record in DB
        const resetTokenRecord = await prisma.passwordResetToken.findFirst({
            where: {
                tokenHash: tokenHash,
                usedAt: null,
                expiresAt: {
                    gt: new Date(),
                }
            }
        });

        // 3. If the token is invalid, already used
        if (!resetTokenRecord) {
            throw new HttpError(400, "Invalid or expired reset token");
        }

        // 4. Hash the new password
        const passwordHash = await passwordHasher.hash(request.newPassword);

        // 5. Prisma need to update 2 table: users.passwordHash and passwordResetToken.usedAt
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetTokenRecord.userId },
                data: { passwordHash: passwordHash }
            }),
            prisma.passwordResetToken.update({
                where: { id: resetTokenRecord.id },
                data: { usedAt: new Date() }
            })
        ]);

        return {
            message: "Password reset successful."
        };
    }

    // The user can access the reset-password page, even when the token is invalidated
    // The user can't reset the password, but the fact that the UI is renderable is annoying
    public async validateResetToken(token: string): Promise<{ valid: boolean }> {
    const tokenHash = ResetTokenUtils.hash(token);

    const resetTokenRecord = await prisma.passwordResetToken.findFirst({
        where: {
            tokenHash,
            usedAt: null,
            expiresAt: {
                gt: new Date(),
            },
        },
    });

    return {
        valid: resetTokenRecord !== null,
    };
}
}