import { site } from '../../content/site'
import { srcSetDe } from '../../lib/imagens'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

export function Gallery() {
  return (
    <Section className="bg-white">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Piscinas que a PGW cuida</h2>
        <p className="mt-4 text-navy/70">Fotos reais de clientes atendidos em {site.regiao}.</p>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {site.fotos.map((foto, i) => (
          <Reveal key={foto.slug} delay={i * 0.08}>
            <img
              src={`/images/${foto.slug}-640.webp`}
              srcSet={srcSetDe(foto.slug, foto.larguraNativa)}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              alt={foto.alt}
              loading="lazy"
              className="aspect-[3/4] w-full rounded-2xl object-cover"
            />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
