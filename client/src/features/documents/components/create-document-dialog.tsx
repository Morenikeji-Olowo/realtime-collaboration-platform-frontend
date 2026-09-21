import * as React from "react"
import { useNavigate } from "react-router"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateDocument } from "@/features/documents/hooks/use-create-document"

export function CreateDocumentDialog({
  workspaceId,
  open,
  onOpenChange,
}: {
  workspaceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = React.useState("")
  const navigate = useNavigate()
  const createDocument = useCreateDocument(workspaceId)

  function handleCreate() {
    const finalTitle = title.trim() || "Untitled document"
    createDocument.mutate(finalTitle, {
      onSuccess: (doc) => {
        setTitle("")
        onOpenChange(false)
        navigate(`/w/${workspaceId}/documents/${doc.id}`)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New document</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Untitled document"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleCreate()
            }
          }}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={createDocument.isPending}>
            {createDocument.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}