import { MyJobListItemDto } from './MyJobListItemDto';

export interface GetMyJobResponse {
    hasCompany: boolean;
    companyId?: string;
    items: MyJobListItemDto[];
}