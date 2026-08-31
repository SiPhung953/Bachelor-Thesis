import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/HttpError';
import { FileStorageService } from '../../utils/FileStorageService';
import { CurrentUser } from '../../security/CurrentAuthenticatedUser';
import { assertJobSeeker } from '../../api-shared/guard/AssertRole';

import { UploadResumeResponse } from './UploadResumeResponse';
import { GetMyResumeResponse } from './GetMyResumesResponse';

const MAX_FILE_SIZE = 5 * 1024 * 1024

const MIME_TO_FILE_TYPE = {
    "application/pdf": "PDF",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX"
} as const;

type MimeFileType = keyof typeof MIME_TO_FILE_TYPE;

function isAllowedMimeType(mimeType: string): mimeType is MimeFileType {
    return mimeType in MIME_TO_FILE_TYPE;
}

export class ResumeService {
    private readonly fileStorageService = new FileStorageService();

    public async getMyResumes(currentUser: CurrentUser): Promise<GetMyResumeResponse> {
        // 1. Assert current user is a job seeker
        assertJobSeeker(currentUser);

        // 2. Find and return resumes list
        const resumes = await prisma.resume.findMany({
            where: {
                // 2.1 Find resumes associated with userId that are not deleted
                userId: currentUser.id,
                deletedAt: null,
            },
            orderBy: {
                // 2.2 Order from newest to oldest
                uploadedAt: "desc",
            },
            select: {
                // 2.3 Return only needed fields
                id: true,
                title: true,
                fileUrl: true,
                fileType: true,
                fileSize: true,
                uploadedAt: true,
            },
        });

        return { resumes };
    }

    public async uploadResume(
        currentUser: CurrentUser,
        resumeTitle: string,
        resumeFile: Express.Multer.File
    ): Promise<UploadResumeResponse> {
        // 1. Assert current user is a job seeker
        assertJobSeeker(currentUser);

        // 2. Check whether the user: 
        // Named their CV
        if (!resumeTitle || resumeTitle.trim().length === 0) {
            throw new HttpError(400, "CV title is required");
        }
        // Uploaded their CV
        if (!resumeFile) {
            throw new HttpError(400, "CV file is required");
        }
        // Uploaded file within the size limit
        if (resumeFile.size > MAX_FILE_SIZE) {
            throw new HttpError(400, "CV file must not exceed 5MB");
        }
        // Uploaded correct CV file type
        if (!isAllowedMimeType(resumeFile.mimetype)) {
            throw new HttpError(400, "Only PDF, DOC and DOCX files are supported");
        }

        // 3. Configuration for local file storing
        const fileType = MIME_TO_FILE_TYPE[resumeFile.mimetype];

        // Save the file using FileStorageService
        const fileUrl = await this.fileStorageService.saveCv(resumeFile);
        
        // Create resume in the database
        const resume = await prisma.resume.create({
            data: {
                userId: currentUser.id,
                title: resumeTitle.trim(),
                fileUrl,
                fileSize: resumeFile.size,
                fileType,
            },
            select: {
                id: true,
                title: true,
                fileUrl: true,
                fileType: true,
                fileSize: true,
                uploadedAt: true,
            },
        });

        return {
            message: "CV uploaded successfully",
            resume: resume,
        };
    }

    public async deleteResume(
        currentUser: CurrentUser,
        resumeId: string
    ) {
        assertJobSeeker(currentUser);

        const resume = await prisma.resume.findUnique({
            where: { id: resumeId },
            select: {
                id: true,
                userId: true,
                deletedAt: true,
                fileUrl: true,
                applications: {
                    select: {
                        id: true,
                    },
                    take: 1,
                },
            },
        });

        if (!resume || resume.deletedAt) {
            throw new HttpError(404, "CV not found");
        }

        if (resume.userId !== currentUser.id) {
            throw new HttpError(403, "You cannot delete another user's CV");
        }
        // If the resume is already used in an application, prevent hard delete
        const isUsedInApplication = resume.applications.length > 0;
        
        // but instead mark it as deleted (soft delete)
        if (isUsedInApplication) {
            await prisma.resume.update({
                where: { id: resumeId },
                data: {
                    deletedAt: new Date(),
                },
            });

            return {
                message: "CV is used in applications and has been hidden from your CV list",
            }
        }
            
        // else, hard delete the CV
        await prisma.resume.delete({
            where: { id: resumeId },
        });

        // Delete the file from local storage
        await this.fileStorageService.deleteFile(resume.fileUrl);

        return {
                message: "CV deleted successfully"
            };
    }
}