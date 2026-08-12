import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

export function Differentials() {
  return (
    <Section className="bg-prata/20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Por que a PGW</h2>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {site.diferenciais.map((item, i) => (
          <Reveal key={item.titulo} delay={i * 0.1}>
            <article className="h-full rounded-2xl border border-prata bg-white p-7">
              <div className="h-1 w-10 rounded-full bg-turquesa" />
              <h3 className="mt-5 text-lg font-bold">{item.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/70">{item.descricao}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
