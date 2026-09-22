import { useQuery } from "@tanstack/react-query"
import { listInvitations } from "@/features/members/api/members-api"

export function useInvitations(workspaceId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["invitations", workspaceId],
    queryFn: () => listInvitations(workspaceId),
    enabled,
  })
}