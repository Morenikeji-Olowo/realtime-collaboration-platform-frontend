import * as React from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import { FileTextIcon, MoreVerticalIcon, CheckIcon, XIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { useRenameDocument } from "@/features/documents/hooks/use-rename-document"
import { useDeleteDocument } from "@/features/documents/hooks/use-delete-document"
import { ApiError } from "@/lib/api/client"
import type { Document } from "@/features/documents/types/document"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export function DocumentList({
  documents,
  workspaceId,
  isLoading,
}: {
  documents: Document[] | undefined
  workspaceId: string
  isLoading: boolean
}) {
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editValue, setEditValue] = React.useState("")
  const [deleteTarget, setDeleteTarget] = React.useState<Document | null>(null)

  const renameDoc = useRenameDocument(workspaceId)
  const deleteDoc = useDeleteDocument(workspaceId)

  function startEditing(doc: Document) {
    setEditingId(doc.id)
    setEditValue(doc.title)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditValue("")
  }

  function saveEditing(documentId: string) {
    const title = editValue.trim()
    if (!title) return
    renameDoc.mutate(
      { documentId, title },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditValue("")
        },
        onError: (err) => {
          const message = err instanceof ApiError ? err.message : "Failed to rename document."
          toast.error(message)
          // deliberately not resetting editingId here — keep the input open
          // with the attempted value so the user can retry or cancel.
        },
      }
    )
  }

  function confirmDelete() {
    if (!deleteTarget) return
    deleteDoc.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: (err) => {
        const message = err instanceof ApiError ? err.message : "Failed to delete document."
        toast.error(message)
        // dialog stays open on failure so the user sees the error in context
      },
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
        <FileTextIcon className="size-8" />
        <p>No documents yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => {
          const isEditing = editingId === doc.id

          return (
            <Card key={doc.id} className="transition-colors hover:bg-muted/50">
                            <CardContent className="flex-row items-center justify-between gap-3">
                {isEditing ? (
                  <>
                    <FileTextIcon className="size-5 shrink-0 text-muted-foreground" />
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      className="h-8 flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEditing(doc.id)
                        if (e.key === "Escape") cancelEditing()
                      }}
                    />
                    <div className="flex shrink-0 gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            disabled={renameDoc.isPending}
                            onClick={() => saveEditing(doc.id)}
                            aria-label="Save"
                          >
                            <CheckIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon-sm" variant="ghost" onClick={cancelEditing} aria-label="Cancel">
                            <XIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cancel</TooltipContent>
                      </Tooltip>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/w/${workspaceId}/documents/${doc.id}`}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <FileTextIcon className="size-5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{doc.title}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {new Date(doc.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="shrink-0">
                          <MoreVerticalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => startEditing(doc)}>
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => setDeleteTarget(doc)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the document and all its content. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteDoc.isPending}
              onClick={(e) => {
                e.preventDefault() // AlertDialogAction closes on click by default; we control close via onSuccess instead
                confirmDelete()
              }}
            >
              {deleteDoc.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}