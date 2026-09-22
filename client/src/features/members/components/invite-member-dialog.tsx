import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { inviteSchema, type InviteInput } from "@/features/members/schemas/invite-schema"
import { useInviteMember } from "@/features/members/hooks/use-invite-member"
import { ApiError } from "@/lib/api/client"

export function InviteMemberDialog({
  workspaceId,
  open,
  onOpenChange,
}: {
  workspaceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { register, handleSubmit, reset, formState: { errors }, setError } =
    useForm<InviteInput>({ resolver: zodResolver(inviteSchema) })
  const inviteMember = useInviteMember(workspaceId)

  function onSubmit(data: InviteInput) {
    inviteMember.mutate(data.email, {
      onSuccess: () => {
        toast.success(`Invitation sent to ${data.email}`)
        reset()
        onOpenChange(false)
      },
      onError: (err) => {
        const message = err instanceof ApiError ? err.message : "Failed to send invitation."
        setError("root", { message })
        // dialog stays open, input preserved — matches the failure-state rule from Documents
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Input placeholder="Email address" type="email" {...register("email")} autoFocus />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
          <DialogFooter>
            <Button type="submit" disabled={inviteMember.isPending}>
              {inviteMember.isPending ? "Sending..." : "Send invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}