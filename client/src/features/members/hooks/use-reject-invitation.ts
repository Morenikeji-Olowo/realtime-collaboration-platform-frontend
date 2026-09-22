import { useMutation } from "@tanstack/react-query"
import { rejectInvitation } from "@/features/members/api/invitations-api"

export function useRejectInvitation() {
  return useMutation({
    mutationFn: (invitationId: string) => rejectInvitation(invitationId),
  })
}