// Precisa espelhar LARGURAS de scripts/optimize-images.mjs: sao os
// arquivos que existem em public/images.
const LARGURAS = [640, 900, 1200]

/** Monta o srcset de uma foto, sem oferecer largura acima da nativa. */
export function srcSetDe(slug: string, larguraNativa: number): string {
  return LARGURAS.filter((l) => l <= larguraNativa)
    .map((l) => `/images/${slug}-${l}.webp ${l}w`)
    .join(', ')
}
