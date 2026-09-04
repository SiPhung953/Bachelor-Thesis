import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "@phosphor-icons/react"
import Header from "@/ui-external/landing/components/Header"
import Footer from "@/ui-external/landing/components/Footer"
import { Card, CardContent } from "@/ui-shared/components/ui/card"
import ErrorAlert from "@/ui-shared/components/ErrorAlert"
import { createJobPosting } from "@/client"
import JobPostingForm, {
  EMPTY_JOB_FORM,
  type JobPostingFormValues,
} from "./components/JobPostingForm"
import { toDeadlineIso, earliestDeadline } from "./deadline"

export default function PostJobPage() {
  const navigate = useNavigate()

  const [values, setValues] = useState<JobPostingFormValues>(EMPTY_JOB_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof JobPostingFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await createJobPosting({
        body: {
          title: values.title.trim(),
          description: values.description.trim(),
          requirement: values.requirement.trim(),
          location: values.location.trim(),
          employmentType: values.employmentType,
          deadline: toDeadlineIso(values.deadline),
        },
        throwOnError: true,
      })

      // The new posting starts as PENDING_APPROVAL, so send the employer back
      // to the list where they can see it waiting for moderation.
      navigate("/employer/jobs")
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to publish the job posting. Please try again."
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-brand/20 selection:text-brand flex flex-col">
      <Header />

      <main className="flex-1 bg-secondary/35 py-10">
        <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/employer/jobs")}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-brand"
          >
            <ArrowLeft size={13} weight="bold" />
            Back to My Job Postings
          </button>

          <div className="space-y-1.5">
            <h1 className="text-xl font-black uppercase tracking-tight text-foreground md:text-2xl">
              Post a Job
            </h1>
            <p className="text-xs text-muted-foreground">
              Your posting will be reviewed by a Moderator before it appears publicly.
            </p>
          </div>

          {error && <ErrorAlert title="Could Not Publish" message={error} />}

          <Card className="border border-foreground/10 bg-card shadow-sm">
            <CardContent className="p-6">
              <JobPostingForm
                values={values}
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Publish Job Posting"
                minDeadline={earliestDeadline()}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
