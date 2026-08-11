import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { whatsappUrl } from '../../lib/whatsapp'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Props {
  children: ReactNode
  /** 'whatsapp' monta o href a partir de `mensagem`; 'link' usa `href` direto. */
  as?: 'whatsapp' | 'link'
  href?: string
  mensagem?: string
  variante?: 'primaria' | 'secundaria'
  pulse?: boolean
  className?: string
}

const ESTILOS = {
  primaria: 'bg-turquesa text-navy hover:shadow-[0_12px_34px_-10px_var(--color-turquesa)]',
  secundaria: 'border-2 border-white/40 text-white hover:border-turquesa hover:text-turquesa',
} as const

export function Button({
  children,
  as = 'whatsapp',
  href,
  mensagem,
  variante = 'primaria',
  pulse = false,
  className = '',
}: Props) {
  const reduzido = usePrefersReducedMotion()
  const destino = as === 'whatsapp' ? whatsappUrl(mensagem) : (href ?? '#')
  const externo = as === 'whatsapp'

  return (
    <motion.a
      href={destino}
      target={externo ? '_blank' : undefined}
      rel={externo ? 'noopener noreferrer' : undefined}
      whileHover={reduzido ? undefined : { scale: 1.03 }}
      whileTap={reduzido ? undefined : { scale: 0.98 }}
      animate={
        pulse && !reduzido
          ? { boxShadow: ['0 0 0 0 rgba(23,195,224,0.45)', '0 0 0 14px rgba(23,195,224,0)'] }
          : undefined
      }
      transition={
        pulse && !reduzido ? { duration: 2, repeat: Infinity, ease: 'easeOut' } : { duration: 0.2 }
      }
      className={`inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold transition-shadow ${ESTILOS[variante]} ${className}`}
    >
      {children}
    </motion.a>
  )
}
