import type { Editor } from "@tiptap/react"
import { BoldIcon, ItalicIcon, Heading1Icon, Heading2Icon, ListIcon, ListOrderedIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center gap-1 border-b p-2">
      <Button
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon />
      </Button>
      <Button
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-5" />
      <Button
        variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1Icon />
      </Button>
      <Button
        variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2Icon />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-5" />
      <Button
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon />
      </Button>
      <Button
        variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon />
      </Button>
    </div>
  )
}