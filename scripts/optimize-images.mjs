import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const ORIGEM = 'assets-origem'
const SAIDA = 'public/images'
const LARGURAS = [640, 900, 1280]

// Os crops removem elementos que atrapalham a leitura da foto.
// top/height sao em pixels da imagem original.
const FOTOS = [
  {
    arquivo: 'piscina2.jpg',
    slug: 'piscina-deck-spa',
    larguraNativa: 1200,
    crop: null, // enquadramento cheio
  },
  {
    arquivo: 'piscina1.jpg',
    slug: 'piscina-azulejo-verde',
    larguraNativa: 1200,
    crop: { left: 0, top: 540, width: 1200, height: 1060 }, // remove a capa azul no deck
  },
  {
    arquivo: 'piscina3.jpg',
    slug: 'piscina-jardim',
    larguraNativa: 900,
    crop: { left: 0, top: 260, width: 900, height: 1340 }, // reduz o flare de sol
  },
  {
    arquivo: 'piscina4.jpg',
    slug: 'piscina-condominio',
    larguraNativa: 900,
    crop: { left: 0, top: 330, width: 900, height: 1270 }, // remove carros e casas vizinhas
  },
]

await mkdir(SAIDA, { recursive: true })

for (const foto of FOTOS) {
  for (const largura of LARGURAS) {
    // Nunca fazer upscale acima da largura nativa.
    if (largura > foto.larguraNativa) continue

    let pipeline = sharp(`${ORIGEM}/${foto.arquivo}`)
    if (foto.crop) pipeline = pipeline.extract(foto.crop)

    await pipeline
      .resize({ width: largura })
      .webp({ quality: 82 })
      .toFile(`${SAIDA}/${foto.slug}-${largura}.webp`)

    console.log(`gerado ${foto.slug}-${largura}.webp`)
  }
}

// Imagem de Open Graph: recorte paisagem de 1200x630 a partir da foto principal.
await sharp(`${ORIGEM}/piscina2.jpg`)
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
  .jpeg({ quality: 84 })
  .toFile('public/og.jpg')

console.log('gerado og.jpg')
