export type Workspace = {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
  role: "owner" | "member"
  member_count: number
}