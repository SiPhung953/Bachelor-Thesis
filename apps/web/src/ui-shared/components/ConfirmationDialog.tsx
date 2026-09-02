import { CircleNotch, Warning } from "@phosphor-icons/react"
import { Button } from "@/ui-shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui-shared/components/ui/dialog"

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

/**
 * Yes/no confirmation modal.
 *
 * Built on the Radix Dialog primitive, which supplies focus trapping,
 * Escape-to-close, scroll locking and the `aria-modal` wiring. While
 * `isLoading` is true the dialog refuses to close, so a confirmed action
 * cannot be dismissed midway.
 */
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
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Radix reports every close attempt — backdrop click, Escape, the X.
        // Ignore them all while the action is in flight.
        if (!open && !isLoading) onClose()
      }}
    >
      <DialogContent
        showCloseButton={!isLoading}
        className="max-w-md gap-0 border border-foreground/10 bg-background p-6 shadow-xl sm:max-w-md"
      >
        {/* Accent strip */}
        <div
          className={`absolute top-0 right-0 left-0 h-1 ${
            isDestructive ? "bg-destructive" : "bg-brand"
          }`}
        />

        <div className="flex items-start gap-4">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-none ${
              isDestructive ? "bg-destructive/10 text-destructive" : "bg-brand/10 text-brand"
            }`}
          >
            <Warning size={20} weight="bold" />
          </div>

          <DialogHeader className="flex-1 space-y-2 text-left">
            <DialogTitle className="text-sm font-bold tracking-tight text-foreground uppercase">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
              {message}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="mt-6 flex-row justify-end gap-3 border-t border-foreground/10 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-9 rounded-none border-foreground/20 px-4 text-xs font-bold tracking-wider uppercase transition-colors hover:bg-secondary/40"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-9 cursor-pointer rounded-none border-none px-4 text-xs font-bold tracking-wider text-white uppercase transition-colors ${
              isDestructive ? "bg-destructive hover:bg-destructive/90" : "bg-brand hover:bg-brand/90"
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
