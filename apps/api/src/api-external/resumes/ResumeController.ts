import { 
    Controller,
    Get,
    Post,
    Request,
    Route,
    Tags,
    SuccessResponse,
    Security,
    FormField,
    UploadedFile,
    Delete,
    Path,
} from 'tsoa';
import { Request as ExpressRequest } from 'express';

import { ResumeService } from './ResumeService';
import { CurrentUser } from '../../security/CurrentAuthenticatedUser';
import { UploadResumeResponse } from './UploadResumeResponse';
import { GetMyResumeResponse } from './GetMyResumesResponse';

interface AuthenticatedRequest extends ExpressRequest {
    currentUser: CurrentUser;
}

@Tags("Users")
@Route("users/me/resumes")
@Security("jwt")
export class ResumeController extends Controller {
    private readonly resumeService = new ResumeService();

    @Get()
    public async getMyResumes(
        @Request() request: AuthenticatedRequest
    ): Promise<GetMyResumeResponse> {
        const userId = request.currentUser.id;
        return this.resumeService.getMyResumes(userId);
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async uploadResume(
        @Request() request: AuthenticatedRequest,
        @FormField() title: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<UploadResumeResponse> {
        const userId = request.currentUser.id;
        // Some note here if I'm stupid (I am)
        // setStatus here is a method of ResumeController (inherited from tsoa's Controller)
        // by default, if we don't call setStatus, every endpoint will return a 200 OK
        // by typing explicitly as follow, we ensure that when uploadResume method is called
        // a 201 Created is returned
        // Now I might ask, why don't we do this in ResumeService? We have HttpError there
        // The Service layer should only be responsible for business logic (Validation, database operations, etc.)
        // While the Controller layer is responsible for HTTP request and response (which include Status codes and route handling)
        this.setStatus(201);
        return this.resumeService.uploadResume(userId, title, file);
    }

    @SuccessResponse("200", "OK")
    @Delete("{resumeId}")
    public async deleteResume(
        @Request() request: AuthenticatedRequest,
        @Path() resumeId: string
    ) {
        const userId = request.currentUser.id;
        return this.resumeService.deleteResume(userId, resumeId)
    }
}
