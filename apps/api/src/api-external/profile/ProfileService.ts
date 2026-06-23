
import { prisma } from '../../lib/prisma';
import { PasswordHasher } from '../../utils/PasswordHasher';
import { HttpError } from '../../utils/HttpError';

import { UpdateJobPreferencesRequest } from './UpdateJobPreferenceRequest';
import { UpdatePersonalInformationRequest } from './UpdatePersonalInformationRequest';
import { UpdatePersonalInformationResponse } from './UpdatePersonalInformationResponse';
import { UpdateJobPreferencesResponse } from './UpdateJobPreferenceResponse';
import { ChangePasswordResponse } from './ChangePasswordResponse';
import { ChangePasswordRequest } from './ChangePasswordRequest';

const passwordHasher = new PasswordHasher();

export class ProfileService {
    public async getMyProfile(userId: string) {
        const profile = await prisma.userProfile.findUnique({
            // 1. Find user by Id
            where: { userId },
            // 2. Only select fields that need to be displayed
            // Those field can be empty, as the user have yet to update them
            select: {
                fullName: true,
                headline: true,
                phoneNumber: true,
                city: true,
                summary: true,
                updatedAt: true,
            },
        });
        return {
            profile,
        };
    }

    public async updatePersonalInformation(
        userId: string,
        requestBody: UpdatePersonalInformationRequest
    ): Promise<UpdatePersonalInformationResponse> {
        // upsert is the equivalent of PATCH
        // where we can either: update if existed or create if not existed
        const profile = await prisma.userProfile.upsert({
            // 1. Find user by Id
            where: { userId },
            // 2.1. Update user profile if existed
            // As in, they have update their profile before/they have created their profile
            update: {
                fullName: requestBody.fullName,
                headline: requestBody.headline,
                phoneNumber: requestBody.phoneNumber,
                city: requestBody.city,
                summary: requestBody.summary,
            },
            // 2.2. Create user profile if not existed
            create: {
                userId,
                fullName: requestBody.fullName,
                headline: requestBody.headline,
                phoneNumber: requestBody.phoneNumber,
                city: requestBody.city,
                summary: requestBody.summary,
            },
            // Only update/create the field needed to be
            // Once again, normal user can't modify date/logs stuff 
            select: {
                fullName: true,
                headline: true,
                phoneNumber: true,
                city: true,
                summary: true,
                updatedAt: true,
            },
        });
        return {
            message: "Profile Updated Successfully",
            userProfile: profile,
        };
    }

    public async getJobPreference(userId: string) {
        const preference = await prisma.userJobPreference.findUnique({
            // Rinse and repeat
            where: { userId },
            select: {
                profileVisibility: true,
                jobSearchStatus: true,
                desiredJobTitle: true,
                preferredLocation: true,
            },
        });
        return {
            preference,
        };
    }

    public async updateJobPreference(
        userId: string,
        requestBody: UpdateJobPreferencesRequest
    ): Promise<UpdateJobPreferencesResponse> {
        const jobPreferences = await prisma.userJobPreference.upsert({
            where: { userId },
            
            // Some important stuff here
            // First, (undefined) -> The user may or may not sent field
            // Second, (null) -> The user can clear the field and sent
            // Third, Enum value or string -> The user set a value and sent field
            
            // For update, only include fields that are not undefined.
            update: {
                ...(requestBody.profileVisibility !== undefined && {
                    profileVisibility: requestBody.profileVisibility,
                }),
                ...(requestBody.jobSearchStatus !== undefined && {
                    jobSearchStatus: requestBody.jobSearchStatus,
                }),
                // If desiredJobTitle was undefined -> undefined === undefined -> skip field
                // If desiredJobTitle was null -> null !== undefined -> include field, set database value to null
                // If desiredJobTitle was string -> string !== undefined -> include field, set database value to that string
                ...(requestBody.desiredJobTitle !== undefined && {
                    desiredJobTitle: requestBody.desiredJobTitle,
                }),
                ...(requestBody.preferredLocation !== undefined && {
                    preferredLocation: requestBody.preferredLocation,
                }),
            },
            // FIX: No need to enforce double default unless necessary
            // The database have already provide default values
            create: {
                userId,
                ...(requestBody.profileVisibility !== undefined && {
                    profileVisibility: requestBody.profileVisibility,
                }),
                ...(requestBody.jobSearchStatus !== undefined && {
                    jobSearchStatus: requestBody.jobSearchStatus,
                }),
                ...(requestBody.desiredJobTitle !== undefined && {
                    desiredJobTitle: requestBody.desiredJobTitle,
                }),
                ...(requestBody.preferredLocation !== undefined && {
                    preferredLocation: requestBody.preferredLocation,
                }),
            },
            select: {
                profileVisibility: true,
                jobSearchStatus: true,
                desiredJobTitle: true,
                preferredLocation: true,
                updatedAt: true,
            },
        });
        return {
            message: "Job Preference Updated Successfully",
            userJobPreference: jobPreferences
        }
    }

    // I forgot to implement this LMAOOOOOOOO
    public async changePassword(
        userId: string,
        requestBody: ChangePasswordRequest
    ): Promise<ChangePasswordResponse> {
        // 1. Find user to get their current passwordHash
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                passwordHash: true,
            }
        });
        // 2. Check if the user is null (not found)
        if (!user) {
            throw new HttpError(404, "User not found")
        }
        // 3. Compare current password with stored passwordHash
        const isCurrentPasswordMatch = await passwordHasher.compare(
            requestBody.currentPassword,
            user.passwordHash
        );
        // 4. If current password doesn't match, reject password change
        if (!isCurrentPasswordMatch) {
            throw new HttpError(400, "Invalid current password");
        }
        // 5. Else, hash new password
        const newPasswordHash = await passwordHasher.hash(
            requestBody.newPassword
        );
        // 6. Update Prisma with new passwordHash
        await prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: newPasswordHash,
            },
        });
        return {
            message: "Password changed successfully",
        };
    }
}