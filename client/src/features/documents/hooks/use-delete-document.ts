import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteDocument } from "@/features/documents/api/documents-api"

export function useDeleteDocument(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] })
    },
  })
}