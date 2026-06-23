export interface CompanyProfileDto {
    id: string;
    name: string;
    city: string;
    district?: string | null;
    description: string;
}