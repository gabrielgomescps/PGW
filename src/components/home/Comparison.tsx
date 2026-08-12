import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

export function Comparison() {
  return (
    <Section className="bg-white">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">A diferença no dia a dia</h2>
        <p className="mt-4 text-navy/70">
          A piscina não dá trabalho por ser piscina. Dá trabalho por ficar sem cuidado.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <Reveal className="rounded-2xl border border-prata bg-prata/20 p-8">
          <h3 className="text-lg font-bold uppercase tracking-wide text-navy/70">Sem a PGW</h3>
          <ul className="mt-6 space-y-5">
            {site.comparacao.map((par) => (
              <li key={par.sem} className="flex gap-3 text-navy/70">
                <svg viewBox="0 0 20 20" className="mt-1 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
                <span>{par.sem}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12} className="rounded-2xl bg-navy p-8 text-white shadow-xl">
          <h3 className="text-lg font-bold uppercase tracking-wide text-turquesa">Com a PGW</h3>
          <ul className="mt-6 space-y-5">
            {site.comparacao.map((par) => (
              <li key={par.com} className="flex gap-3">
                <svg viewBox="0 0 20 20" className="mt-1 h-5 w-5 shrink-0 text-turquesa" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{par.com}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
