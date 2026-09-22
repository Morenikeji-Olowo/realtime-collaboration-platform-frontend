import * as React from "react"
import { useCurrentUser } from "@/features/users/hooks/use-current-user"
import { useMembers } from "@/features/members/hooks/use-members"
import { getInitials } from "@/features/users/lib/get-initials"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { Message } from "@/features/chat/types/message"

export function MessageList({
  workspaceId,
  messages,
  isLoading,
}: {
  workspaceId: string
  messages: Message[] | undefined
  isLoading: boolean
}) {
  const { data: currentUser } = useCurrentUser()
  const { data: members } = useMembers(workspaceId)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages?.length])

  function resolveSender(message: Message) {
    const member = members?.find((m) => m.id === message.sender_id)
    if (member) return { name: member.name }
    if (message.sender_id === currentUser?.id) return { name: currentUser.name }
    return { name: message.sender_email ?? "Unknown" }
  }

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-2/3 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-auto p-4">
      {messages?.map((message) => {
        const isOwn = message.sender_id === currentUser?.id
        const sender = resolveSender(message)

        return (
          <div key={message.id} className={`flex max-w-sm gap-2 ${isOwn ? "flex-row-reverse self-end" : "self-start"}`}>
            <Avatar className="size-7 shrink-0">
              <AvatarFallback className="text-xs">{getInitials(sender.name)}</AvatarFallback>
            </Avatar>
            <div className={`rounded-lg px-3 py-2 text-sm ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {!isOwn && <p className="mb-0.5 text-xs font-medium opacity-70">{sender.name}</p>}
              <p>{message.content}</p>
              <p className="mt-1 text-[10px] tabular-nums opacity-60">
                {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}