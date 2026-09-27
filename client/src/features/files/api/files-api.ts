import { apiFetch, ApiError } from "@/lib/api/client"
import { supabase } from "@/lib/supabase/client"
import { env } from "@/config/env"
import type { WorkspaceFile } from "@/features/files/types/workspace-file"

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB — same hard limit the backend enforces

export class FileTooLargeError extends Error {}

type UploadUrlResponse = {
  fileId: string
  uploadUrl: string
  mimeType: string
  expiresAt: string
}

export function requestUploadUrl(workspaceId: string, file: File) {
  if (file.size > MAX_FILE_SIZE) {
    return Promise.reject(new FileTooLargeError("File exceeds the 100 MB size limit"))
  }
  return apiFetch<UploadUrlResponse>(`/api/workspaces/${workspaceId}/files/upload-url`, {
    method: "POST",
    body: JSON.stringify({
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
    }),
  })
}

// Plain GCS PUT — no envelope, no auth header, this never touches our backend.
// Content-Type must be EXACTLY the mimeType the upload-url response returned
// (the signed URL is cryptographically bound to it), not necessarily the
// browser's own File.type, if those ever diverge.
export function uploadToGcs(
  uploadUrl: string,
  file: File,
  mimeType: string,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", uploadUrl)
    xhr.setRequestHeader("Content-Type", mimeType)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else reject(new Error(`Upload to storage failed (${xhr.status})`))
    }
    xhr.onerror = () => reject(new Error("Upload to storage failed"))
    xhr.send(file)
  })
}

export function completeUpload(fileId: string, workspaceId: string, originalName: string) {
  return apiFetch<WorkspaceFile & { workspace_id: string; storage_path: string; uploaded_by: string }>(
    `/api/files/${fileId}/complete`,
    {
      method: "POST",
      body: JSON.stringify({ workspaceId, originalName }),
    }
  )
}

export async function listFiles(workspaceId: string, before?: string) {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token
  const params = new URLSearchParams({ limit: "20" })
  if (before) params.set("before", before)

  const res = await fetch(`${env.VITE_API_URL}/api/workspaces/${workspaceId}/files?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const body: { success: true; data: WorkspaceFile[]; next_cursor: string | null } | { success: false; error: string } =
    await res.json()

  if (!body.success) throw new ApiError(body.error)
  return { files: body.data, nextCursor: body.next_cursor }
}

export function getDownloadUrl(fileId: string) {
  return apiFetch<{ downloadUrl: string; originalName: string; expiresAt: string }>(
    `/api/files/${fileId}/download-url`
  )
}

export function deleteFile(fileId: string) {
  return apiFetch<null>(`/api/files/${fileId}`, { method: "DELETE" })
}