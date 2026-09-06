import { EmploymentType } from '../../api-shared/type/EmploymentType';

export interface JobPostingBody {
    title: string;
    description: string;
    requirement: string;
    employmentType: EmploymentType;
    location: string;
    deadline: Date;
}