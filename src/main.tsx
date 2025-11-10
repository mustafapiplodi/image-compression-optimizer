import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider'
import { ErrorBoundary } from './components/error-boundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="image-compressor-theme">
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
