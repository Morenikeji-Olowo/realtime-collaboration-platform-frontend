import { useMutation } from "@tanstack/react-query"
import { getDownloadUrl } from "@/features/files/api/files-api"

export function useDownloadFile() {
  return useMutation({
    mutationFn: (fileId: string) => getDownloadUrl(fileId),
    onSuccess: (data) => {
      window.location.href = data.downloadUrl
    },
  })
}