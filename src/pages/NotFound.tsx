import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Section } from '../components/ui/Section'

export default function NotFound() {
  return (
    <>
      <title>Página não encontrada | PGW Piscinas</title>
      <meta name="robots" content="noindex" />
      <Section className="bg-navy text-center text-white">
        <p className="text-6xl font-extrabold text-turquesa">404</p>
        <h1 className="mt-4 text-3xl font-bold">Essa página não existe</h1>
        <p className="mt-3 text-prata">O link pode estar errado ou a página pode ter saído do ar.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/">
            <span className="inline-flex items-center justify-center rounded-full bg-turquesa px-8 py-4 font-semibold text-navy">
              Voltar para o início
            </span>
          </Link>
          <Button variante="secundaria" mensagem="Olá, PGW! Vim pelo site.">
            Falar no WhatsApp
          </Button>
        </div>
      </Section>
    </>
  )
}
