import { Warning } from "@phosphor-icons/react"

interface ErrorAlertProps {
  message: string
  title?: string
  className?: string
}

export default function ErrorAlert({ message, title, className = "" }: ErrorAlertProps) {
  return (
    <div className={`flex items-start gap-3 border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive ${className}`}>
      <Warning size={18} weight="fill" className="shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && (
          <h5 className="font-bold uppercase tracking-wide">
            {title}
          </h5>
        )}
        <p className="font-medium leading-normal">{message}</p>
      </div>
    </div>
  )
}
