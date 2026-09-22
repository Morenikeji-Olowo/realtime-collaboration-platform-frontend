import { useMutation } from "@tanstack/react-query"
import { inviteMember } from "@/features/members/api/members-api"

export function useInviteMember(workspaceId: string) {
  return useMutation({
    mutationFn: (email: string) => inviteMember(workspaceId, email),
  })
}