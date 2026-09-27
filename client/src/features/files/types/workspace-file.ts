export type WorkspaceFile = {
  id: string
  original_name: string
  mime_type: string
  size_bytes: number
  uploaded_by: { id: string; name: string; email: string }
  created_at: string
}