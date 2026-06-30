import { Badge } from "@/ui-shared/components/ui/badge"

export type ApplicationStatus = "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export default function ApplicationStatusBadge({ status, className = "" }: ApplicationStatusBadgeProps) {
  const getStyles = (status: ApplicationStatus) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-500/10 border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
      case "UNDER_REVIEW":
        return "bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
      case "ACCEPTED":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
      case "REJECTED":
        return "bg-red-500/10 border-red-500/30 text-red-600 hover:bg-red-500/10"
      case "WITHDRAWN":
        return "bg-gray-500/10 border-gray-500/30 text-gray-500 hover:bg-gray-500/10"
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-600 hover:bg-gray-500/10"
    }
  }

  const getLabel = (status: ApplicationStatus) => {
    switch (status) {
      case "SUBMITTED":
        return "Submitted"
      case "UNDER_REVIEW":
        return "Under Review"
      case "ACCEPTED":
        return "Accepted"
      case "REJECTED":
        return "Rejected"
      case "WITHDRAWN":
        return "Withdrawn"
      default:
        return status
    }
  }

  return (
    <Badge 
      className={`border rounded-none text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 shadow-none ${getStyles(status)} ${className}`}
    >
      {getLabel(status)}
    </Badge>
  )
}
