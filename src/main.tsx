import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="flex min-h-screen items-center justify-center bg-navy">
      <p className="text-2xl font-bold text-turquesa">PGW Piscinas</p>
    </div>
  </StrictMode>,
)
