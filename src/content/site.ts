import { WHATSAPP_NUMERO } from '../lib/whatsapp'

export interface Servico {
  slug: string
  titulo: string
  descricao: string
}

export interface Diferencial {
  titulo: string
  descricao: string
}

export interface Selo {
  titulo: string
}

export interface ParComparacao {
  sem: string
  com: string
}

export interface Foto {
  slug: string
  alt: string
  larguraNativa: number
}

export const site = {
  nome: 'PGW Piscinas',
  telefoneExibido: '(19) 99271-5025',
  // Derivado da constante, e nao literal: o numero existe num lugar so.
  telefoneHref: `tel:+${WHATSAPP_NUMERO}`,
  regiao: 'Campinas e região',

  servicos: [
    {
      slug: 'limpeza-periodica',
      titulo: 'Limpeza e manutenção periódica',
      descricao:
        'Visitas semanais ou quinzenais para aspirar o fundo, escovar as paredes, limpar a borda e a casa de máquinas. Sua piscina fica sempre pronta para uso, sem você marcar nada.',
    },
    {
      slug: 'tratamento-quimico',
      titulo: 'Tratamento químico',
      descricao:
        'Controle de pH, cloro e alcalinidade, com aplicação de algicida e clarificante na medida certa. Água equilibrada não arde o olho, não resseca a pele e não come o revestimento.',
    },
    {
      slug: 'manutencao-equipamentos',
      titulo: 'Manutenção preventiva de equipamentos',
      descricao:
        'Acompanhamento da bomba e do filtro, limpeza do pré-filtro e troca de areia quando chega a hora. Equipamento cuidado não queima no fim de semana de calor.',
    },
    {
      slug: 'agua-verde',
      titulo: 'Recuperação de água verde',
      descricao:
        'Piscina abandonada, esverdeada ou depois de temporal. Fazemos a limpeza pesada e o choque necessário para devolver a água cristalina, mesmo em caso mais crítico.',
    },
  ] satisfies Servico[],

  diferenciais: [
    {
      titulo: 'Água sempre cristalina',
      descricao: 'Você olha para a piscina e ela está pronta. Todo dia, não só no dia da visita.',
    },
    {
      titulo: 'Equipe própria e de confiança',
      descricao:
        'Quem entra na sua casa são sempre as mesmas pessoas. Nada de terceirizado diferente a cada semana.',
    },
    {
      titulo: 'Produtos de qualidade',
      descricao:
        'Linha profissional, na dosagem correta. Produto barato demais custa caro no revestimento.',
    },
    {
      titulo: 'Atendimento pontual, sem enrolação',
      descricao: 'Dia combinado é dia cumprido. E quando você chama no WhatsApp, alguém responde.',
    },
  ] satisfies Diferencial[],

  selos: [
    { titulo: 'Atendimento em Campinas e região' },
    { titulo: 'Equipe própria, sem terceirização' },
    { titulo: 'Sem fidelidade e sem multa' },
    { titulo: 'Produtos de linha profissional' },
  ] satisfies Selo[],

  comparacao: [
    {
      sem: 'Água turva justo no dia em que chega visita',
      com: 'Água cristalina o ano todo, sem você pensar nisso',
    },
    {
      sem: 'Seu fim de semana comprando cloro e medindo pH',
      com: 'Tratamento químico feito por quem entende',
    },
    {
      sem: 'A bomba queima e vira gasto de emergência',
      com: 'Manutenção preventiva de bomba e filtro',
    },
    {
      sem: 'Prestador que some e não responde mensagem',
      com: 'Atendimento pontual e resposta no WhatsApp',
    },
    {
      sem: 'Um técnico diferente a cada visita',
      com: 'Equipe própria, sempre as mesmas pessoas',
    },
  ] satisfies ParComparacao[],

  fotos: [
    {
      slug: 'piscina-deck-spa',
      alt: 'Piscina com deck de madeira e spa integrado, revestida em azulejo verde-água',
      larguraNativa: 1200,
    },
    {
      slug: 'piscina-azulejo-verde',
      alt: 'Piscina alongada em azulejo verde-água ao lado de deck de madeira',
      larguraNativa: 1200,
    },
    {
      slug: 'piscina-jardim',
      alt: 'Piscina residencial ampla com jardim arborizado ao fundo',
      larguraNativa: 900,
    },
    {
      slug: 'piscina-condominio',
      alt: 'Piscina revestida em pastilha azul com escada de inox',
      larguraNativa: 900,
    },
  ] satisfies Foto[],
}
