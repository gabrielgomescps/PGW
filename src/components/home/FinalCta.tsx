import { site } from '../../content/site'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

export function FinalCta() {
  return (
    <Section className="bg-turquesa">
      <Reveal className="mx-auto max-w-2xl text-center text-navy">
        <h2 className="text-3xl font-bold sm:text-4xl">Quer a piscina pronta o ano todo?</h2>
        <p className="mt-4 text-navy/80">
          Chame no WhatsApp e receba um orçamento para a sua piscina. Atendemos {site.regiao}.
        </p>
        <div className="mt-9 flex justify-center">
          <Button
            mensagem="Olá, PGW! Vim pelo site e quero um orçamento."
            className="bg-navy text-white"
          >
            Falar com a PGW no WhatsApp
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}
