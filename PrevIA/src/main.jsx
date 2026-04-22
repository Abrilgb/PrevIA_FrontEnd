import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import AnimatedRoutes from './components/AnimatedRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <ToastProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </ToastProvider>
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>,
)
