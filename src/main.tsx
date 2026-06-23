import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'

import { AppProvider } from './app/AppProvider'
import { AppRoutes } from './routes/AppRoutes'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HelmetProvider>
  </StrictMode>
)
