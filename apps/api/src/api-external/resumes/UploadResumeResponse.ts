import { ResumeDto } from './ResumeDto';

export interface UploadResumeResponse {
    message: string;
    resume: ResumeDto;
}