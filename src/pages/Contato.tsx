import { useState } from 'react'
import { site } from '../content/site'
import { formToMessage, whatsappUrl, type ContatoForm } from '../lib/whatsapp'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'

const VAZIO: ContatoForm = { nome: '', telefone: '', bairro: '', mensagem: '' }

export default function Contato() {
  const [form, setForm] = useState<ContatoForm>(VAZIO)

  function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    window.open(whatsappUrl(formToMessage(form)), '_blank', 'noopener,noreferrer')
  }

  function campo(nome: keyof ContatoForm) {
    return {
      value: form[nome] ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [nome]: e.target.value })),
    }
  }

  const classeCampo =
    'mt-2 w-full rounded-lg border border-prata px-4 py-3 focus:border-turquesa focus:outline-2 focus:outline-offset-2 focus:outline-navy'

  return (
    <>
      <title>Contato | PGW Piscinas Campinas</title>
      <meta
        name="description"
        content={`Fale com a PGW Piscinas no WhatsApp ${site.telefoneExibido}. Atendimento em Campinas e região.`}
      />

      <Section className="bg-navy text-white">
        <Reveal className="max-w-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Falar com a PGW</h1>
          <p className="mt-5 text-lg text-prata">
            O jeito mais rápido é o WhatsApp. Se preferir, preencha o formulário — ele abre a
            conversa já com os seus dados escritos.
          </p>
          <div className="mt-9">
            <Button pulse mensagem="Olá, PGW! Vim pelo site e quero um orçamento.">
              Falar no WhatsApp
            </Button>
          </div>
        </Reveal>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal className="space-y-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-navy/70">Telefone</h2>
              <a
                href={site.telefoneHref}
                className="mt-2 block text-2xl font-bold underline-offset-4 hover:underline"
              >
                {site.telefoneExibido}
              </a>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-navy/70">
                Área de atuação
              </h2>
              <p className="mt-2 text-lg">{site.regiao}</p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form onSubmit={aoEnviar} className="rounded-2xl border border-prata p-8">
              <label className="block text-sm font-semibold">
                Nome
                <input required className={classeCampo} {...campo('nome')} />
              </label>
              <label className="mt-5 block text-sm font-semibold">
                Telefone
                <input required type="tel" className={classeCampo} {...campo('telefone')} />
              </label>
              <label className="mt-5 block text-sm font-semibold">
                Bairro
                <input className={classeCampo} {...campo('bairro')} />
              </label>
              <label className="mt-5 block text-sm font-semibold">
                Mensagem
                <textarea rows={4} className={classeCampo} {...campo('mensagem')} />
              </label>
              <button
                type="submit"
                className="mt-7 w-full rounded-full bg-navy px-8 py-4 font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                Abrir conversa no WhatsApp
              </button>
              <p className="mt-4 text-xs text-navy/60">
                Nada é enviado por aqui. O botão abre o WhatsApp com a sua mensagem pronta.
              </p>
            </form>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
