import { apiFetch } from "@/lib/api/client"
import type { Member } from "@/features/members/types/member"
import type { Invitation } from "@/features/members/types/invitation"

export function listMembers(workspaceId: string) {
  return apiFetch<Member[]>(`/api/workspaces/${workspaceId}/members`)
}

export function inviteMember(workspaceId: string, email: string) {
  return apiFetch<Invitation>(`/api/workspaces/${workspaceId}/invitations`, {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}