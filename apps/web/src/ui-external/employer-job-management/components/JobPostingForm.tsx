import { Input } from "@/ui-shared/components/ui/input"
import { Textarea } from "@/ui-shared/components/ui/textarea"
import { Label } from "@/ui-shared/components/ui/label"
import { Button } from "@/ui-shared/components/ui/button"

export type EmploymentType = "ON_SITE" | "REMOTE" | "HYBRID"

export interface JobPostingFormValues {
  title: string
  description: string
  requirement: string
  location: string
  employmentType: EmploymentType
  /** `<input type="date">` value, i.e. "YYYY-MM-DD". */
  deadline: string
}

export const EMPTY_JOB_FORM: JobPostingFormValues = {
  title: "",
  description: "",
  requirement: "",
  location: "",
  employmentType: "ON_SITE",
  deadline: "",
}

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "ON_SITE", label: "On Site" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
]

const FIELD_CLASS =
  "h-11 rounded-none border-foreground/10 bg-transparent px-4 text-xs placeholder:text-muted-foreground/60 focus-visible:ring-brand/30"

const TEXTAREA_CLASS =
  "resize-y border-foreground/10 px-4 py-3 leading-relaxed placeholder:text-muted-foreground/60 focus-visible:ring-brand/30"

const LABEL_CLASS =
  "text-[11px] font-bold uppercase tracking-wider text-foreground"

interface JobPostingFormProps {
  values: JobPostingFormValues
  onChange: (field: keyof JobPostingFormValues, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  submitting: boolean
  submitLabel: string
  /** Earliest date the deadline picker will accept, as "YYYY-MM-DD". */
  minDeadline: string
}

/**
 * The shared create/edit form for a job posting. It owns no state — the page
 * above passes `values` down and receives edits through `onChange`, so the same
 * form serves both "Post a Job" and "Edit Job Posting".
 */
export default function JobPostingForm({
  values,
  onChange,
  onSubmit,
  submitting,
  submitLabel,
  minDeadline,
}: JobPostingFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title" className={LABEL_CLASS}>
          Job Title
        </Label>
        <Input
          id="title"
          value={values.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="e.g. Junior Backend Engineer"
          maxLength={255}
          required
          className={FIELD_CLASS}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location" className={LABEL_CLASS}>
            Location
          </Label>
          <Input
            id="location"
            value={values.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="e.g. Ho Chi Minh City"
            maxLength={255}
            required
            className={FIELD_CLASS}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline" className={LABEL_CLASS}>
            Application Deadline
          </Label>
          <Input
            id="deadline"
            type="date"
            value={values.deadline}
            onChange={(e) => onChange("deadline", e.target.value)}
            min={minDeadline}
            required
            className={FIELD_CLASS}
          />
        </div>
      </div>

      {/* Employment type — a segmented control instead of a <select>, since
          shadcn's Select component is not installed and DESIGN.md forbids
          adding packages. */}
      <div className="space-y-2">
        <span className={LABEL_CLASS}>Employment Type</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Employment type">
          {EMPLOYMENT_TYPES.map((option) => {
            const selected = values.employmentType === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange("employmentType", option.value)}
                className={`h-10 border px-5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  selected
                    ? "border-brand bg-brand text-white"
                    : "border-foreground/10 bg-transparent text-muted-foreground hover:border-brand/40 hover:text-brand"
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className={LABEL_CLASS}>
          Job Description
        </Label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe the role, the team, and what the candidate will work on."
          rows={8}
          maxLength={10000}
          required
          className={TEXTAREA_CLASS}
        />
        <p className="text-right text-[10px] text-muted-foreground">
          {values.description.length} / 10000
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirement" className={LABEL_CLASS}>
          Candidate Requirements
        </Label>
        <Textarea
          id="requirement"
          value={values.requirement}
          onChange={(e) => onChange("requirement", e.target.value)}
          placeholder="List the skills, experience, and qualifications you expect."
          rows={8}
          maxLength={10000}
          required
          className={TEXTAREA_CLASS}
        />
        <p className="text-right text-[10px] text-muted-foreground">
          {values.requirement.length} / 10000
        </p>
      </div>

      <div className="flex justify-end border-t border-foreground/10 pt-5">
        <Button
          type="submit"
          disabled={submitting}
          className="h-10 rounded-none bg-brand px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand/90"
        >
          {submitting ? "Submitting…" : submitLabel}
        </Button>
      </div>
    </form>
  )
}
