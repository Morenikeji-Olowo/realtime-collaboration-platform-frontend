import { useQuery } from "@tanstack/react-query"
import { listDocuments } from "@/features/documents/api/documents-api"

export function useDocuments(workspaceId: string) {
  return useQuery({
    queryKey: ["documents", workspaceId],
    queryFn: () => listDocuments(workspaceId),
  })
}