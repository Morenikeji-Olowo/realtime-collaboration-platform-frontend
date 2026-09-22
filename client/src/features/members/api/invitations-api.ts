import { apiFetch } from "@/lib/api/client"
import type { Invitation } from "@/features/members/types/invitation"
import type { Workspace } from "@/features/workspaces/types/workspace"

export function acceptInvitation(invitationId: string) {
  return apiFetch<Workspace>(`/api/invitations/${invitationId}/accept`, {
    method: "POST",
  })
}

export function rejectInvitation(invitationId: string) {
  return apiFetch<Invitation>(`/api/invitations/${invitationId}/reject`, {
    method: "POST",
  })
}