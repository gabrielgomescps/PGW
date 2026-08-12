import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  id?: string
}

export function Section({ children, className = '', id }: Props) {
  return (
    <section id={id} className={`px-6 py-20 md:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}
