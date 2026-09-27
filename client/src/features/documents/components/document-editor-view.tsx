import { EditorContent } from "@tiptap/react"
import { useParams } from "react-router"
import { useDocumentEditor } from "@/features/documents/hooks/use-document-editor"
import { Skeleton } from "@/components/ui/skeleton"

export function DocumentEditorView() {
  const { documentId } = useParams<{ documentId: string }>()
  const { editor, status, error } = useDocumentEditor(documentId!)

  if (status === "error") {
    return (
      <div className="p-8 text-sm text-destructive">
        {error ?? "Couldn't open this document."}
      </div>
    )
  }

  if (status === "connecting" || !editor) {
    return (
      <div className="space-y-3 p-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        {/* Honest, not a "Saved" checkmark — there's no flush-complete event
            from the backend, only a ~5s background save on a timer we can't
            observe directly. Claiming "Saved" would be a guess dressed as fact. */}
        <span>Live · autosaves periodically</span>
      </div>
      <EditorContent editor={editor} className="prose prose-invert max-w-none focus:outline-none" />
    </div>
  )
}