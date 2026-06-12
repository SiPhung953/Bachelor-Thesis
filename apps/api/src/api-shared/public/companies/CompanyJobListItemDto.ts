import { EmploymentType } from "../../../generated/prisma/enums";

export interface CompanyJobListItemDto {
    id: string;
    title: string;
    employmentType: EmploymentType;
    location: string;
}