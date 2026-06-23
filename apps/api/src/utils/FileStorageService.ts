import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export class FileStorageService {
    /**
     * Saves a CV file to the uploads/resumes directory.
     * @param file The uploaded CV file.
     * @returns The relative URL of the saved file.
     */
    public async saveCv(file: Express.Multer.File): Promise<string> {
        const uploadDir = path.resolve("uploads/resumes");
        await fs.mkdir(uploadDir, { recursive: true });

        // Generate unique file name and store its path
        const storedFileName = `${randomUUID()}-${file.originalname}`;
        const storedFilePath = path.join(uploadDir, storedFileName);

        // Write the file to the file system
        await fs.writeFile(storedFilePath, file.buffer);

        // Return the file path as a URL
        return `/upload/resumes/${storedFileName}`;
    }

    /**
     * Deletes a file from the disk based on its file URL.
     * @param fileUrl The URL of the file to delete (e.g. /upload/resumes/filename).
     */
    public async deleteFile(fileUrl: string): Promise<void> {
        if (!fileUrl) {
            return;
        }

        // Map URL back to file path
        // For example, if fileUrl is /upload/resumes/xxx or /upload/avatars/xxx
        // We map the prefix "/upload/" to "uploads/" relative to root directory.
        let relativePath = fileUrl;
        if (fileUrl.startsWith('/upload/')) {
            relativePath = fileUrl.replace(/^\/upload\//, 'uploads/');
        } else if (fileUrl.startsWith('/uploads/')) {
            relativePath = fileUrl.replace(/^\/uploads\//, 'uploads/');
        } else if (fileUrl.startsWith('upload/')) {
            relativePath = fileUrl.replace(/^upload\//, 'uploads/');
        } else if (fileUrl.startsWith('uploads/')) {
            relativePath = fileUrl;
        } else {
            // If it doesn't match any known upload prefix, don't attempt to delete to avoid security issues
            return;
        }

        const absolutePath = path.resolve(relativePath);

        try {
            // Check if file exists before trying to delete it
            await fs.access(absolutePath);
            await fs.unlink(absolutePath);
        } catch (error: any) {
            // If file doesn't exist, we don't need to throw an error
            // Otherwise, we log it or handle it as appropriate.
            console.error(`Failed to delete file at ${absolutePath}:`, error.message);
        }
    }
}
