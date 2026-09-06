import { EmploymentType } from '../../api-shared/type/EmploymentType';

export interface JobListItemDto {
    id: string;
    title: string;
    description?: string;
    employmentType: EmploymentType;
    location: string;
}