import type { ResumeDto } from "@/client/types.gen"
import { FilePdf, CalendarBlank } from "@phosphor-icons/react"

interface ResumeSelectorProps {
  resumes: ResumeDto[]
  selectedId: string | null
  onChange: (id: string) => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function ResumeSelector({ resumes, selectedId, onChange }: ResumeSelectorProps) {
  return (
    <div className="space-y-3">
      {resumes.map((resume) => {
        const isSelected = selectedId === resume.id

        return (
          <div
            key={resume.id}
            onClick={() => onChange(resume.id)}
            className={`flex items-center justify-between border p-4 cursor-pointer transition-all duration-200 select-none ${
              isSelected
                ? "border-brand bg-brand/5 ring-1 ring-brand/20"
                : "border-foreground/10 hover:border-foreground/20 bg-card hover:bg-secondary/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center shrink-0 ${
                isSelected ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground"
              }`}>
                <FilePdf size={20} weight={isSelected ? "fill" : "regular"} />
              </div>
              <div className="space-y-1">
                <h5 className={`text-xs font-bold uppercase tracking-wide transition-colors ${
                  isSelected ? "text-brand" : "text-foreground"
                }`}>
                  {resume.title}
                </h5>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                  <CalendarBlank size={12} />
                  <span>Uploaded on {formatDate(resume.uploadedAt)}</span>
                </div>
              </div>
            </div>

            {/* Radio indicator */}
            <div className="flex items-center justify-center size-5 border border-foreground/15 rounded-full overflow-hidden shrink-0 bg-background">
              {isSelected && (
                <div className="size-3 bg-brand rounded-full" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
