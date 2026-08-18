import {
    Body,
    Controller,
    Post,
    Route,
    Request,
    Security,
    SuccessResponse,
    Tags,
    Patch,
    Get,
} from "tsoa";
import { Request as ExpressRequest } from 'express';

import { EmployerCompanyService } from './EmployerCompanyService';

import { CurrentUser } from '../../security/CurrentAuthenticatedUser';
import { CreateCompanyRequest } from './CreateCompanyRequest';
import { UpdateCompanyRequest } from './UpdateCompanyRequest';
import { CompanyResponse } from './CompanyResponse';

interface AuthenticatedRequest extends ExpressRequest {
  currentUser: CurrentUser;
}

@Tags("Companies", "Employer")
@Route("employer/company")
@Security("jwt", ["EMPLOYER"])
export class EmployerCompanyController extends Controller {
    private readonly employerCompanyService = new EmployerCompanyService()

    @SuccessResponse(200, "OK")
    @Get()
    public async getCompany(
        @Request() request: AuthenticatedRequest
    ): Promise<CompanyResponse> {
        this.setStatus(200)
        return this.employerCompanyService.getCompany(request.currentUser);
    }
    
    @SuccessResponse(201, "Created")
    @Post()
    public async createCompany(
        @Request() request: AuthenticatedRequest,
        @Body() requestBody: CreateCompanyRequest,
    ): Promise<CompanyResponse> {
        this.setStatus(201)
        return this.employerCompanyService.createCompany(request.currentUser, requestBody);
    }

    @SuccessResponse(200, "OK")
    @Patch()
    public async updateCompany(
        @Request() request: AuthenticatedRequest,
        @Body() requestBody: UpdateCompanyRequest
    ): Promise<CompanyResponse> {
        this.setStatus(200)
        return this.employerCompanyService.updateCompany(request.currentUser, requestBody);
    }
}