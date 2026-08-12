import { Hero } from '../components/home/Hero'
import { Comparison } from '../components/home/Comparison'
import { Differentials } from '../components/home/Differentials'
import { Gallery } from '../components/home/Gallery'
import { TrustBadges } from '../components/home/TrustBadges'
import { FinalCta } from '../components/home/FinalCta'

export default function Home() {
  return (
    <>
      <title>PGW Piscinas | Limpeza e manutenção de piscina em Campinas</title>
      <meta
        name="description"
        content="Limpeza e manutenção de piscina em Campinas e região. Equipe própria, sem fidelidade e água cristalina o ano todo. Peça seu orçamento no WhatsApp."
      />
      <Hero />
      <Comparison />
      <Differentials />
      <Gallery />
      <TrustBadges />
      <FinalCta />
    </>
  )
}
