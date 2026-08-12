import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

export function TrustBadges() {
  return (
    <Section className="bg-navy text-white">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {site.selos.map((selo, i) => (
          <Reveal key={selo.titulo} delay={i * 0.08}>
            <div className="flex h-full items-start gap-3 rounded-xl border border-white/10 p-6">
              <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-turquesa" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-semibold">{selo.titulo}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
