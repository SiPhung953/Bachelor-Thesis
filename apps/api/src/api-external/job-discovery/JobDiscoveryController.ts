import {
  Controller,
  Get,
  Queries,
  Route,
  SuccessResponse,
  Tags,
  Path,
} from "tsoa";
import { JobDiscoveryService } from './JobDiscoveryService';

import { SearchJobsQuery } from './SearchJobsQuery';
import { SearchJobsResponse } from './SearchJobsResponse';
import { GetJobDetailResponse } from './GetJobDetailResponse';

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

    @SuccessResponse("200", "OK")
    @Get("{jobId}")
    public async getJobDetail(
        @Path() jobId: string,
    ): Promise<GetJobDetailResponse> {
        return new JobDiscoveryService().getJobDetail(jobId);
    }
}