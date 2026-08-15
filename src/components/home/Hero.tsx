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

  // Pre-carrega as fotos 2 a 4 para o primeiro crossfade nao cair num quadro vazio.
  useEffect(() => {
    fotos.slice(1).forEach((foto) => {
      const img = new Image()
      img.src = `/images/${foto.slug}-hero-900.webp`
    })
  }, [fotos])

  const foto = fotos[indice]

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden lg:min-h-[calc(100svh-5.5rem)]">
      {/* Foto de fundo, cobrindo a secao inteira em qualquer largura */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.img
            key={foto.slug}
            src={`/images/${foto.slug}-hero-900.webp`}
            srcSet={srcSetDe(foto.slug, foto.larguraNativa, 'hero')}
            sizes="100vw"
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
        {/* Dois layouts, dois gradientes, ambos medidos com mascara de glifo
            sobre as 4 fotos. No mobile o texto ocupa a largura toda, entao a
            camada horizontal nao ajudaria (ela chega a zero justo onde as
            linhas terminam) e o vertical precisa ser mais forte: 30/75/95 da
            minimo 4,47:1. No desktop o texto fica a esquerda, entao a camada
            horizontal carrega o contraste e a vertical pode ser leve: o par
            abaixo da minimo 5,41:1. Escurecer mais que isso so esconde a
            foto sem ganho de legibilidade. */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/75 to-navy/30 lg:from-navy/85 lg:via-navy/55 lg:to-navy/15" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-navy/70 via-navy/35 to-transparent lg:block" />
      </div>

      {/* Texto por cima da foto */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 py-24 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold uppercase tracking-[0.2em] text-turquesa"
        >
          {site.regiao}
        </motion.p>

        {/* Escala medida, nao escolhida a olho: a frase mais longa precisa de
            579px a 36px, 771px a 48px e 964px a 60px. Cada passo so sobe
            quando a largura util do container comporta a frase numa linha. */}
        <h1 className="mt-5 max-w-5xl text-4xl font-extrabold leading-[1.1] text-white lg:text-5xl xl:text-6xl">
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
        className="absolute bottom-6 left-1/2 z-10 h-10 w-px -translate-x-1/2 bg-turquesa"
        animate={reduzido ? undefined : { opacity: [0.2, 1, 0.2], scaleY: [0.6, 1, 0.6] }}
        transition={reduzido ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  )
}
