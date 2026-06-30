import React from "react"
import { Button } from "@/ui-shared/components/ui/button"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onActionClick?: () => void
  className?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onActionClick,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-foreground/15 bg-card py-12 md:py-16 ${className}`}>
      <div className="text-muted-foreground/65 mb-4 shrink-0">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
        {title}
      </h4>
      <p className="text-xs text-muted-foreground max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && onActionClick && (
        <Button
          onClick={onActionClick}
          className="h-9 px-5 text-xs font-bold uppercase tracking-wider bg-brand hover:bg-brand/90 text-white cursor-pointer transition-colors border-none"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
