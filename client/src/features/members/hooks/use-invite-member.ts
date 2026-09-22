import { useMutation, useQueryClient } from "@tanstack/react-query"
import { inviteMember } from "@/features/members/api/members-api"

export function useInviteMember(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (email: string) => inviteMember(workspaceId, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", workspaceId] })
    },
  })
}