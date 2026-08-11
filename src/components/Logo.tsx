interface Props {
  variante?: 'clara' | 'escura'
  className?: string
}

export function Logo({ variante = 'clara', className = '' }: Props) {
  const corTexto = variante === 'clara' ? 'text-white' : 'text-navy'
  const corSub = variante === 'clara' ? 'text-prata' : 'text-navy/60'

  return (
    <span className={`inline-flex flex-col leading-none ${className}`} aria-label="PGW Piscinas">
      <span className={`text-2xl font-extrabold tracking-tight ${corTexto}`}>PGW</span>
      <svg viewBox="0 0 60 6" className="my-1 h-1.5 w-14" aria-hidden="true">
        <path
          d="M1 3c4-3 8-3 12 0s8 3 12 0 8-3 12 0 8 3 12 0"
          stroke="#17C3E0"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span className={`text-[0.6rem] font-semibold uppercase tracking-[0.3em] ${corSub}`}>
        Piscinas
      </span>
    </span>
  )
}
