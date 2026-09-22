import { MailIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Invitation } from "@/features/members/types/invitation"

export function PendingInvitationsList({
  invitations,
  isLoading,
}: {
  invitations: Invitation[] | undefined
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 rounded-lg" />
      </div>
    )
  }

  if (!invitations || invitations.length === 0) return null

  return (
    <div className="space-y-2">
      {invitations.map((inv) => (
        <div key={inv.id} className="flex items-center gap-3 rounded-lg border border-dashed p-3">
          <MailIcon className="size-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{inv.invited_email}</p>
            <p className="text-xs text-muted-foreground">
              Expires {new Date(inv.expires_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}