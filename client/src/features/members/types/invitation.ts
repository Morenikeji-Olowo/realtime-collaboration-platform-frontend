export type Invitation = {
  id: string
  workspace_id: string
  inviter_id: string
  invited_email: string
  invited_user_id: string | null
  status: string
  created_at: string
  expires_at: string
  email_sent: boolean
}