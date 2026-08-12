import { useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppFab } from '../WhatsAppFab'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export function RootLayout() {
  const location = useLocation()

  // useOutlet e nao <Outlet />: o Outlet assina o contexto do router e
  // re-renderiza com a rota nova na hora, por dentro do AnimatePresence.
  // O conteudo trocaria em ~10ms e o fade de 200ms animaria uma div cujo
  // conteudo ja mudou. Capturar o elemento aqui e o que faz a saida
  // esperar de verdade.
  const outlet = useOutlet()
  const reduzido = usePrefersReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={reduzido ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduzido ? 0 : 0.2 }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  )
}
