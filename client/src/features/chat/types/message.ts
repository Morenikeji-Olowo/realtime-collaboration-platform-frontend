export type Message = {
  id: string
  sender_id: string
  content: string
  created_at: string
  workspace_id?: string
  sender_email?: string
}