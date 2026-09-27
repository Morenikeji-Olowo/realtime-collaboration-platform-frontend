import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteFile } from "@/features/files/api/files-api"

export function useDeleteFile(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (fileId: string) => deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-files", workspaceId] })
    },
  })
}