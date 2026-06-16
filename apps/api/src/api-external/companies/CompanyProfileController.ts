import {
  Controller,
  Get,
  Path,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import { CompanyProfileService } from './CompanyProfileService';
import { CompanyProfileResponse } from "./CompanyProfileResponse";

@Tags("Public", "Companies")
@Route("companies")
export class CompanyProfileController extends Controller {
    @SuccessResponse("200", "OK")
    @Get("{companyId}")
    public async getCompanyProfile(
        @Path() companyId: string
    ): Promise<CompanyProfileResponse> {
        return new CompanyProfileService().getCompanyProfile(companyId);
    }
}