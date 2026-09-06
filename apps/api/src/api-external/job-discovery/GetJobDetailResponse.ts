import { EmploymentType } from '../../api-shared/type/EmploymentType';

export interface GetJobDetailResponse {
    id: string;
    title: string;
    description: string;
    location: string;
    employmentType: EmploymentType;

    company: {
        id: string;
        name: string;
    };
}