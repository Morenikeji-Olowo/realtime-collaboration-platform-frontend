import { CheckIcon, XIcon, Loader2Icon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

type UploadItem = {
  id: string
  filename: string
  status: "preparing" | "uploading" | "confirming" | "completed" | "failed"
  progress: number
  error?: string
}

const STATUS_LABEL: Record<UploadItem["status"], string> = {
  preparing: "Preparing...",
  uploading: "Uploading...",
  confirming: "Confirming...",
  completed: "Done",
  failed: "Failed",
}

export function UploadProgressList({
  uploads,
  onDismiss,
}: {
  uploads: UploadItem[]
  onDismiss: (id: string) => void
}) {
  if (uploads.length === 0) return null

  return (
    <div className="space-y-2 rounded-lg border p-3">
      {uploads.map((u) => (
        <div key={u.id} className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate">{u.filename}</span>
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
              {u.status !== "completed" && u.status !== "failed" && (
                <Loader2Icon className="size-3 animate-spin" />
              )}
              {u.status === "completed" && <CheckIcon className="size-3 text-success-text" />}
              {u.status === "failed" && <XIcon className="size-3 text-destructive" />}
              {STATUS_LABEL[u.status]}
              {(u.status === "completed" || u.status === "failed") && (
                <button onClick={() => onDismiss(u.id)} className="ml-1 underline underline-offset-2">
                  Dismiss
                </button>
              )}
            </span>
          </div>
          {u.status === "uploading" && <Progress value={u.progress} className="h-1" />}
          {u.status === "failed" && <p className="text-xs text-destructive">{u.error}</p>}
        </div>
      ))}
    </div>
  )
}