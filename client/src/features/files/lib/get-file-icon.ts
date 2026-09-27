import {
  FileTextIcon, ImageIcon, FileVideoIcon, FileAudioIcon,
  FileSpreadsheetIcon, FileArchiveIcon, FileCode2Icon, FileIcon,
} from "lucide-react"

export function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return ImageIcon
  if (mimeType.startsWith("video/")) return FileVideoIcon
  if (mimeType.startsWith("audio/")) return FileAudioIcon
  if (mimeType.includes("spreadsheet") || mimeType.includes("csv") || mimeType.includes("excel")) return FileSpreadsheetIcon
  if (mimeType.includes("zip") || mimeType.includes("compressed") || mimeType.includes("archive")) return FileArchiveIcon
  if (mimeType.startsWith("text/") || mimeType.includes("json") || mimeType.includes("javascript")) return FileCode2Icon
  if (mimeType === "application/pdf" || mimeType.includes("document") || mimeType.includes("word")) return FileTextIcon
  return FileIcon
}