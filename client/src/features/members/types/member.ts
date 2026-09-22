export type Member = {
  id: string
  name: string
  email: string
  role: "owner" | "member"
  joined_at: string
}