import { motion } from 'framer-motion'
import { whatsappUrl } from '../lib/whatsapp'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export function WhatsAppFab() {
  const reduzido = usePrefersReducedMotion()

  return (
    <motion.a
      href={whatsappUrl('Olá, PGW! Vim pelo site e quero um orçamento.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a PGW no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-turquesa text-navy shadow-lg"
      whileHover={reduzido ? undefined : { scale: 1.08 }}
      animate={
        reduzido
          ? undefined
          : { boxShadow: ['0 0 0 0 rgba(23,195,224,0.5)', '0 0 0 16px rgba(23,195,224,0)'] }
      }
      transition={reduzido ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.25.69-1.44 1.32-1.99 1.36-.53.05-1.02.24-3.45-.72-2.9-1.15-4.75-4.1-4.9-4.29-.14-.19-1.17-1.56-1.17-2.97s.74-2.11 1-2.4c.26-.29.57-.36.76-.36l.54.01c.18.01.42-.07.65.5.25.6.84 2.07.91 2.22.07.15.12.32.02.51-.1.19-.15.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.29-.13.57.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.41.29.15.45.12.62-.07.17-.19.71-.83.9-1.12.19-.29.38-.24.64-.14.26.09 1.66.78 1.94.93.29.14.48.21.55.33.07.12.07.69-.18 1.38Z" />
      </svg>
    </motion.a>
  )
}
