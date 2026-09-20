import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from '@/app/theme-provider'
import { AppRouter } from '@/app/router'
import { TooltipProvider } from '@/components/ui/tooltip'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <AppRouter />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
)