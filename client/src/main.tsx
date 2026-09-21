import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/api/query-client'
import { ThemeProvider } from '@/app/theme-provider'
import { AppRouter } from '@/app/router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthBootstrap } from '@/app/auth-bootstrap'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <AuthBootstrap>
            <AppRouter />
          </AuthBootstrap>
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
)