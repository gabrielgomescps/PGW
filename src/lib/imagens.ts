// Precisa espelhar LARGURAS de scripts/optimize-images.mjs: sao os
// arquivos que existem em public/images.
const LARGURAS = [640, 900, 1200]
// Precisa espelhar HERO_LARGURAS de scripts/optimize-images.mjs.
const LARGURAS_HERO = [640, 900, 1200, 1600]

/**
 * Monta o srcset de uma foto, sem oferecer largura acima da nativa.
 *
 * `variante` seleciona um derivado gerado pelo script de imagens. Hoje existe
 * a variante `hero`, que e o recorte paisagem usado no hero full-bleed; sem
 * variante, sao os recortes verticais usados na galeria.
 */
export function srcSetDe(slug: string, larguraNativa: number, variante?: string): string {
  // O hero e gerado em todas as larguras, inclusive acima da nativa: num
  // fundo full-bleed o upscale acontece de qualquer forma, e o pipeline faz
  // melhor que o navegador. As demais variantes respeitam a largura nativa.
  const larguras = variante === 'hero' ? LARGURAS_HERO : LARGURAS.filter((l) => l <= larguraNativa)
  const sufixo = variante ? `-${variante}` : ''
  return larguras.map((l) => `/images/${slug}${sufixo}-${l}.webp ${l}w`).join(', ')
}
