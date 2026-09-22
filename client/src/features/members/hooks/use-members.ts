import { useQuery } from "@tanstack/react-query"
import { listMembers } from "@/features/members/api/members-api"

export function useMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => listMembers(workspaceId),
  })
}