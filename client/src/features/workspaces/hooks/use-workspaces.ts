import { useQuery } from "@tanstack/react-query"
import { listWorkspaces } from "@/features/workspaces/api/workspaces-api"

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: listWorkspaces,
  })
}