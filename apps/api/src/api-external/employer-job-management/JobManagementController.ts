import {
    Controller,
    Route,
    Security,
    SuccessResponse,
    Tags,
    Get,
    Request,
    Post,
    Body,
    Patch,
    Path
} from "tsoa";

import { Request as ExpressRequest } from 'express';

import { JobManagementService } from './JobManagementService';

import { CurrentUser } from '../../security/CurrentAuthenticatedUser';
import { GetMyJobsResponse } from './GetMyJobsResponse';
import { GetMyJobDetailResponse } from './GetMyJobDetailResponse';
import { CreateJobPostingRequest } from './CreateJobPostingRequest';
import { CreateJobPostingResponse } from './CreateJobPostingResponse';
import { UpdateJobPostingRequest } from './UpdateJobPostingRequest';
import { UpdateJobPostingResponse } from './UpdateJobPostingResponse';
import { CloseJobPostingResponse } from './CloseJobPostingResponse';
import { ReopenJobPostingResponse } from './ReopenJobPostingResponse';
import { DeleteJobPostingResponse } from './DeleteJobPostingResponse';

interface AuthenticatedRequest extends ExpressRequest {
    currentUser: CurrentUser;
}

@Tags("Employer", "Jobs")
@Route("employer/jobs")
@Security("jwt", ["EMPLOYER"])
export class JobManagementController extends Controller {
    private readonly jobManagementService = new JobManagementService()

    @SuccessResponse(200, "OK")
    @Get()
    public async getMyJobs(
        @Request() request: AuthenticatedRequest
    ): Promise<GetMyJobsResponse[]> {
        this.setStatus(200);
        return this.jobManagementService.getMyJobs(request.currentUser);
    }

    @SuccessResponse(200, "OK")
    @Get("{jobId}")
    public async getMyJobDetail(
        @Request() request: AuthenticatedRequest,
        @Path("jobId") jobId: string,
    ): Promise<GetMyJobDetailResponse> {
        this.setStatus(200);
        return this.jobManagementService.getMyJobDetail(request.currentUser, jobId);
    }

    @SuccessResponse(201, "Created")
    @Post()
    public async createJobPosting(
        @Request() request: AuthenticatedRequest,
        @Body() requestBody: CreateJobPostingRequest
    ): Promise<CreateJobPostingResponse> {
        this.setStatus(201);
        return this.jobManagementService.createJobPosting(request.currentUser, requestBody);
    }

    @SuccessResponse(200, "OK")
    @Patch("{jobId}")
    public async updateJobPosting(
        @Request() request: AuthenticatedRequest,
        @Path("jobId") jobId: string,
        @Body() requestBody: UpdateJobPostingRequest
    ): Promise<UpdateJobPostingResponse> {
        this.setStatus(200);
        return this.jobManagementService.updateJobPosting(request.currentUser, jobId, requestBody);
    }

    @SuccessResponse(200, "OK")
    @Patch("{jobId}/close")
    public async closeJobPosting(
        @Request() request: AuthenticatedRequest,
        @Path("jobId") jobId: string
    ): Promise<CloseJobPostingResponse> {
        this.setStatus(200);
        return this.jobManagementService.closeJobPosting(request.currentUser, jobId);
    }

    @SuccessResponse(200, "OK")
    @Patch("{jobId}/reopen")
    public async reopenJobPosting(
        @Request() request: AuthenticatedRequest,
        @Path("jobId") jobId: string
    ): Promise<ReopenJobPostingResponse> {
        this.setStatus(200);
        return this.jobManagementService.reopenJobPosting(request.currentUser, jobId);
    }

    @SuccessResponse(200, "OK")
    @Patch("{jobId}/delete")
    public async deleteJobPosting(
        @Request() request: AuthenticatedRequest,
        @Path("jobId") jobId: string
    ): Promise<DeleteJobPostingResponse> {
        this.setStatus(200);
        return this.jobManagementService.deleteJobPosting(request.currentUser, jobId);
    }
}
