import {
    Controller,
    Request,
    Route,
    Security,
    SuccessResponse,
    Tags,
    Path,
    Patch,
    Get,
    Body
} from "tsoa";

import { Request as ExpressRequest } from 'express';

import { EmployerApplicationService } from './EmployerApplicationService';

import { CurrentUser } from '../../security/CurrentAuthenticatedUser';
import { EmployerApplicationListResponse } from './EmployerApplicationListResponse';
import { EmployerApplicationResponse } from './EmployerApplicationResponse';
import { PutApplicationUnderReviewResponse } from './PutApplicationUnderReviewResponse';
import { UpdateApplicationStatusRequest } from './UpdateApplicationStatusRequest';
import { UpdateApplicationStatusResponse } from './UpdateApplicationStatusResponse';

interface AuthenticatedRequest extends ExpressRequest {
    currentUser: CurrentUser;
}

@Tags("Employer", "Applications")
@Route("employer")
@Security("jwt", ["EMPLOYER"])
export class EmployerApplicationController extends Controller {
    private readonly employerApplicationService = new EmployerApplicationService()

    @SuccessResponse(200, "OK")
    @Get("jobs/{jobId}/applications")
    public async getJobApplications(
        @Request() request: AuthenticatedRequest,
        @Path("jobId") jobId: string
    ): Promise<EmployerApplicationListResponse> {
        this.setStatus(200);
        return this.employerApplicationService.getJobApplications(request.currentUser, jobId);
    }

    @SuccessResponse(200, "OK")
    @Get("applications/{applicationId}")
    public async getJobApplicationDetail(
        @Request() request: AuthenticatedRequest,
        @Path("applicationId") applicationId: string
    ): Promise<EmployerApplicationResponse> {
        this.setStatus(200);
        return this.employerApplicationService.getJobApplicationDetail(request.currentUser, applicationId);
    }

    @SuccessResponse(200, "OK")
    @Patch("applications/{applicationId}/under-review")
    public async putApplicationUnderReview(
        @Request() request: AuthenticatedRequest,
        @Path("applicationId") applicationId: string
    ): Promise<PutApplicationUnderReviewResponse> {
        this.setStatus(200);
        return this.employerApplicationService.putApplicationUnderReview(request.currentUser, applicationId);
    }

    @SuccessResponse(200, "OK")
    @Patch("applications/{applicationId}/status")
    public async updateApplicationStatus(
        @Request() request: AuthenticatedRequest,
        @Path("applicationId") applicationId: string,
        @Body() requestBody: UpdateApplicationStatusRequest
    ): Promise<UpdateApplicationStatusResponse> {
        this.setStatus(200);
        return this.employerApplicationService.updateApplicationStatus(request.currentUser, applicationId, requestBody)
    }
}