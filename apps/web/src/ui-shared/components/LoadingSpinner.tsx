import { CircleNotch } from "@phosphor-icons/react"

interface LoadingSpinnerProps {
  message?: string
  className?: string
}

export default function LoadingSpinner({ message = "Loading...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <CircleNotch size={32} className="animate-spin text-brand" />
      {message && (
        <p className="mt-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {message}
        </p>
      )}
    </div>
  )
}
