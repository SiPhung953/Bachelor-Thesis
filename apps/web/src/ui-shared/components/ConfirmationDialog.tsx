import { CircleNotch, Warning } from "@phosphor-icons/react"
import { Button } from "@/ui-shared/components/ui/button"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  isDestructive?: boolean
  isLoading?: boolean
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  isLoading = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Dialog Content */}
      <div className="relative w-full max-w-md bg-background border border-foreground/10 p-6 shadow-xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Accent strip */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${isDestructive ? "bg-destructive" : "bg-brand"}`} />

        <div className="flex gap-4 items-start">
          <div className={`flex size-10 items-center justify-center shrink-0 rounded-none ${isDestructive ? "bg-destructive/10 text-destructive" : "bg-brand/10 text-brand"}`}>
            <Warning size={20} weight="bold" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-foreground/10">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-9 px-4 text-xs font-bold uppercase tracking-wider border-foreground/20 hover:bg-secondary/40 transition-colors"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-9 px-4 text-xs font-bold uppercase tracking-wider text-white border-none cursor-pointer transition-colors ${
              isDestructive 
                ? "bg-destructive hover:bg-destructive/90" 
                : "bg-brand hover:bg-brand/90"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <CircleNotch className="animate-spin" size={13} />
                Processing…
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
