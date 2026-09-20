import { useContextPanel } from "@/app/context-panel"
import { Button } from "@/components/ui/button"

export function DocumentEditor() {
  const { open } = useContextPanel()
  return (
    <div className="p-8">
      <Button
        onClick={() =>
          open([
            { value: "comments", label: "Comments", content: "Comments slot" },
            { value: "history", label: "History", content: "History slot" },
            { value: "people", label: "People", content: "People slot" },
          ])
        }
      >
        Open context panel
      </Button>
    </div>
  )
}