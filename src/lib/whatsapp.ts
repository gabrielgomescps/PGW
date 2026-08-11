export const WHATSAPP_NUMERO = '5519992715025'

export function whatsappUrl(mensagem?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`
  const texto = mensagem?.trim()
  if (!texto) return base
  return `${base}?text=${encodeURIComponent(texto)}`
}

export interface ContatoForm {
  nome: string
  telefone: string
  bairro?: string
  mensagem?: string
}

export function formToMessage(form: ContatoForm): string {
  const linhas = [
    'Olá, PGW! Vim pelo site.',
    '',
    `Nome: ${form.nome}`,
    `Telefone: ${form.telefone}`,
  ]

  const bairro = form.bairro?.trim()
  if (bairro) linhas.push(`Bairro: ${bairro}`)

  const mensagem = form.mensagem?.trim()
  if (mensagem) linhas.push('', mensagem)

  return linhas.join('\n')
}
