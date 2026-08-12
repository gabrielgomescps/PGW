import { site } from '../content/site'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'

export default function Servicos() {
  return (
    <>
      <title>Serviços | PGW Piscinas Campinas</title>
      <meta
        name="description"
        content="Limpeza periódica, tratamento químico, manutenção de bomba e filtro e recuperação de água verde em Campinas e região."
      />

      <Section className="bg-navy text-white">
        <Reveal className="max-w-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Serviços</h1>
          <p className="mt-5 text-lg text-prata">
            Cuidamos da piscina inteira: da água ao equipamento. Atendimento em {site.regiao}.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {site.servicos.map((servico, i) => (
            <Reveal key={servico.slug} delay={i * 0.1}>
              <article className="flex h-full flex-col rounded-2xl border border-prata p-8">
                <div className="h-1 w-10 rounded-full bg-turquesa" />
                <h2 className="mt-5 text-xl font-bold">{servico.titulo}</h2>
                <p className="mt-4 flex-1 leading-relaxed text-navy/70">{servico.descricao}</p>
                <div className="mt-7">
                  <Button
                    variante="inversa"
                    mensagem={`Olá, PGW! Vim pelo site e quero saber sobre: ${servico.titulo}.`}
                    className="px-6 py-3 text-sm"
                  >
                    Pedir orçamento
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
