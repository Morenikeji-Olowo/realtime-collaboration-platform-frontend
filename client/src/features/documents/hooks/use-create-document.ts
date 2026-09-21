import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createDocument } from "@/features/documents/api/documents-api"

export function useCreateDocument(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (title: string) => createDocument(workspaceId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] })
    },
  })
}