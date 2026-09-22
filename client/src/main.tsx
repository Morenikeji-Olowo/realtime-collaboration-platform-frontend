import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/api/query-client'
import { ThemeProvider } from '@/app/theme-provider'
import { AppRouter } from '@/app/router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthBootstrap } from '@/app/auth-bootstrap'
import { Toaster } from '@/components/ui/sonner'
import { SocketProvider } from '@/app/socket-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <AuthBootstrap>
            <SocketProvider>
              <AppRouter />
            </SocketProvider>
          </AuthBootstrap>
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
    <Toaster />
  </StrictMode>,
)