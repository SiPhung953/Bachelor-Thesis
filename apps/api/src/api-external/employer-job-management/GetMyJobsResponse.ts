import { MyJobListItemDto } from './MyJobListItemDto';

export interface GetMyJobsResponse {
    hasCompany: boolean;
    companyId?: string;
    items: MyJobListItemDto[];
}