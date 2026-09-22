import * as React from "react"
import { SendIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function MessageComposer({
  onSend,
  isSending,
}: {
  onSend: (content: string) => Promise<{ success: boolean; error?: string }>
  isSending: boolean
}) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  async function handleSend() {
    const content = value.trim()
    if (!content) return
    setError(null)
    const res = await onSend(content)
    if (res.success) setValue("")
    else setError(res.error ?? "Failed to send message.")
  }

  return (
    <div className="border-t p-3">
      {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <Button size="icon" onClick={handleSend} disabled={isSending || !value.trim()}>
          <SendIcon />
        </Button>
      </div>
    </div>
  )
}