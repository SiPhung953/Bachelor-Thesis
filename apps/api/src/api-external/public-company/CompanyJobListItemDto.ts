import { EmploymentType } from '../../api-shared/type/EmploymentType';

export interface CompanyJobListItemDto {
    id: string;
    title: string;
    employmentType: EmploymentType;
    location: string;
}