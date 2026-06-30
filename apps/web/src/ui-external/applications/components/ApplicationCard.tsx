import { Link } from "react-router-dom"
import type { ApplicationListDto } from "@/client/types.gen"
import ApplicationStatusBadge from "./ApplicationStatusBadge"
import { Button } from "@/ui-shared/components/ui/button"
import { CalendarBlank, Buildings, ArrowUpRight } from "@phosphor-icons/react"

interface ApplicationCardProps {
  application: ApplicationListDto
  onWithdraw: (applicationId: string) => void
}

function formatDate(dateInput: string | Date): string {
  try {
    const date = new Date(dateInput)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return String(dateInput)
  }
}

export default function ApplicationCard({ application, onWithdraw }: ApplicationCardProps) {
  const isWithdrawEligible = application.status === "SUBMITTED"

  return (
    <div className="border border-foreground/10 bg-card p-5 md:p-6 shadow-sm hover:shadow transition-all duration-300 relative overflow-hidden">
      {/* Accent corner */}
      <div className="absolute top-0 left-0 w-1 h-full bg-foreground/10" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left Side: Job Info */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wide text-foreground">
              {application.jobTitle}
            </h4>
            <ApplicationStatusBadge status={application.status as any} />
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium">
            <span className="text-brand flex items-center gap-1">
              <Buildings size={14} />
              {application.companyName}
            </span>
            <span className="text-muted-foreground/30 font-bold">&middot;</span>
            <span className="text-muted-foreground flex items-center gap-1">
              <CalendarBlank size={14} />
              <span>Applied on {formatDate(application.appliedAt)}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          {/* Link to Job details page */}
          <Link to={`/jobs/${application.jobId}`}>
            <Button
              variant="outline"
              className="h-9 px-4 text-xs font-bold uppercase tracking-wider border-foreground/20 hover:border-brand hover:text-brand transition-colors flex items-center gap-1.5"
            >
              <span>View Job</span>
              <ArrowUpRight size={13} weight="bold" />
            </Button>
          </Link>

          {/* Withdraw Button */}
          {isWithdrawEligible ? (
            <Button
              onClick={() => onWithdraw(application.applicationId)}
              className="h-9 px-4 text-xs font-bold uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/25 hover:bg-destructive hover:text-white hover:border-none transition-colors cursor-pointer"
            >
              Withdraw
            </Button>
          ) : (
            application.status === "WITHDRAWN" && (
              <Button
                disabled
                className="h-9 px-4 text-xs font-bold uppercase tracking-wider bg-foreground/5 text-muted-foreground/50 border border-foreground/10"
              >
                Withdrawn
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
