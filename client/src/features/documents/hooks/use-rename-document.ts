import { useMutation, useQueryClient } from "@tanstack/react-query"
import { renameDocument } from "@/features/documents/api/documents-api"

export function useRenameDocument(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ documentId, title }: { documentId: string; title: string }) =>
      renameDocument(documentId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] })
    },
  })
}