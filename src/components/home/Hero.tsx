import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { site } from '../../content/site'
import { srcSetDe } from '../../lib/imagens'
import { Button } from '../ui/Button'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const INTERVALO_MS = 8000
const CROSSFADE_S = 1.2

export function Hero() {
  const [indice, setIndice] = useState(0)
  const reduzido = usePrefersReducedMotion()
  const fotos = site.fotos

  useEffect(() => {
    const id = setInterval(() => setIndice((i) => (i + 1) % fotos.length), INTERVALO_MS)
    return () => clearInterval(id)
  }, [fotos.length])

  // Pre-carrega as fotos 2 a 4 para o primeiro crossfade nao cair num painel vazio.
  useEffect(() => {
    fotos.slice(1).forEach((foto) => {
      const img = new Image()
      img.src = `/images/${foto.slug}-900.webp`
    })
  }, [fotos])

  const foto = fotos[indice]

  return (
    <section className="relative grid min-h-[100svh] lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2">
      {/* Painel de foto: fundo full-bleed no mobile, coluna da direita no desktop */}
      <div className="absolute inset-0 overflow-hidden lg:relative lg:order-2 lg:col-span-1">
        <AnimatePresence initial={false}>
          <motion.img
            key={foto.slug}
            src={`/images/${foto.slug}-900.webp`}
            srcSet={srcSetDe(foto.slug, foto.larguraNativa)}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt={foto.alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: reduzido ? 1 : 1.08 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: reduzido ? 0.2 : CROSSFADE_S },
              scale: { duration: INTERVALO_MS / 1000, ease: 'linear' },
            }}
          />
        </AnimatePresence>
        {/* Escurece a foto no mobile, onde o texto fica por cima dela */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/20 lg:hidden" />
      </div>

      {/* Coluna de texto */}
      <div className="relative z-10 flex flex-col justify-center px-6 py-24 lg:order-1 lg:bg-navy lg:px-14">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold uppercase tracking-[0.2em] text-turquesa"
        >
          {site.regiao}
        </motion.p>

        <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
          {['Piscina sempre cristalina.', 'Sem você precisar pensar nisso.'].map((linha, i) => (
            <motion.span
              key={linha}
              className="block"
              initial={reduzido ? { opacity: 1 } : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduzido ? 0 : 0.6, delay: reduzido ? 0 : i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {linha}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={reduzido ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduzido ? 0 : 0.6, delay: reduzido ? 0 : 0.3 }}
          className="mt-6 max-w-md text-lg text-prata"
        >
          Limpeza e manutenção de piscinas com equipe própria em {site.regiao}. Você usa, a gente
          cuida.
        </motion.p>

        <motion.div
          initial={reduzido ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduzido ? 0 : 0.6, delay: reduzido ? 0 : 0.5 }}
          className="mt-10"
        >
          <Button pulse mensagem="Olá, PGW! Vim pelo site e quero um orçamento.">
            Falar com a PGW no WhatsApp
          </Button>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 z-10 h-10 w-px -translate-x-1/2 bg-turquesa lg:left-14 lg:translate-x-0"
        animate={reduzido ? undefined : { opacity: [0.2, 1, 0.2], scaleY: [0.6, 1, 0.6] }}
        transition={reduzido ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  )
}
