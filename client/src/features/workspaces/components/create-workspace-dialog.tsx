import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  createWorkspaceSchema,
  type CreateWorkspaceInput,
} from "@/features/workspaces/schemas/create-workspace-schema"
import { useCreateWorkspace } from "@/features/workspaces/hooks/use-create-workspace"
import { ApiError } from "@/lib/api/client"

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const createWorkspace = useCreateWorkspace()
  const { register, handleSubmit, reset, formState: { errors }, setError } =
    useForm<CreateWorkspaceInput>({ resolver: zodResolver(createWorkspaceSchema) })

  function onSubmit(data: CreateWorkspaceInput) {
    createWorkspace.mutate(data.name, {
      onSuccess: (workspace) => {
        reset()
        onOpenChange(false)
        // Response has no `role` field (confirmed) — safe to assume owner
        // here without a refetch, since you're definitionally the creator.
        navigate(`/w/${workspace.id}`)
      },
      onError: (err) => {
        const message = err instanceof ApiError ? err.message : "Something went wrong."
        setError("root", { message })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Input placeholder="Workspace name" {...register("name")} autoFocus />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createWorkspace.isPending}>
              {createWorkspace.isPending ? "Creating..." : "Create workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}