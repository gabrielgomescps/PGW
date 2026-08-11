import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { Logo } from '../Logo'

export function Footer() {
  return (
    <footer className="bg-navy px-6 py-14 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <Logo variante="clara" />
          <p className="mt-4 max-w-xs text-sm text-prata">
            Limpeza e manutenção de piscinas em {site.regiao}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-turquesa">Contato</h3>
          <a href={site.telefoneHref} className="mt-4 block text-lg font-semibold hover:text-turquesa">
            {site.telefoneExibido}
          </a>
          <p className="mt-2 text-sm text-prata">{site.regiao}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-turquesa">Navegação</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/servicos" className="text-prata hover:text-white">Serviços</Link></li>
            <li><Link to="/sobre" className="text-prata hover:text-white">Sobre</Link></li>
            <li><Link to="/contato" className="text-prata hover:text-white">Contato</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-6xl border-t border-white/10 pt-6 text-xs text-prata">
        © {new Date().getFullYear()} {site.nome}. Todos os direitos reservados.
      </div>
    </footer>
  )
}
