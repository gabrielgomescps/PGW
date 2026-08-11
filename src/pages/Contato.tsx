import { site } from '../content/site'

export default function Contato() {
  return (
    <>
      <title>Contato | PGW Piscinas Campinas</title>
      <meta
        name="description"
        content={`Fale com a PGW Piscinas no WhatsApp ${site.telefoneExibido}. Atendimento em Campinas e região.`}
      />
    </>
  )
}
