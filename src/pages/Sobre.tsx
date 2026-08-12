import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'

export default function Sobre() {
  return (
    <>
      <title>Sobre a PGW | Piscinas em Campinas</title>
      <meta
        name="description"
        content="A PGW Piscinas nasceu de um grupo de amigos em Campinas, com equipe própria e atendimento pessoal."
      />

      <Section className="bg-navy text-white">
        <Reveal className="max-w-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Sobre a PGW</h1>
          <p className="mt-5 text-lg text-prata">
            Um grupo de amigos que resolveu cuidar de piscina do jeito que gostaria que cuidassem da
            sua.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal className="space-y-5 text-lg leading-relaxed text-navy/80">
            <p>
              A PGW nasceu em Campinas, fundada por um grupo de amigos que já trabalhava com
              manutenção e cansou de ver o mesmo problema: piscina bonita no dia da visita e
              esquecida no resto da semana.
            </p>
            <p>
              A gente montou a PGW para resolver isso de um jeito simples. Equipe própria, sempre as
              mesmas pessoas na sua casa, dia combinado cumprido e resposta no WhatsApp quando você
              precisa. Sem central de atendimento, sem terceirizado diferente a cada semana.
            </p>
            <p>
              Ser uma equipe pequena é o nosso diferencial, não a nossa limitação: quem atende você
              conhece a sua piscina pelo nome.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-2xl border border-prata bg-prata/20 p-8">
              <h2 className="text-2xl font-bold">Quem está por trás da PGW</h2>
              <p className="mt-4 text-navy/70">
                Pedro, Gabriel e Wesley. As iniciais dos três amigos que fundaram a empresa são
                o nome dela.
              </p>
              <p className="mt-4 text-navy/70">
                É com eles que você fala no WhatsApp, e são eles que aparecem na sua casa no dia
                combinado.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16 text-center">
          <Button variante="inversa" mensagem="Olá, PGW! Vim pelo site e quero um orçamento.">
            Falar com a PGW no WhatsApp
          </Button>
        </Reveal>
      </Section>
    </>
  )
}
