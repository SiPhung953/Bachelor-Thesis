import { Badge } from "@/ui-shared/components/ui/badge"

export type JobStatus =
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "REJECTED"
  | "CLOSED"
  | "EXPIRED"
  | "DELETED"

interface JobStatusBadgeProps {
  status: JobStatus
  className?: string
}

export default function JobStatusBadge({ status, className = "" }: JobStatusBadgeProps) {
  const getStyles = (status: JobStatus) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return "bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
      case "ACTIVE":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
      case "REJECTED":
        return "bg-red-500/10 border-red-500/30 text-red-600 hover:bg-red-500/10"
      case "CLOSED":
        return "bg-blue-500/10 border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
      case "EXPIRED":
        return "bg-orange-500/10 border-orange-500/30 text-orange-600 hover:bg-orange-500/10"
      case "DELETED":
        return "bg-gray-500/10 border-gray-500/30 text-gray-500 hover:bg-gray-500/10"
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-600 hover:bg-gray-500/10"
    }
  }

  const getLabel = (status: JobStatus) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return "Pending Approval"
      case "ACTIVE":
        return "Active"
      case "REJECTED":
        return "Rejected"
      case "CLOSED":
        return "Closed"
      case "EXPIRED":
        return "Expired"
      case "DELETED":
        return "Deleted"
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
