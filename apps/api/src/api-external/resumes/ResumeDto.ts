export interface ResumeDto {
    id: string;
    title: string;
    fileUrl: string;
    fileType: "PDF" | "DOC" | "DOCX";
    fileSize: number;
    uploadedAt: Date;
}