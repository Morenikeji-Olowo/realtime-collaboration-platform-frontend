import { UsersIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getInitials } from "@/features/users/lib/get-initials"
import type { Member } from "@/features/members/types/member"

export function MemberList({
  members,
  isLoading,
}: {
  members: Member[] | undefined
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    )
  }

  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
        <UsersIcon className="size-8" />
        <p>No members yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-3 rounded-lg border p-3">
          <Avatar>
            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{member.name}</p>
            <p className="truncate text-sm text-muted-foreground">{member.email}</p>
          </div>
          <Badge variant="secondary" className="capitalize">{member.role}</Badge>
        </div>
      ))}
    </div>
  )
}