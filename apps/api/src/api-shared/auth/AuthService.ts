import { LoginRequest } from "./LoginRequest";
import { LoginResponse } from "./LoginResponse";
import { RegisterRequest } from "./RegisterRequest";
import { RegisterResponse } from "./RegisterResponse";
import { LogoutResponse } from "./LogoutResponse";
import { ForgotPasswordRequest } from "./ForgotPasswordRequest";
import { ForgotPasswordResponse } from "./ForgotPasswordResponse";
import { ResetPasswordRequest } from "./ResetPasswordRequest";
import { ResetPasswordResponse } from "./ResetPasswordResponse";

import { prisma } from "../../lib/prisma.js";
import { PasswordHasher } from "../../utils/PasswordHasher";
import { ResetTokenUtils } from "../../utils/ResetTokenUtils";
import jwt from "jsonwebtoken";

const passwordHasher = new PasswordHasher();
const JWT_SECRET = process.env.JWT_SECRET || "default-jwt-secret-key-for-dev";

export class HttpError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = "HttpError";
    }
}

export class AuthService {
    public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
        // 1. Find user by email
        const user = await prisma.user.findUnique({
            where: { email: loginRequest.email }
        });

        // 2. If user does not exist, reject login
        if (!user) {
            throw new Error("Invalid email or password");
        }

        // 3. Compare loginRequest.password with user.passwordHash
        const isPasswordValid = await passwordHasher.compare(loginRequest.password, user.passwordHash);

        // 4. If password invalid, reject login
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        // 5. Check user status
        if (user.status === "Banned") {
            throw new Error("User account is banned");
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
        const passwordHash = await passwordHasher.hash(registerRequest.password);
        const registeredUser = await prisma.user.create({
          data: {
            email: registerRequest.email,
            roleId: 1, // TODO: replace with lookup from Role table when implemented
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

    // forgotPassword happen within /auth (Login/Register screen), maybe within /me (Current profile) in the future
    // forgotPassword should be divided into 2 methods: requestPasswordReset() and resetPassword()

    // TODO: 
    // Create new utils for token generation and hash
        // Generate a opaque random reset token
            // import crypto from "node:crypto"
            // crypto.randomBytes(32).toString("base64url")
        // Hash the token
            // crypto.createHash("sha265")
    // Create new Prisma model for token storage
        // id, userId, tokenHash, expiresAt (After 15 mins), createdAt
    // DTOs for ForgotPasswordRequest, ForgotPasswordResponse (this one will hold the raw token), ResetPasswordRequest, ResetPasswordResponse

    public async requestPasswordReset(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
        // 1. Find user by email
        const user = await prisma.user.findUnique({
            where: { email: request.email }
        });

        // 2. If user does not exist, send a response:
        if (!user) {
            return {
                message: "If an account with this email exists, password reset instructions have been sent."
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
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            }
        });

        return {
            message: "If an account with this email exists, password reset instructions have been sent.",
            resetToken: rawToken
        };
    }

    public async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
        // 1. Request body will contain raw token, hash the raw token
        const tokenHash = ResetTokenUtils.hash(request.token);

        // 2. Find the token in DB
        const resetTokenRecord = await prisma.passwordResetToken.findFirst({
            where: {
                tokenHash: tokenHash,
                usedAt: null,
                expiresAt: {
                    gt: new Date(),
                }
            }
        });

        // 3. If the token is already used or expired, throw Error
        if (!resetTokenRecord) {
            throw new Error("Invalid or expired reset token");
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
}