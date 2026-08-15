import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const ORIGEM = 'assets-origem'
const SAIDA = 'public/images'
// 1200 e a largura nativa de piscina1/piscina2. Um tier acima disso seria
// descartado pela guarda anti-upscale e nunca geraria arquivo.
const LARGURAS = [640, 900, 1200]

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

// O hero e full-bleed e paisagem, mas as 4 fontes sao verticais de celular.
// Deixar o object-cover recortar na hora escolheria a faixa central as cegas;
// aqui o recorte e deliberado, mirando a agua e fugindo do que atrapalha
// (capa azul, carros dos vizinhos, flare de sol). Proporcao 3:2, que perde
// menos altura que 16:9 e ainda cobre a maioria das telas.
const HERO_PROPORCAO = 3 / 2
const HERO_TOPO = {
  'piscina-deck-spa': 480,
  'piscina-azulejo-verde': 620,
  'piscina-jardim': 420,
  'piscina-condominio': 470,
}

// O hero e a unica saida que faz upscale, e de proposito. A regra de nunca
// passar da largura nativa existe para a galeria, onde a foto aparece nitida
// e pequena. Num hero full-bleed de 1920px o upscale acontece de qualquer
// jeito: recusar aqui so transfere o trabalho para o navegador, que usa um
// filtro mais grosseiro. Fazer com lanczos3 e um sharpen leve entrega melhor
// resultado com a mesma informacao. Teto de 1600 para nao inflar o LCP.
const HERO_LARGURAS = [640, 900, 1200, 1600]

await mkdir(SAIDA, { recursive: true })

for (const foto of FOTOS) {
  const alturaHero = Math.round(foto.larguraNativa / HERO_PROPORCAO)
  const topo = HERO_TOPO[foto.slug]

  for (const largura of HERO_LARGURAS) {
    const ampliando = largura > foto.larguraNativa

    let p = sharp(`${ORIGEM}/${foto.arquivo}`)
      .extract({ left: 0, top: topo, width: foto.larguraNativa, height: alturaHero })
      .resize({ width: largura, kernel: 'lanczos3' })

    // Ampliacao borra; um sharpen leve devolve definicao sem virar artefato.
    if (ampliando) p = p.sharpen({ sigma: 0.8 })

    await p.webp({ quality: 82 }).toFile(`${SAIDA}/${foto.slug}-hero-${largura}.webp`)

    console.log(`gerado ${foto.slug}-hero-${largura}.webp${ampliando ? ' (ampliado)' : ''}`)
  }
}

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
