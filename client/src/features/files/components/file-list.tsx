import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon, FolderIcon } from "lucide-react"
import { getFileIcon } from "@/features/files/lib/get-file-icon"
import { formatFileSize } from "@/lib/format-file-size"
import { formatRelativeTime } from "@/lib/format-relative-time"
import type { WorkspaceFile } from "@/features/files/types/workspace-file"

export function FileList({
  files,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onDownload,
  onDeleteRequest,
  canDelete,
}: {
  files: WorkspaceFile[] | undefined
  isLoading: boolean
  isError: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  onDownload: (fileId: string) => void
  onDeleteRequest: (file: WorkspaceFile) => void
  canDelete: (file: WorkspaceFile) => boolean
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="text-sm text-destructive">Couldn't load files. Try refreshing.</p>
  }

  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
        <FolderIcon className="size-8" />
        <p className="text-sm">No files yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {files.map((file) => {
        const Icon = getFileIcon(file.mime_type)
        return (
          <div key={file.id} className="flex items-center gap-3 rounded-lg border p-3">
            <Icon className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{file.original_name}</p>
              <p className="text-xs text-muted-foreground">
                {file.uploaded_by.name} · {formatFileSize(file.size_bytes)} ·{" "}
                {formatRelativeTime(file.created_at)}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onDownload(file.id)}>Download</DropdownMenuItem>
                {canDelete(file) && (
                  <DropdownMenuItem variant="destructive" onSelect={() => onDeleteRequest(file)}>
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      })}
      {hasNextPage && (
        <Button variant="outline" size="sm" onClick={onLoadMore} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  )
}