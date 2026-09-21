import { apiFetch } from "@/lib/api/client"
import type { Document } from "@/features/documents/types/document"

export function listDocuments(workspaceId: string) {
  return apiFetch<Document[]>(`/api/workspaces/${workspaceId}/documents`)
}

export function createDocument(workspaceId: string, title: string) {
  return apiFetch<Document>(`/api/workspaces/${workspaceId}/documents`, {
    method: "POST",
    body: JSON.stringify({ title }),
  })
}

export function renameDocument(documentId: string, title: string) {
  return apiFetch<Document>(`/api/documents/${documentId}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  })
}

export function deleteDocument(documentId: string) {
  return apiFetch<null>(`/api/documents/${documentId}`, {
    method: "DELETE",
  })
}