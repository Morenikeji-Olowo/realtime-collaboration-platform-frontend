import * as React from "react"
import { MailIcon, PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useLocation, useParams, Link } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { loginSchema, type LoginInput } from "@/features/auth/schemas/login-schema"
import { login } from "@/features/auth/api/auth-api"
import { ApiError } from "@/lib/api/client"
import { Title, P, Muted } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDocuments } from "@/features/documents/hooks/use-documents"
import { DocumentList } from "@/features/documents/components/document-list"
import { CreateDocumentDialog } from "@/features/documents/components/create-document-dialog"
import { useMembers } from "@/features/members/hooks/use-members"
import { MemberList } from "@/features/members/components/member-list"
import { InviteMemberDialog } from "@/features/members/components/invite-member-dialog"
import { useCurrentWorkspaceRole } from "@/features/workspaces/hooks/use-current-workspace-role"
import { useAcceptInvitation } from "@/features/members/hooks/use-accept-invitation"
import { useRejectInvitation } from "@/features/members/hooks/use-reject-invitation"
import { useInvitations } from "@/features/members/hooks/use-invitations"
import { PendingInvitationsList } from "@/features/members/components/pending-invitations-list"
import { useMessageHistory } from "@/features/chat/hooks/use-message-history"
import { useChatSocket } from "@/features/chat/hooks/use-chat-socket"
import { MessageList } from "@/features/chat/components/message-list"
import { MessageComposer } from "@/features/chat/components/message-composer"
import { usePresenceStore } from "@/stores/presence-store"

import { WhiteboardCanvas } from "@/features/whiteboard/components/whiteboard-canvas"
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces"
import { CreateWorkspaceDialog } from "@/features/workspaces/components/create-workspace-dialog"

import { useActivity } from "@/features/activity/hooks/use-activity"
import { ActivityList } from "@/features/activity/components/activity-list"

import { useRenameWorkspace } from "@/features/workspaces/hooks/use-rename-workspace"
import { useDeleteWorkspace } from "@/features/workspaces/hooks/use-delete-workspace"
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog"

const make = (name: string) => () => <div className="p-8">{name}</div>

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/"

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate(from, { replace: true }),
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again."
      setError("root", { message })
    },
  })

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="w-full max-w-sm space-y-4"
      >
        <Title className="text-2xl">Log in</Title>

        <div className="space-y-1">
          <Input placeholder="Email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <Input placeholder="Password" type="password" {...register("password")} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Logging in..." : "Log in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/forgot-password" className="underline underline-offset-4">
            Forgot password?
          </Link>
        </p>
      </form>
    </div>
  )
}

export function Verify() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <MailIcon className="size-10 text-muted-foreground" />
      <Title className="text-2xl">Check your email</Title>
      <P className="max-w-sm text-muted-foreground">
        We've sent a confirmation link to your email address. Click it to activate your account, then log in.
      </P>
      <Button variant="outline">Resend email</Button>
      <Muted>
        <a href="/login" className="underline underline-offset-4">Back to login</a>
      </Muted>
    </div>
  )
}

export function Documents() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data: documents, isLoading } = useDocuments(workspaceId!)
  const [createOpen, setCreateOpen] = React.useState(false)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Title className="text-2xl">Documents</Title>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon />
          New document
        </Button>
      </div>
      <DocumentList documents={documents} workspaceId={workspaceId!} isLoading={isLoading} />
      <CreateDocumentDialog
        workspaceId={workspaceId!}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  )
}

export function Members() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data: members, isLoading } = useMembers(workspaceId!)
  const role = useCurrentWorkspaceRole()
  const isOwner = role === "owner"
  const { data: invitations, isLoading: invitationsLoading } = useInvitations(workspaceId!, isOwner)
  const [inviteOpen, setInviteOpen] = React.useState(false)

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Title className="text-2xl">Members</Title>
          {isOwner && (
            <Button onClick={() => setInviteOpen(true)}>
              <PlusIcon />
              Invite member
            </Button>
          )}
        </div>
        <MemberList members={members} isLoading={isLoading} />
      </div>

      {isOwner && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Pending invitations</h2>
          <PendingInvitationsList invitations={invitations} isLoading={invitationsLoading} />
        </div>
      )}

      <InviteMemberDialog
        workspaceId={workspaceId!}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  )
}

export function InvitationAccept() {
  const { invitationId } = useParams<{ invitationId: string }>()
  const navigate = useNavigate()
  const accept = useAcceptInvitation()
  const reject = useRejectInvitation()
  const [error, setError] = React.useState<string | null>(null)

  // Terminal state once either mutation resolves — success or a handled
  // failure both stop showing the action buttons. Only an unexpected error
  // leaves the buttons available to retry.
  const [resolved, setResolved] = React.useState<"declined" | null>(null)

  function handleAccept() {
    setError(null)
    accept.mutate(invitationId!, {
      onSuccess: (workspace) => navigate(`/w/${workspace.id}`, { replace: true }),
      onError: (err) => {
        const message = err instanceof ApiError ? err.message : "Something went wrong."
        setError(message)
      },
    })
  }

  function handleDecline() {
    setError(null)
    reject.mutate(invitationId!, {
      onSuccess: () => setResolved("declined"),
      onError: (err) => {
        const message = err instanceof ApiError ? err.message : "Something went wrong."
        setError(message)
      },
    })
  }

  const isPending = accept.isPending || reject.isPending

  if (resolved === "declined") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
        <Title className="text-2xl">Invitation declined</Title>
        <Button variant="outline" onClick={() => navigate("/workspaces")}>
          Go to your workspaces
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <Title className="text-2xl">Workspace invitation</Title>
      <P className="max-w-sm text-muted-foreground">
        You've been invited to join a workspace.
      </P>

      {error && (
        <div className="max-w-sm space-y-2">
          <p className="text-sm text-destructive">{error}</p>
          <Muted>
            <button onClick={() => navigate("/workspaces")} className="underline underline-offset-4">
              Go to your workspaces instead
            </button>
          </Muted>
        </div>
      )}

      {!error && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDecline} disabled={isPending}>
            {reject.isPending ? "Declining..." : "Decline"}
          </Button>
          <Button onClick={handleAccept} disabled={isPending}>
            {accept.isPending ? "Accepting..." : "Accept"}
          </Button>
        </div>
      )}
    </div>
  )
}

export function Chat() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data: messages, isLoading } = useMessageHistory(workspaceId!)
  const { sendMessage, isSending } = useChatSocket(workspaceId!)
  const onlineCount = usePresenceStore((s) => s.onlineUserIds.size)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <Title className="text-xl">Chat</Title>
        <Muted>{onlineCount} online</Muted>
      </div>
      <MessageList workspaceId={workspaceId!} messages={messages} isLoading={isLoading} />
      <MessageComposer onSend={sendMessage} isSending={isSending} />
    </div>
  )
}

export function Whiteboard() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  return <WhiteboardCanvas workspaceId={workspaceId!} />
}


export function WorkspaceSelector() {
  const { data: workspaces, isLoading } = useWorkspaces()
  const [createOpen, setCreateOpen] = React.useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-4 text-center">
        <Title className="text-2xl">You don't have a workspace yet</Title>
        <P className="max-w-sm text-muted-foreground">
          Create a workspace to start collaborating with your team, classmates, or organization.
        </P>
        <Button onClick={() => setCreateOpen(true)}>Create workspace</Button>
        <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <Title className="text-2xl">Your workspaces</Title>
      <div className="w-full max-w-sm space-y-2">
        {workspaces.map((w) => (
          <Link key={w.id} to={`/w/${w.id}`}>
            <div className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
              <p className="font-medium">{w.name}</p>
              <p className="text-xs capitalize text-muted-foreground">{w.role}</p>
            </div>
          </Link>
        ))}
      </div>
      <Button variant="outline" onClick={() => setCreateOpen(true)}>
        Create another workspace
      </Button>
      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}


export function Activity() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useActivity(workspaceId!)

  return (
    <div className="space-y-6 p-6">
      <Title className="text-2xl">Activity</Title>
      <ActivityList
        workspaceId={workspaceId!}
        pages={data?.pages}
        isLoading={isLoading}
        isError={isError}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
      />
    </div>
  )
}


export function WorkspaceSettings() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const navigate = useNavigate()
  const { data: workspaces } = useWorkspaces()
  const role = useCurrentWorkspaceRole()
  const isOwner = role === "owner"
  const workspace = workspaces?.find((w) => w.id === workspaceId)

  const [name, setName] = React.useState(workspace?.name ?? "")
  const [nameError, setNameError] = React.useState<string | null>(null)
  const [renameError, setRenameError] = React.useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteError, setDeleteError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (workspace) setName(workspace.name)
  }, [workspace?.name])

  const renameWorkspace = useRenameWorkspace(workspaceId!)
  const deleteWorkspace = useDeleteWorkspace(workspaceId!)

  function handleRename() {
    setNameError(null)
    setRenameError(null)
    const trimmed = name.trim()
    if (!trimmed) {
      setNameError("Workspace name is required")
      return
    }
    if (trimmed.length > 200) {
      setNameError("Workspace name must be 200 characters or fewer")
      return
    }
    renameWorkspace.mutate(trimmed, {
      onError: (err) => {
        setRenameError(err instanceof ApiError ? err.message : "Something went wrong.")
      },
    })
  }

  function handleDelete() {
    setDeleteError(null)
    deleteWorkspace.mutate(undefined, {
      onSuccess: () => navigate("/workspaces"),
      onError: (err) => {
        setDeleteError(err instanceof ApiError ? err.message : "Something went wrong.")
        // AlertDialog stays open on failure, same pattern as every other
        // destructive-action failure in this app.
      },
    })
  }

  return (
    <div className="max-w-lg space-y-8 p-6">
      <Title className="text-2xl">Workspace Settings</Title>

      <div className="space-y-2">
        <h2 className="text-sm font-medium">Workspace</h2>
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isOwner}
          />
          {isOwner && (
            <Button onClick={handleRename} disabled={renameWorkspace.isPending}>
              {renameWorkspace.isPending ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
        {nameError && <p className="text-sm text-destructive">{nameError}</p>}
        {renameError && <p className="text-sm text-destructive">{renameError}</p>}
        {!isOwner && (
          <Muted>Only the workspace owner can rename this workspace.</Muted>
        )}
      </div>

      {isOwner && (
        <div className="space-y-3 rounded-lg border border-destructive/30 p-4">
          <h2 className="text-sm font-medium text-destructive">Danger Zone</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Delete workspace</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete this workspace and its documents, messages, members,
                invitations, and whiteboard.
              </p>
            </div>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              Delete workspace
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{workspace?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all documents, messages, invitations, memberships,
              and the whiteboard in this workspace. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteWorkspace.isPending}
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
            >
              {deleteWorkspace.isPending ? "Deleting..." : "Delete workspace"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
export const ForgotPassword = make("Forgot Password")
export const ResetPassword = make("Reset Password")
export { HomeView as Home } from "@/features/workspaces/components/home-view"
export const DocumentEditor = make("Document Editor")
export const ProfileSettings = make("Profile Settings")
export const NotFound = make("404 — Not Found")