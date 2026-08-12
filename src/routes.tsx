import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import Home from './pages/Home'
import Servicos from './pages/Servicos'
import Sobre from './pages/Sobre'
import Contato from './pages/Contato'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/servicos', element: <Servicos /> },
      { path: '/sobre', element: <Sobre /> },
      { path: '/contato', element: <Contato /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
