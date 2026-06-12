import {
  Controller,
  Get,
  Queries,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import { JobDiscoveryService } from './JobDiscoveryService';

import { SearchJobsQuery } from './SearchJobsQuery';
import { SearchJobsResponse } from './SearchJobsResponse';

@Tags("Public", "Jobs")
@Route("jobs")
export class JobDiscoveryController extends Controller {
    @SuccessResponse("200", "OK")
    @Get()
    public async searchJobs(
        @Queries() query: SearchJobsQuery
    ): Promise<SearchJobsResponse> {
        return new JobDiscoveryService().searchJobs(query);
    }
}