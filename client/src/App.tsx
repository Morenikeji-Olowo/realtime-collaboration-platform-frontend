import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

function App() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <div className="flex min-h-svh items-center justify-center">
      <Button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
        Toggle theme ({resolvedTheme})
      </Button>
    </div>
  )
}

export default App