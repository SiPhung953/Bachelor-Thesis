import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import { AuthService } from "./AuthService";

import { LoginRequest } from "./LoginRequest";
import { LoginResponse } from "./LoginResponse";
import { RegisterRequest } from "./RegisterRequest";
import { RegisterResponse } from "./RegisterResponse";
import { LogoutResponse } from "./LogoutResponse";
import { ForgotPasswordRequest } from "./ForgotPasswordRequest";
import { ForgotPasswordResponse } from "./ForgotPasswordResponse";
import { ResetPasswordRequest } from "./ResetPasswordRequest";
import { ResetPasswordResponse } from "./ResetPasswordResponse";

@Tags("Auth")
@Route("auth")
export class AuthController extends Controller {
    @SuccessResponse("200", "OK")
    @Post("login")
    public async authenticateUser(
        @Body() requestBody: LoginRequest
    ): Promise<LoginResponse> {
        this.setStatus(200);
        return new AuthService().login(requestBody);
    }

    @SuccessResponse("201", "Created")
    @Post("register")
    public async registerUser(
        @Body() requestBody: RegisterRequest
    ): Promise<RegisterResponse> {
        this.setStatus(201);
        return new AuthService().register(requestBody);
    }

    @SuccessResponse("200", "OK")
    @Post("logout")
    public async logoutUser(): Promise<LogoutResponse> {
        this.setStatus(200);
        return new AuthService().logout();
    }

    @SuccessResponse("200", "OK")
    @Post("forgot-password")
    public async requestPasswordReset(
        @Body() requestBody: ForgotPasswordRequest
    ): Promise<ForgotPasswordResponse> {
        this.setStatus(200);
        return new AuthService().requestPasswordReset(requestBody);
    }

    @SuccessResponse("200", "OK")
    @Post("reset-password")
    public async resetPassword(
        @Body() requestBody: ResetPasswordRequest
    ): Promise<ResetPasswordResponse> {
        this.setStatus(200);
        return new AuthService().resetPassword(requestBody);
    }

    @SuccessResponse("200", "OK")
    @Get("reset-password/validate")
    public async validateResetToken(
        @Query() token: string
    ): Promise<{ valid: boolean }> {
        return new AuthService().validateResetToken(token);
}
}
