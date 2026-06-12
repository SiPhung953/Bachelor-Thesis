import { CompanyProfileDto } from "./CompanyProfileDto";
import { CompanyJobListItemDto } from "./CompanyJobListItemDto";

export interface CompanyProfileResponse {
    company: CompanyProfileDto;
    jobs: CompanyJobListItemDto[];
}