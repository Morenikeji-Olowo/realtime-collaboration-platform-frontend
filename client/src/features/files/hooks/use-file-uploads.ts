import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  requestUploadUrl, uploadToGcs, completeUpload, FileTooLargeError,
} from "@/features/files/api/files-api"

type UploadItem = {
  id: string
  filename: string
  status: "preparing" | "uploading" | "confirming" | "completed" | "failed"
  progress: number
  error?: string
}

export function useFileUploads(workspaceId: string) {
  const [uploads, setUploads] = React.useState<UploadItem[]>([])
  const queryClient = useQueryClient()

  function update(id: string, patch: Partial<UploadItem>) {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
  }

  async function upload(file: File) {
    const localId = crypto.randomUUID()
    setUploads((prev) => [...prev, { id: localId, filename: file.name, status: "preparing", progress: 0 }])

    try {
      const { fileId, uploadUrl, mimeType } = await requestUploadUrl(workspaceId, file)

      update(localId, { status: "uploading" })
      await uploadToGcs(uploadUrl, file, mimeType, (progress) => update(localId, { progress }))

      update(localId, { status: "confirming" })
      // Not merging this response into the list cache — its `uploaded_by`
      // shape differs from list's (bare id vs resolved object), per the
      // confirmed contract. Invalidating and letting a real refetch happen
      // sidesteps reconciling two different shapes entirely.
      await completeUpload(fileId, workspaceId, file.name)

      update(localId, { status: "completed" })
      queryClient.invalidateQueries({ queryKey: ["workspace-files", workspaceId] })
    } catch (err) {
      const message =
        err instanceof FileTooLargeError ? err.message :
        err instanceof Error ? err.message : "Upload failed."
      update(localId, { status: "failed", error: message })
    }
  }

  function dismiss(id: string) {
    setUploads((prev) => prev.filter((u) => u.id !== id))
  }

  return { uploads, upload, dismiss }
}