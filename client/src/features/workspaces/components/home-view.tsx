import { Link, useParams } from "react-router"
import * as React from "react"
import { FileTextIcon, MessageSquareIcon, PenToolIcon, PlusIcon, UsersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentUser } from "@/features/users/hooks/use-current-user"
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces"
import { useCurrentWorkspaceRole } from "@/features/workspaces/hooks/use-current-workspace-role"
import { useDocuments } from "@/features/documents/hooks/use-documents"
import { useMembers } from "@/features/members/hooks/use-members"
import { useInvitations } from "@/features/members/hooks/use-invitations"
import { CreateDocumentDialog } from "@/features/documents/components/create-document-dialog"
import { InviteMemberDialog } from "@/features/members/components/invite-member-dialog"
import { formatRelativeTime } from "@/lib/format-relative-time"

const RECENT_DOCUMENT_COUNT = 5

export function HomeView() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data: currentUser } = useCurrentUser()
  const { data: workspaces } = useWorkspaces()
  const role = useCurrentWorkspaceRole()
  const isOwner = role === "owner"

  const { data: documents, isLoading: documentsLoading } = useDocuments(workspaceId!)
  const { data: members } = useMembers(workspaceId!)
  const { data: invitations } = useInvitations(workspaceId!, isOwner)

  const [createOpen, setCreateOpen] = React.useState(false)
  const [inviteOpen, setInviteOpen] = React.useState(false)

  const workspace = workspaces?.find((w) => w.id === workspaceId)

  const recentDocuments = React.useMemo(() => {
    if (!documents) return []
    return [...documents]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, RECENT_DOCUMENT_COUNT)
  }, [documents])

  function resolveCreatorName(creatorId: string) {
    return members?.find((m) => m.id === creatorId)?.name ?? "Unknown"
  }

  const snapshotParts = [
    members ? `${members.length} member${members.length === 1 ? "" : "s"}` : null,
    documents ? `${documents.length} document${documents.length === 1 ? "" : "s"}` : null,
    isOwner && invitations
      ? `${invitations.length} pending invitation${invitations.length === 1 ? "" : "s"}`
      : null,
  ].filter(Boolean)

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">
          Good {getTimeOfDayGreeting()}, {currentUser?.name.split(" ")[0] ?? ""}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening in {workspace?.name ?? "your workspace"}.
        </p>
      </div>

      {snapshotParts.length > 0 && (
        <p className="text-sm text-muted-foreground">{snapshotParts.join(" · ")}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon /> New document
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/w/${workspaceId}/chat`}>
            <MessageSquareIcon /> Chat
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/w/${workspaceId}/whiteboard`}>
            <PenToolIcon /> Whiteboard
          </Link>
        </Button>
        {isOwner && (
          <Button variant="outline" onClick={() => setInviteOpen(true)}>
            <UsersIcon /> Invite member
          </Button>
        )}
      </div>

      <div className="space-y-3">
  <h2 className="text-sm font-medium text-muted-foreground">Recent documents</h2>

  {documentsLoading ? (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
  ) : recentDocuments.length === 0 ? (
    <Card>
      <CardContent className="flex-row items-center gap-3">
        <FileTextIcon className="size-6" />
        <p className="text-sm">No documents yet</p>
      </CardContent>
    </Card>
  ) : (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {recentDocuments.map((doc) => (
          <Link key={doc.id} to={`/w/${workspaceId}/documents/${doc.id}`}>
            <Card className="h-32 transition-colors hover:bg-muted/50">
              <CardContent className="flex h-full flex-col justify-between">
                <FileTextIcon className="size-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{doc.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatRelativeTime(doc.updated_at)} · {resolveCreatorName(doc.creator_id)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Link
        to={`/w/${workspaceId}/documents`}
        className="inline-block text-sm text-primary underline-offset-4 hover:underline"
      >
        View all documents →
      </Link>
    </>
  )}
</div>

      <CreateDocumentDialog workspaceId={workspaceId!} open={createOpen} onOpenChange={setCreateOpen} />
      <InviteMemberDialog workspaceId={workspaceId!} open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}

function getTimeOfDayGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 18) return "afternoon"
  return "evening"
}