import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Logo } from '../Logo'
import { Button } from '../ui/Button'

const LINKS = [
  { para: '/', rotulo: 'Início' },
  { para: '/servicos', rotulo: 'Serviços' },
  { para: '/sobre', rotulo: 'Sobre' },
  { para: '/contato', rotulo: 'Contato' },
]

export function Header() {
  const [aberto, setAberto] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" onClick={() => setAberto(false)}>
          <Logo variante="clara" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.para}
              to={link.para}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? 'text-turquesa' : 'text-white hover:text-turquesa'
                }`
              }
            >
              {link.rotulo}
            </NavLink>
          ))}
          <Button mensagem="Olá, PGW! Vim pelo site e quero um orçamento." className="px-6 py-3 text-sm">
            WhatsApp
          </Button>
        </nav>

        <button
          type="button"
          className="text-white md:hidden"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
          onClick={() => setAberto((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
            {aberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {aberto && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-6 pb-6 pt-2 md:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.para}
              to={link.para}
              onClick={() => setAberto(false)}
              className={({ isActive }) =>
                `py-3 text-base font-semibold ${isActive ? 'text-turquesa' : 'text-white'}`
              }
            >
              {link.rotulo}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
