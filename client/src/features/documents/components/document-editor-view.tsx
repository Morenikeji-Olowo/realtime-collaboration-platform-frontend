import { EditorContent } from "@tiptap/react"
import { useParams } from "react-router"
import { useDocumentEditor } from "@/features/documents/hooks/use-document-editor"
import { EditorToolbar } from "@/features/documents/components/editor-toolbar"
import { Skeleton } from "@/components/ui/skeleton"

export function DocumentEditorView() {
  const { documentId } = useParams<{ documentId: string }>()
  const { editor, status, error } = useDocumentEditor(documentId!)

  if (status === "error") {
    return <div className="p-8 text-sm text-destructive">{error ?? "Couldn't open this document."}</div>
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
    <div className="flex h-full flex-col">
      <EditorToolbar editor={editor} />
      <div className="mx-auto w-full max-w-3xl flex-1 overflow-auto p-8">
        <div className="mb-4 text-xs text-muted-foreground">Live · autosaves periodically</div>
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none [&_.ProseMirror]:min-h-[60vh] [&_.ProseMirror]:outline-none"
        />
      </div>
    </div>
  )
}