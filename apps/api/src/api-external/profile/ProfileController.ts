import {
  Body,
  Controller,
  Patch,
  Get,
  Route,
  SuccessResponse,
  Tags,
  Security,
  Request
} from "tsoa";
import { ProfileService } from './ProfileService';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware';
import { UpdateJobPreferencesRequest } from './UpdateJobPreferenceRequest';
import { UpdatePersonalInformationRequest } from './UpdatePersonalInformationRequest';

@Tags("Users")
@Route("users/me")
@Security("jwt")
export class ProfileController extends Controller {
  private readonly profileService = new ProfileService()

  @SuccessResponse("200","OK")
  @Get("profile")
  public async getMyProfile(
    @Request() request: AuthenticatedRequest
  ) {
    const userId = request.currentUser!.id;
    return this.profileService.getMyProfile(userId);
  }
  
  @SuccessResponse("200", "OK") // Maybe 201 Created?
  @Patch("profile")
  public async updatePersonalInformation(
    @Request() request: AuthenticatedRequest,
    @Body() requestBody: UpdatePersonalInformationRequest
  ) {
    const userId = request.currentUser!.id;
    return this.profileService.updatePersonalInformation(userId, requestBody);
  }

  @SuccessResponse("200", "OK")
  @Get("job-preference")
  public async getJobPreference(
    @Request() request: AuthenticatedRequest
  ) {
    const userId = request.currentUser!.id;
    return this.profileService.getJobPreference(userId);
  }

  @SuccessResponse("200", "OK")
  @Patch("job-preference")
  public async updateJobPreference(
    @Request() request: AuthenticatedRequest,
    @Body() requestBody: UpdateJobPreferencesRequest
  ) {
    const userId = request.currentUser!.id;
    return this.profileService.updateJobPreference(userId, requestBody);
  }
}