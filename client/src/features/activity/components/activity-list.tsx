import { Link } from "react-router"
import { FileTextIcon, UserPlusIcon, HomeIcon, ClockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/features/users/lib/get-initials"
import { formatRelativeTime } from "@/lib/format-relative-time"
import type { ActivityEvent, ActivityEventType } from "@/features/activity/types/activity-event"

const EVENT_ICON: Record<ActivityEventType, typeof FileTextIcon> = {
  workspace_created: HomeIcon,
  document_created: FileTextIcon,
  member_joined: UserPlusIcon,
}

function describeEvent(event: ActivityEvent, workspaceId: string) {
  const actorName = event.actor?.name ?? "A former member"

  switch (event.event_type) {
    case "workspace_created":
      return <>{actorName} created this workspace</>
    case "member_joined":
      return <>{actorName} joined the workspace</>
    case "document_created": {
      const title = typeof event.metadata.title === "string" ? event.metadata.title : "a document"
      return (
        <>
          {actorName} created{" "}
          {event.target_id ? (
            <Link
              to={`/w/${workspaceId}/documents/${event.target_id}`}
              className="font-medium underline-offset-4 hover:underline"
            >
              "{title}"
            </Link>
          ) : (
            <>"{title}"</>
          )}
        </>
      )
    }
  }
}

export function ActivityList({
  workspaceId,
  pages,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  workspaceId: string
  pages: { events: ActivityEvent[] }[] | undefined
  isLoading: boolean
  isError: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="text-sm text-destructive">Couldn't load activity. Try refreshing.</p>
  }

  const events = pages?.flatMap((p) => p.events) ?? []

  // Defensive only — the backend contract guarantees this is unreachable
  // for a real workspace (workspace_created is always logged), but a UI
  // shouldn't render silent nothing if that ever turns out wrong.
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
        <ClockIcon className="size-8" />
        <p className="text-sm">No activity yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative space-y-5 pl-1">
        {/* connecting line down the timeline */}
        <div className="absolute top-2 bottom-2 left-[15px] w-px bg-border" />

        {events.map((event) => {
          const Icon = EVENT_ICON[event.event_type]
          return (
            <div key={event.id} className="relative flex gap-3">
              <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="flex min-w-0 flex-1 items-start justify-between gap-2 pt-1">
                <div className="flex min-w-0 items-center gap-2">
                  {event.actor && (
                    <Avatar className="size-5 shrink-0">
                      <AvatarFallback className="text-[10px]">
                        {getInitials(event.actor.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <p className="truncate text-sm">{describeEvent(event, workspaceId)}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {formatRelativeTime(event.created_at)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {hasNextPage && (
        <Button variant="outline" size="sm" onClick={onLoadMore} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  )
}