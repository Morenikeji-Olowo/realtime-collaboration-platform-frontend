import { Link } from "react-router"
import { FileTextIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Document } from "@/features/documents/types/document"

export function DocumentList({
  documents,
  workspaceId,
  isLoading,
}: {
  documents: Document[] | undefined
  workspaceId: string
  isLoading: boolean
}) {
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <Link key={doc.id} to={`/w/${workspaceId}/documents/${doc.id}`}>
          <Card className="transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center gap-3">
              <FileTextIcon className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate font-medium">{doc.title}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {new Date(doc.updated_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}