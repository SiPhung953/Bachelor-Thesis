export interface CompanyResponse {
    companyId: string;
    name: string;
    city: string;
    district?: string;
    description: string;
    createdAt: Date;
}