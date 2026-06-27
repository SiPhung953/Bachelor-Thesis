import {
    Controller,
    Tags,
    Get,
    Post,
    Body,
    Request,
    SuccessResponse,
    Security,
    Route,
} from 'tsoa';
import { Request as ExpressRequest } from 'express';

import { ApplicationService } from './ApplicationService';
import { CurrentUser } from '../../security/CurrentAuthenticatedUser';
import { ApplicationListDto } from './ApplicationListDto';
import { ApplyJobResponse } from './ApplyJobResponse';
import { ApplyJobRequest } from './ApplyJobRequest';

interface AuthenticatedRequest extends ExpressRequest {
    currentUser: CurrentUser
}

@Tags("Applications")
@Route("applications")
@Security("jwt")
export class ApplicationController extends Controller {
    private readonly applicationService = new ApplicationService()

    @SuccessResponse(201, "Created")
    @Post()
    public async applyJobs(
        @Request() request: AuthenticatedRequest,
        @Body() requestBody: ApplyJobRequest
    ): Promise<ApplyJobResponse> {
        this.setStatus(201);
        return this.applicationService.applyJob(request.currentUser, requestBody)
    }

    @SuccessResponse(200, "OK")
    @Get("my")
    public async getMyApplications(
        @Request() request: AuthenticatedRequest
    ): Promise<ApplicationListDto[]> {
        this.setStatus(200)
        return this.applicationService.getMyApplications(request.currentUser)
    }
}