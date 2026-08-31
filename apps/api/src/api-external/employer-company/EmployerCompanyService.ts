import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/HttpError';

import { CurrentUser } from '../../security/CurrentAuthenticatedUser';
import { assertEmployer } from '../../api-shared/guard/AssertRole';

import { CreateCompanyRequest } from './CreateCompanyRequest';
import { UpdateCompanyRequest } from './UpdateCompanyRequest';
import { CompanyResponse } from './CompanyResponse';

export class EmployerCompanyService {
    public async getCompany(
        currentUser: CurrentUser
    ): Promise<CompanyResponse> {
        // 1. Check whether user is an Employer
        assertEmployer(currentUser);

        // 2. Check whether the Employer has a company
        const company = await prisma.company.findUnique({
            where: {
                ownerEmployerId: currentUser.id
            },
            select: {
                id: true,
                name: true,
                city: true,
                district: true,
                description: true,
                createdAt: true,
            }
        });

        // If the Employer doesn't have a company
        if (!company) {
            throw new HttpError(404, "You haven't created a company");
        }

        return {
            companyId: company.id,
            name: company.name,
            city: company.city,
            district: company.district || undefined,
            description: company.description,
            createdAt: company.createdAt
        }
    }


    public async createCompany(
        currentUser: CurrentUser, 
        requestBody: CreateCompanyRequest
    ): Promise<CompanyResponse> {
        // 1. Check whether user is an Employer
        assertEmployer(currentUser);

        // 2. Check whether the Employer already has a company
        const company = await prisma.company.findUnique({
            where: {
                ownerEmployerId: currentUser.id,
            },
            select: {
                id: true,
            }
        });

        // If the Employer already has a company, reject their request
        if (company) {
            throw new HttpError(409, "You have already created a company.");
        }

        // If the Employer doesn't have a company, create one
        const createdCompany = await prisma.company.create({
            data: {
                ownerEmployerId: currentUser.id,
                name: requestBody.name,
                city: requestBody.city,
                district: requestBody.district,
                description: requestBody.description,
            },
            select: {
                id: true,
                name: true,
                city: true,
                district: true,
                description: true,
                createdAt: true
            }
        });

        return {
            companyId: createdCompany.id,
            name: createdCompany.name,
            city: createdCompany.city,
            district: createdCompany.district || undefined,
            description: createdCompany.description,
            createdAt: createdCompany.createdAt
        }
    }

    public async updateCompany(
        currentUser: CurrentUser,
        requestBody: UpdateCompanyRequest
    ): Promise<CompanyResponse> {
        // 1. Check whether user is an Employer
        assertEmployer(currentUser);

        // 2. Check whether the Employer already has a company
        const company = await prisma.company.findUnique({
            where: {
                ownerEmployerId: currentUser.id,
            }
        });

        // If the Employer doesn't have a company, reject their request
        if (!company) {
            throw new HttpError(404, "You haven't created a company");
        }

        // 3. Update the company
        const updatedCompany = await prisma.company.update({
            where: {
                ownerEmployerId: currentUser.id,
            },
            data: {
                name: requestBody.name,
                city: requestBody.city,
                district: requestBody.district,
                description: requestBody.description,
            },
            select: {
                id: true,
                name: true,
                city: true,
                district: true,
                description: true,
                createdAt: true
            }
        });

        return {
            companyId: updatedCompany.id,
            name: updatedCompany.name,
            city: updatedCompany.city,
            district: updatedCompany.district || undefined,
            description: updatedCompany.description,
            createdAt: updatedCompany.createdAt
        }
    }
}