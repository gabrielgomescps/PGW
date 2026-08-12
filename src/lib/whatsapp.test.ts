import { describe, expect, it } from 'vitest'
import { formToMessage, whatsappUrl } from './whatsapp'

describe('whatsappUrl', () => {
  it('retorna a url base quando nao ha mensagem', () => {
    expect(whatsappUrl()).toBe('https://wa.me/5519992715025')
  })

  it('retorna a url base quando a mensagem e so espaco em branco', () => {
    expect(whatsappUrl('   ')).toBe('https://wa.me/5519992715025')
  })

  it('codifica acentos e quebras de linha', () => {
    expect(whatsappUrl('Olá\nManutenção')).toBe(
      'https://wa.me/5519992715025?text=Ol%C3%A1%0AManuten%C3%A7%C3%A3o',
    )
  })
})

describe('formToMessage', () => {
  it('monta a mensagem com todos os campos preenchidos', () => {
    const texto = formToMessage({
      nome: 'Gabriel',
      telefone: '(19) 90000-0000',
      bairro: 'Cambuí',
      mensagem: 'Minha piscina está verde.',
    })

    expect(texto).toBe(
      [
        'Olá, PGW! Vim pelo site.',
        '',
        'Nome: Gabriel',
        'Telefone: (19) 90000-0000',
        'Bairro: Cambuí',
        '',
        'Minha piscina está verde.',
      ].join('\n'),
    )
  })

  it('omite campos opcionais vazios sem deixar linha orfa', () => {
    const texto = formToMessage({
      nome: 'Gabriel',
      telefone: '(19) 90000-0000',
      bairro: '   ',
      mensagem: '',
    })

    expect(texto).toBe(
      ['Olá, PGW! Vim pelo site.', '', 'Nome: Gabriel', 'Telefone: (19) 90000-0000'].join('\n'),
    )
    expect(texto.endsWith('\n')).toBe(false)
  })
})
