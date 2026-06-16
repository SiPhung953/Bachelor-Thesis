import { CompanyProfileDto } from '../../companies/CompanyProfileDto';
import { CompanyJobListItemDto } from '../../companies/CompanyJobListItemDto';

export interface CompanyProfileResponse {
    company: CompanyProfileDto;
    jobs: CompanyJobListItemDto[];
}