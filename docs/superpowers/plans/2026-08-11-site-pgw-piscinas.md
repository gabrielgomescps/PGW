# Site PGW Piscinas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o site institucional de 4 páginas da PGW Piscinas, com hero animado e todo o caminho de conversão levando ao WhatsApp.

**Architecture:** SPA em Vite + React 19 + React Router v7, sem back-end. Todo dado de negócio (telefone, serviços, selos, fotos) vive num único módulo `content/site.ts`; a única lógica não trivial é a construção de links de WhatsApp em `lib/whatsapp.ts`, coberta por testes. As animações do Framer Motion são centralizadas num componente `Reveal` e num hook `usePrefersReducedMotion`.

**Tech Stack:** Vite · React 19 · TypeScript · React Router v7 (`react-router-dom`) · Tailwind CSS v4 (`@tailwindcss/vite`) · Framer Motion · Vitest · sharp (devDependency, só para o script de imagens) · Vercel.

## Global Constraints

Estes valores valem para **todas** as tarefas. Copiados literalmente da spec.

- **Paleta, exata:** navy `#0B2545`, turquesa `#17C3E0`, branco `#FFFFFF`, prata `#C9D6DF`. Nenhuma outra cor de marca.
- **Tipografia:** Inter, via Google Fonts com `preconnect` e `display=swap`. Títulos 600/700, corpo 400.
- **WhatsApp:** número `5519992715025`. Telefone exibido: `(19) 99271-5025`. Em **código de produção** o número existe apenas como `WHATSAPP_NUMERO` em `src/lib/whatsapp.ts`, lido a partir dali por `src/content/site.ts`; nenhum componente ou página pode conter o número como literal. **Arquivos de teste são exceção explícita:** eles pinam o valor esperado à mão, de propósito. Montar a URL esperada a partir da própria constante tornaria o teste tautológico — trocar `WHATSAPP_NUMERO` por um número errado continuaria passando, e o site inteiro apontaria para o telefone errado sem nenhum teste falhar.
- **Tailwind v4:** paleta declarada em CSS via `@theme`. **Não** existe `tailwind.config.js` nem `postcss.config.js` neste projeto. Não rodar `npx tailwindcss init`, que foi removido na v4.
- **React 19:** `<title>` e `<meta name="description">` são declarados no JSX de cada página e hasteados pelo React. Não criar hook de SEO nem manipular `document.head`.
- **Reduced motion:** toda animação decorativa (Ken Burns, pulse, slide-up) deve ser desligada quando `prefers-reduced-motion: reduce` estiver ativo. Sempre via o hook `usePrefersReducedMotion`.
- **Conteúdo proibido:** nenhum depoimento de cliente (não existem reais). Nenhum preço. Nenhuma menção a "abertura e fechamento sazonal".
- **Idioma:** todo texto visível ao usuário em português do Brasil, com acentuação correta. Mensagens de commit em português, sem acento. No código a convenção é mista e deliberada: **nomes de componente, arquivo e hook em inglês** (`Hero`, `Gallery`, `TrustBadges`, `usePrefersReducedMotion`), seguindo a convenção do ecossistema React; **dados de domínio e variáveis locais em português sem acento** (`servicos`, `selos`, `comparacao`, `reduzido`, `indice`). Seguir exatamente os identificadores que aparecem no código de cada tarefa.
- **Imagens:** as 4 fotos de origem são verticais. Nunca esticar nem fazer upscale acima da largura nativa (1200px para piscina1/2, 900px para piscina3/4).

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/content/site.ts` | Fonte única: telefone, WhatsApp, serviços, selos, diferenciais, pares da comparação, metadados das fotos |
| `src/lib/whatsapp.ts` | Funções puras de construção de URL e serialização do formulário |
| `src/lib/whatsapp.test.ts` | Testes da única lógica não trivial do projeto |
| `src/lib/imagens.ts` | Monta o `srcset` das fotos sem oferecer largura acima da nativa |
| `src/hooks/usePrefersReducedMotion.ts` | Lê e observa a media query de movimento reduzido |
| `src/components/ui/Reveal.tsx` | Encapsula o padrão `whileInView` (fade + slide-up, stagger opcional) |
| `src/components/ui/Button.tsx` | Botão/link com as variantes de CTA |
| `src/components/ui/Section.tsx` | Espaçamento e largura máxima consistentes entre seções |
| `src/components/Logo.tsx` | Wordmark PGW, variantes clara e escura |
| `src/components/WhatsAppFab.tsx` | Botão flutuante fixo com pulse |
| `src/components/layout/RootLayout.tsx` | Shell: header, outlet com transição, footer, FAB, scroll-to-top |
| `src/components/layout/Header.tsx` | Navegação desktop e menu mobile |
| `src/components/layout/Footer.tsx` | Contato, área de atuação, navegação secundária |
| `src/components/home/Hero.tsx` | Hero split/full-bleed com crossfade e Ken Burns |
| `src/components/home/Comparison.tsx` | Seção Com PGW × Sem PGW |
| `src/components/home/Differentials.tsx` | 4 cards de diferenciais |
| `src/components/home/Gallery.tsx` | Grid das 4 fotos |
| `src/components/home/TrustBadges.tsx` | Faixa dos 4 selos |
| `src/components/home/FinalCta.tsx` | CTA de fechamento |
| `src/pages/*.tsx` | Home, Servicos, Sobre, Contato, NotFound |
| `src/routes.tsx` | Definição das rotas |
| `scripts/optimize-images.mjs` | Crop + WebP multi-resolução + geração da imagem OG |

---

## Task 1: Scaffold do projeto

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/index.css`, `src/vite-env.d.ts`
- Delete: arquivos de exemplo do template (`src/App.tsx`, `src/App.css`, `src/assets/react.svg`, `public/vite.svg`)

**Interfaces:**
- Consumes: nada
- Produces: projeto que roda `npm run dev`, `npm run build` e `npm test`; classes Tailwind `bg-navy`, `text-turquesa`, `border-prata` e a família `font-sans` disponíveis em todo o projeto

- [ ] **Step 1: Criar o projeto Vite na pasta existente**

O diretório `D:\Claude\PGW` já existe, já é um repositório git e já contém os 4 JPGs e `docs/`. Scaffoldar numa pasta temporária e mover o conteúdo evita que o Vite reclame de diretório não vazio.

```bash
cd "D:/Claude/PGW"
npm create vite@latest .tmp-scaffold -- --template react-ts
cp -r .tmp-scaffold/. .
rm -rf .tmp-scaffold
```

- [ ] **Step 2: Instalar as dependências**

```bash
cd "D:/Claude/PGW"
npm install
npm install react-router-dom framer-motion
npm install -D tailwindcss @tailwindcss/vite vitest sharp
```

Não instalar `postcss` nem `autoprefixer`: a Tailwind v4 não os usa neste setup.

- [ ] **Step 3: Remover os arquivos de exemplo do template**

```bash
cd "D:/Claude/PGW"
rm -f src/App.tsx src/App.css src/assets/react.svg public/vite.svg
rmdir src/assets 2>/dev/null || true
```

- [ ] **Step 4: Configurar Vite com Tailwind, React e Vitest**

Escrever `vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

O import vem de `vitest/config`, e não de `vite`, para que a chave `test` seja tipada.

- [ ] **Step 5: Declarar a paleta e a tipografia no CSS**

Escrever `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-navy: #0B2545;
  --color-turquesa: #17C3E0;
  --color-prata: #C9D6DF;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-white font-sans text-navy antialiased;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

Na Tailwind v4, cada `--color-*` declarado em `@theme` gera automaticamente `bg-*`, `text-*`, `border-*` e afins. É por isso que não existe `tailwind.config.js` aqui.

- [ ] **Step 6: Escrever o index.html com a fonte**

Escrever `index.html` (as meta tags de Open Graph entram na Task 10):

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
      rel="stylesheet"
    />
    <title>PGW Piscinas</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Escrever um main.tsx provisório**

Escrever `src/main.tsx`. Ele será substituído na Task 6, quando as rotas existirem; por ora serve para provar que o build e o Tailwind funcionam.

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="flex min-h-screen items-center justify-center bg-navy">
      <p className="text-2xl font-bold text-turquesa">PGW Piscinas</p>
    </div>
  </StrictMode>,
)
```

- [ ] **Step 8: Adicionar o script de teste ao package.json**

Em `package.json`, dentro de `"scripts"`, acrescentar:

```json
"test": "vitest run"
```

- [ ] **Step 9: Verificar que build e typecheck passam**

```bash
cd "D:/Claude/PGW" && npm run build
```

Esperado: build conclui sem erro e cria `dist/`. Se o TypeScript reclamar de `src/App.tsx` ausente, é porque o Step 3 não removeu alguma referência — conferir se `src/main.tsx` foi de fato sobrescrito pelo Step 7.

- [ ] **Step 10: Verificar visualmente que o Tailwind aplicou a paleta**

Subir o preview e confirmar fundo navy com o texto em turquesa. Se o texto aparecer preto sobre branco, o plugin do Tailwind não está ativo em `vite.config.ts`.

- [ ] **Step 11: Commit**

```bash
cd "D:/Claude/PGW"
git add -A
git commit -m "Scaffold do projeto com Vite, React 19, Tailwind v4 e Vitest"
```

---

## Task 2: Lógica de WhatsApp (TDD)

A única lógica não trivial do projeto, e a única com testes. Encoding de acento e quebra de linha em query string erra com facilidade e falha em silêncio — o sintoma é o cliente recebendo mensagem com caractere quebrado.

**Files:**
- Create: `src/lib/whatsapp.ts`
- Test: `src/lib/whatsapp.test.ts`

**Interfaces:**
- Consumes: nada
- Produces:
  - `WHATSAPP_NUMERO: string` — `'5519992715025'`
  - `whatsappUrl(mensagem?: string): string`
  - `interface ContatoForm { nome: string; telefone: string; bairro?: string; mensagem?: string }`
  - `formToMessage(form: ContatoForm): string`

- [ ] **Step 1: Escrever os testes que falham**

Escrever `src/lib/whatsapp.test.ts`:

```ts
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
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

```bash
cd "D:/Claude/PGW" && npx vitest run src/lib/whatsapp.test.ts
```

Esperado: FAIL — `Failed to resolve import "./whatsapp"`.

- [ ] **Step 3: Escrever a implementação mínima**

Escrever `src/lib/whatsapp.ts`:

```ts
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
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

```bash
cd "D:/Claude/PGW" && npx vitest run src/lib/whatsapp.test.ts
```

Esperado: PASS, 5 testes.

- [ ] **Step 5: Commit**

```bash
cd "D:/Claude/PGW"
git add src/lib/whatsapp.ts src/lib/whatsapp.test.ts
git commit -m "Adiciona construcao de link de WhatsApp com testes"
```

---

## Task 3: Conteúdo do site

Centraliza todo o texto e todo dado de negócio. Nenhum outro arquivo pode conter o telefone como literal.

**Files:**
- Create: `src/content/site.ts`

**Interfaces:**
- Consumes: `WHATSAPP_NUMERO` de `src/lib/whatsapp.ts`
- Produces: o objeto `site`, com as chaves `nome`, `telefoneExibido`, `telefoneHref`, `regiao`, `servicos`, `diferenciais`, `selos`, `comparacao`, `fotos`. Os tipos exportados `Servico`, `Diferencial`, `Selo`, `ParComparacao` e `Foto` são consumidos pelas Tasks 7, 8 e 9.

- [ ] **Step 1: Escrever o módulo de conteúdo**

Escrever `src/content/site.ts`:

```ts
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
```

Sem `as const` no objeto externo, de propósito: `as const` tornaria os arrays `readonly`, e um `readonly Servico[]` não satisfaz `Servico[]` — as cláusulas `satisfies` quebrariam na compilação. Elas já garantem a tipagem que interessa aqui.

- [ ] **Step 2: Verificar que o typecheck passa**

```bash
cd "D:/Claude/PGW" && npx tsc --noEmit
```

Esperado: nenhuma saída (sucesso).

- [ ] **Step 3: Commit**

```bash
cd "D:/Claude/PGW"
git add src/content/site.ts
git commit -m "Adiciona conteudo do site como fonte unica de verdade"
```

---

## Task 4: Pipeline de imagens

**Files:**
- Create: `scripts/optimize-images.mjs`, `public/favicon.svg`
- Create (gerados): `public/images/*.webp`, `public/og.jpg`
- Move: `piscina1.jpg` … `piscina4.jpg` para `assets-origem/`

**Interfaces:**
- Consumes: os slugs e larguras nativas de `site.fotos` (Task 3)
- Produces: para cada slug, os arquivos `public/images/<slug>-640.webp`, `-900.webp` e, quando a largura nativa permitir, `-1200.webp`. Consumidos pelas Tasks 7 e 8.

- [ ] **Step 1: Mover os JPGs de origem para fora da raiz**

```bash
cd "D:/Claude/PGW"
mkdir -p assets-origem
mv piscina1.jpg piscina2.jpg piscina3.jpg piscina4.jpg assets-origem/
```

- [ ] **Step 2: Escrever o script de otimização**

Escrever `scripts/optimize-images.mjs`:

```js
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const ORIGEM = 'assets-origem'
const SAIDA = 'public/images'
// 1200 e a largura nativa de piscina1/piscina2. Um tier acima disso seria
// descartado pela guarda anti-upscale e nunca geraria arquivo.
const LARGURAS = [640, 900, 1200]

// Os crops removem elementos que atrapalham a leitura da foto.
// top/height sao em pixels da imagem original.
const FOTOS = [
  {
    arquivo: 'piscina2.jpg',
    slug: 'piscina-deck-spa',
    larguraNativa: 1200,
    crop: null, // enquadramento cheio
  },
  {
    arquivo: 'piscina1.jpg',
    slug: 'piscina-azulejo-verde',
    larguraNativa: 1200,
    crop: { left: 0, top: 540, width: 1200, height: 1060 }, // remove a capa azul no deck
  },
  {
    arquivo: 'piscina3.jpg',
    slug: 'piscina-jardim',
    larguraNativa: 900,
    crop: { left: 0, top: 260, width: 900, height: 1340 }, // reduz o flare de sol
  },
  {
    arquivo: 'piscina4.jpg',
    slug: 'piscina-condominio',
    larguraNativa: 900,
    crop: { left: 0, top: 330, width: 900, height: 1270 }, // remove carros e casas vizinhas
  },
]

await mkdir(SAIDA, { recursive: true })

for (const foto of FOTOS) {
  for (const largura of LARGURAS) {
    // Nunca fazer upscale acima da largura nativa.
    if (largura > foto.larguraNativa) continue

    let pipeline = sharp(`${ORIGEM}/${foto.arquivo}`)
    if (foto.crop) pipeline = pipeline.extract(foto.crop)

    await pipeline
      .resize({ width: largura })
      .webp({ quality: 82 })
      .toFile(`${SAIDA}/${foto.slug}-${largura}.webp`)

    console.log(`gerado ${foto.slug}-${largura}.webp`)
  }
}

// Imagem de Open Graph: recorte paisagem de 1200x630 a partir da foto principal.
await sharp(`${ORIGEM}/piscina2.jpg`)
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
  .jpeg({ quality: 84 })
  .toFile('public/og.jpg')

console.log('gerado og.jpg')
```

- [ ] **Step 3: Registrar o script no package.json**

Em `package.json`, dentro de `"scripts"`, acrescentar:

```json
"images": "node scripts/optimize-images.mjs"
```

- [ ] **Step 4: Rodar o script**

```bash
cd "D:/Claude/PGW" && npm run images
```

Esperado: 10 linhas `gerado …webp` (3 larguras para os dois slugs de 1200px, 2 larguras para os dois de 900px) mais `gerado og.jpg`.

- [ ] **Step 5: Conferir visualmente cada crop**

Abrir os quatro arquivos `-900.webp` e o `og.jpg` e confirmar, um a um:

- `piscina-azulejo-verde-900.webp`: a capa azul amassada saiu do quadro
- `piscina-jardim-900.webp`: o jardim continua visível e o flare não domina
- `piscina-condominio-900.webp`: carros e casas vizinhas saíram do quadro
- `piscina-deck-spa-900.webp`: a água ocupa a maior parte do quadro
- `og.jpg`: a água aparece, e não só o deck

Os valores de crop no script foram estimados. **Se algum recorte estiver errado, ajustar `top`/`height` no array `FOTOS` e rodar `npm run images` de novo** até os cinco pontos acima estarem satisfeitos. Não seguir para o próximo passo antes disso.

- [ ] **Step 6: Escrever o favicon**

Escrever `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0B2545"/>
  <path d="M22 13h13a11 11 0 0 1 0 22h-6v11h-7V13zm7 6v10h6a5 5 0 0 0 0-10h-6z" fill="#FFFFFF"/>
  <path d="M9 52c5.5-4.5 10-4.5 15.5 0s10 4.5 15.5 0 10-4.5 15.5 0" stroke="#17C3E0" stroke-width="5" fill="none" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 7: Ligar o favicon no index.html**

Em `index.html`, dentro do `<head>`, logo após a linha do `viewport`, acrescentar:

```html
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

- [ ] **Step 8: Commit**

```bash
cd "D:/Claude/PGW"
git add -A
git commit -m "Adiciona pipeline de imagens, fotos otimizadas e favicon"
```

---

## Task 5: Primitivos de UI e movimento

**Files:**
- Create: `src/hooks/usePrefersReducedMotion.ts`, `src/lib/imagens.ts`, `src/components/ui/Reveal.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Section.tsx`

**Interfaces:**
- Consumes: `whatsappUrl` de `src/lib/whatsapp.ts` (Task 2)
- Produces:
  - `usePrefersReducedMotion(): boolean`
  - `srcSetDe(slug: string, larguraNativa: number): string` — consumido pelas Tasks 7 e 8
  - `<Reveal delay?: number className?: string>` — envolve filhos com fade + slide-up on scroll
  - `<Button as?: 'link' | 'whatsapp' variante?: 'primaria' | 'secundaria' href?: string mensagem?: string pulse?: boolean>`
  - `<Section className?: string id?: string>` — padding e largura máxima padronizados

- [ ] **Step 1: Escrever o hook de movimento reduzido**

Escrever `src/hooks/usePrefersReducedMotion.ts`:

```ts
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion(): boolean {
  const [reduzido, setReduzido] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const aoMudar = () => setReduzido(mq.matches)
    mq.addEventListener('change', aoMudar)
    return () => mq.removeEventListener('change', aoMudar)
  }, [])

  return reduzido
}
```

- [ ] **Step 2: Escrever o helper de srcset**

O hero e a galeria servem os mesmos WebP em resoluções diferentes. A regra de quais larguras existem por foto vive num lugar só.

Escrever `src/lib/imagens.ts`:

```ts
// Precisa espelhar LARGURAS de scripts/optimize-images.mjs: sao os
// arquivos que existem em public/images.
const LARGURAS = [640, 900, 1200]

/** Monta o srcset de uma foto, sem oferecer largura acima da nativa. */
export function srcSetDe(slug: string, larguraNativa: number): string {
  return LARGURAS.filter((l) => l <= larguraNativa)
    .map((l) => `/images/${slug}-${l}.webp ${l}w`)
    .join(', ')
}
```

- [ ] **Step 3: Escrever o Reveal**

Escrever `src/components/ui/Reveal.tsx`:

```tsx
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
}

export function Reveal({ children, delay = 0, className }: Props) {
  const reduzido = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduzido ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: reduzido ? 0 : 0.5, delay: reduzido ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 4: Escrever o Button**

Escrever `src/components/ui/Button.tsx`:

```tsx
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { whatsappUrl } from '../../lib/whatsapp'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Props {
  children: ReactNode
  /** 'whatsapp' monta o href a partir de `mensagem`; 'link' usa `href` direto. */
  as?: 'whatsapp' | 'link'
  href?: string
  mensagem?: string
  variante?: 'primaria' | 'secundaria'
  pulse?: boolean
  className?: string
}

// A sombra do hover precisa ser valor arbitrario. Em Tailwind v4 as duas
// formas semanticas obvias falham: com modificador de opacidade nao gera
// CSS nenhum, e sem ele so define --tw-shadow-color sem desenhar sombra.
// Nao simplifique esta classe de volta. Underscores no lugar de espacos,
// e a cor vem da variavel da paleta.
//
// O texto acima evita de proposito escrever a classe quebrada por extenso:
// o scanner do Tailwind le o arquivo cru e nao distingue comentario de
// codigo, entao mencionar a classe a regeneraria no bundle.
const ESTILOS = {
  primaria: 'bg-turquesa text-navy hover:shadow-[0_12px_34px_-10px_var(--color-turquesa)]',
  secundaria: 'border-2 border-white/40 text-white hover:border-turquesa hover:text-turquesa',
} as const

export function Button({
  children,
  as = 'whatsapp',
  href,
  mensagem,
  variante = 'primaria',
  pulse = false,
  className = '',
}: Props) {
  const reduzido = usePrefersReducedMotion()
  const destino = as === 'whatsapp' ? whatsappUrl(mensagem) : (href ?? '#')
  const externo = as === 'whatsapp'

  return (
    <motion.a
      href={destino}
      target={externo ? '_blank' : undefined}
      rel={externo ? 'noopener noreferrer' : undefined}
      whileHover={reduzido ? undefined : { scale: 1.03 }}
      whileTap={reduzido ? undefined : { scale: 0.98 }}
      animate={
        pulse && !reduzido
          ? { boxShadow: ['0 0 0 0 rgba(23,195,224,0.45)', '0 0 0 14px rgba(23,195,224,0)'] }
          : undefined
      }
      transition={
        pulse && !reduzido ? { duration: 2, repeat: Infinity, ease: 'easeOut' } : { duration: 0.2 }
      }
      className={`inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold transition-shadow ${ESTILOS[variante]} ${className}`}
    >
      {children}
    </motion.a>
  )
}
```

- [ ] **Step 5: Escrever o Section**

Escrever `src/components/ui/Section.tsx`:

```tsx
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
```

- [ ] **Step 6: Verificar que o typecheck passa**

```bash
cd "D:/Claude/PGW" && npx tsc --noEmit
```

Esperado: nenhuma saída.

- [ ] **Step 7: Commit**

```bash
cd "D:/Claude/PGW"
git add src/hooks src/lib/imagens.ts src/components/ui
git commit -m "Adiciona primitivos de UI, helper de imagens e hook de movimento reduzido"
```

---

## Task 6: Shell de layout e rotas

Ao fim desta tarefa o site é navegável, com as 4 páginas vazias.

**Files:**
- Create: `src/components/Logo.tsx`, `src/components/WhatsAppFab.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/RootLayout.tsx`, `src/routes.tsx`, `src/pages/Home.tsx`, `src/pages/Servicos.tsx`, `src/pages/Sobre.tsx`, `src/pages/Contato.tsx`, `src/pages/NotFound.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `site` (Task 3), `Button`, `Section` (Task 5), `usePrefersReducedMotion` (Task 5), `whatsappUrl` (Task 2)
- Produces: `<Logo variante: 'clara' | 'escura' />`, `<WhatsAppFab />`, `router` exportado de `src/routes.tsx`. As páginas exportam componentes default consumidos pelas Tasks 7, 8 e 9.

- [ ] **Step 1: Escrever o Logo**

Escrever `src/components/Logo.tsx`. É texto real com fonte Inter 800, e não caminhos de SVG, para que leitores de tela anunciem "PGW Piscinas" e para que fique nítido em qualquer tamanho.

```tsx
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
```

- [ ] **Step 2: Escrever o WhatsAppFab**

Escrever `src/components/WhatsAppFab.tsx`:

```tsx
import { motion } from 'framer-motion'
import { whatsappUrl } from '../lib/whatsapp'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export function WhatsAppFab() {
  const reduzido = usePrefersReducedMotion()

  return (
    <motion.a
      href={whatsappUrl('Olá, PGW! Vim pelo site e quero um orçamento.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a PGW no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-turquesa text-navy shadow-lg"
      whileHover={reduzido ? undefined : { scale: 1.08 }}
      animate={
        reduzido
          ? undefined
          : { boxShadow: ['0 0 0 0 rgba(23,195,224,0.5)', '0 0 0 16px rgba(23,195,224,0)'] }
      }
      transition={reduzido ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.25.69-1.44 1.32-1.99 1.36-.53.05-1.02.24-3.45-.72-2.9-1.15-4.75-4.1-4.9-4.29-.14-.19-1.17-1.56-1.17-2.97s.74-2.11 1-2.4c.26-.29.57-.36.76-.36l.54.01c.18.01.42-.07.65.5.25.6.84 2.07.91 2.22.07.15.12.32.02.51-.1.19-.15.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.29-.13.57.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.41.29.15.45.12.62-.07.17-.19.71-.83.9-1.12.19-.29.38-.24.64-.14.26.09 1.66.78 1.94.93.29.14.48.21.55.33.07.12.07.69-.18 1.38Z" />
      </svg>
    </motion.a>
  )
}
```

- [ ] **Step 3: Escrever o Header**

Escrever `src/components/layout/Header.tsx`:

```tsx
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
```

- [ ] **Step 4: Escrever o Footer**

Escrever `src/components/layout/Footer.tsx`:

```tsx
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
```

- [ ] **Step 5: Escrever o RootLayout com transição de página e scroll-to-top**

Escrever `src/components/layout/RootLayout.tsx`. Sem o `useEffect` de scroll, navegar entre páginas mantém a posição de rolagem anterior e a nova página abre no meio.

```tsx
import { useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppFab } from '../WhatsAppFab'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export function RootLayout() {
  const location = useLocation()
  // useOutlet e nao <Outlet />: o Outlet assina o contexto do router e
  // re-renderiza com a rota nova na hora, por dentro do AnimatePresence.
  // O conteudo trocaria em ~10ms e o fade de 200ms animaria uma div cujo
  // conteudo ja mudou. Capturar o elemento aqui e o que faz a saida
  // esperar de verdade.
  const outlet = useOutlet()
  const reduzido = usePrefersReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduzido ? 0 : 0.2 }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  )
}
```

- [ ] **Step 6: Escrever as 5 páginas como esqueleto**

Cada página declara suas próprias meta tags no JSX — React 19 as hasteia para o `<head>`. O conteúdo real entra nas Tasks 7, 8 e 9.

Escrever `src/pages/Home.tsx`:

```tsx
export default function Home() {
  return (
    <>
      <title>PGW Piscinas | Limpeza e manutenção de piscina em Campinas</title>
      <meta
        name="description"
        content="Limpeza e manutenção de piscina em Campinas e região. Equipe própria, sem fidelidade e água cristalina o ano todo. Peça seu orçamento no WhatsApp."
      />
    </>
  )
}
```

Escrever `src/pages/Servicos.tsx`:

```tsx
export default function Servicos() {
  return (
    <>
      <title>Serviços | PGW Piscinas Campinas</title>
      <meta
        name="description"
        content="Limpeza periódica, tratamento químico, manutenção de bomba e filtro e recuperação de água verde em Campinas e região."
      />
    </>
  )
}
```

Escrever `src/pages/Sobre.tsx`:

```tsx
export default function Sobre() {
  return (
    <>
      <title>Sobre a PGW | Piscinas em Campinas</title>
      <meta
        name="description"
        content="A PGW Piscinas nasceu de um grupo de amigos em Campinas, com equipe própria e atendimento pessoal."
      />
    </>
  )
}
```

Escrever `src/pages/Contato.tsx`:

```tsx
export default function Contato() {
  return (
    <>
      <title>Contato | PGW Piscinas Campinas</title>
      <meta
        name="description"
        content="Fale com a PGW Piscinas no WhatsApp (19) 99271-5025. Atendimento em Campinas e região."
      />
    </>
  )
}
```

Escrever `src/pages/NotFound.tsx`:

```tsx
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
```

- [ ] **Step 7: Escrever as rotas**

Escrever `src/routes.tsx`:

```tsx
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import Home from './pages/Home'
import Servicos from './pages/Servicos'
import Sobre from './pages/Sobre'
import Contato from './pages/Contato'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/servicos', element: <Servicos /> },
      { path: '/sobre', element: <Sobre /> },
      { path: '/contato', element: <Contato /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
```

- [ ] **Step 8: Substituir o main.tsx provisório**

Escrever `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

- [ ] **Step 9: Verificar navegação no preview**

Subir o dev server e conferir: header aparece com o wordmark; clicar em Serviços, Sobre e Contato troca a rota com fade; o FAB de WhatsApp está fixo no canto inferior direito em todas; acessar uma URL inexistente mostra o 404; o menu mobile abre e fecha na largura de 375px. Console sem erros.

- [ ] **Step 10: Commit**

```bash
cd "D:/Claude/PGW"
git add -A
git commit -m "Adiciona shell de layout, rotas e paginas esqueleto"
```

---

## Task 7: Hero

O elemento central do projeto.

**Files:**
- Create: `src/components/home/Hero.tsx`
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: `site.fotos`, `site.regiao` (Task 3); `srcSetDe`, `Button`, `usePrefersReducedMotion` (Task 5); os WebP gerados na Task 4
- Produces: `<Hero />`, usado apenas por `Home`

- [ ] **Step 1: Escrever o Hero**

Escrever `src/components/home/Hero.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { site } from '../../content/site'
import { srcSetDe } from '../../lib/imagens'
import { Button } from '../ui/Button'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const INTERVALO_MS = 8000
const CROSSFADE_S = 1.2

export function Hero() {
  const [indice, setIndice] = useState(0)
  const reduzido = usePrefersReducedMotion()
  const fotos = site.fotos

  useEffect(() => {
    const id = setInterval(() => setIndice((i) => (i + 1) % fotos.length), INTERVALO_MS)
    return () => clearInterval(id)
  }, [fotos.length])

  // Pre-carrega as fotos 2 a 4 para o primeiro crossfade nao cair num painel vazio.
  useEffect(() => {
    fotos.slice(1).forEach((foto) => {
      const img = new Image()
      img.src = `/images/${foto.slug}-900.webp`
    })
  }, [fotos])

  const foto = fotos[indice]

  return (
    <section className="relative grid min-h-[100svh] lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2">
      {/* Painel de foto: fundo full-bleed no mobile, coluna da direita no desktop */}
      <div className="absolute inset-0 overflow-hidden lg:relative lg:order-2 lg:col-span-1">
        <AnimatePresence initial={false}>
          <motion.img
            key={foto.slug}
            src={`/images/${foto.slug}-900.webp`}
            srcSet={srcSetDe(foto.slug, foto.larguraNativa)}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt={foto.alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: reduzido ? 1 : 1.08 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: reduzido ? 0.2 : CROSSFADE_S },
              scale: { duration: INTERVALO_MS / 1000, ease: 'linear' },
            }}
          />
        </AnimatePresence>
        {/* Escurece a foto no mobile, onde o texto fica por cima dela.
            O valor do meio foi medido, nao escolhido: com mascara de glifo
            sobre as 4 fotos, o valor mais claro reprovava em 1,4% e 2,0%
            dos pixels de texto, por causa dos reflexos de sol na agua. */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/20 lg:hidden" />
      </div>

      {/* Coluna de texto */}
      <div className="relative z-10 flex flex-col justify-center px-6 py-24 lg:order-1 lg:bg-navy lg:px-14">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold uppercase tracking-[0.2em] text-turquesa"
        >
          {site.regiao}
        </motion.p>

        <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
          {['Piscina sempre cristalina.', 'Sem você precisar pensar nisso.'].map((linha, i) => (
            <motion.span
              key={linha}
              className="block"
              initial={reduzido ? { opacity: 1 } : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduzido ? 0 : 0.6, delay: reduzido ? 0 : i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {linha}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={reduzido ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduzido ? 0 : 0.6, delay: reduzido ? 0 : 0.3 }}
          className="mt-6 max-w-md text-lg text-prata"
        >
          Limpeza e manutenção de piscinas com equipe própria em {site.regiao}. Você usa, a gente
          cuida.
        </motion.p>

        <motion.div
          initial={reduzido ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduzido ? 0 : 0.6, delay: reduzido ? 0 : 0.5 }}
          className="mt-10"
        >
          <Button pulse mensagem="Olá, PGW! Vim pelo site e quero um orçamento.">
            Falar com a PGW no WhatsApp
          </Button>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 z-10 h-10 w-px -translate-x-1/2 bg-turquesa lg:left-14 lg:translate-x-0"
        animate={reduzido ? undefined : { opacity: [0.2, 1, 0.2], scaleY: [0.6, 1, 0.6] }}
        transition={reduzido ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  )
}
```

- [ ] **Step 2: Montar o Hero na Home**

Substituir `src/pages/Home.tsx`:

```tsx
import { Hero } from '../components/home/Hero'

export default function Home() {
  return (
    <>
      <title>PGW Piscinas | Limpeza e manutenção de piscina em Campinas</title>
      <meta
        name="description"
        content="Limpeza e manutenção de piscina em Campinas e região. Equipe própria, sem fidelidade e água cristalina o ano todo. Peça seu orçamento no WhatsApp."
      />
      <Hero />
    </>
  )
}
```

- [ ] **Step 3: Verificar o hero no desktop**

Abrir em 1280×800. Confirmar: coluna de texto à esquerda em navy e painel de foto à direita ocupando a altura toda; headline entra linha a linha; a foto faz zoom lento; após 8 segundos, a foto troca por crossfade suave, **sem piscar e sem quadro vazio**; o CTA pulsa e o hover aumenta levemente.

- [ ] **Step 4: Verificar o hero no mobile**

Redimensionar para 375×812 e recarregar. Confirmar: a foto cobre a tela inteira e o gradiente escurece a base.

O contraste do texto **não pode ser aferido a olho nem por média de luminância na caixa do título** — a média dilui o resultado com margens, espaço entre letras e o vão entre as linhas. Medir com máscara de glifo: desenhar as duas linhas do título num canvas para obter a máscara de tinta, compor foto + gradiente num segundo canvas com a mesma geometria do `object-cover`, e calcular a razão de contraste WCAG apenas nos pixels de tinta. Critério: 5º percentil ≥ 4,5:1 e menos de 0,5% dos pixels de tinta abaixo de 4,5:1, **nas quatro fotos**.

Medição já realizada: o valor `via-navy/70` reprovava (1,43% e 2,05% dos pixels de tinta abaixo do mínimo em `piscina-deck-spa` e `piscina-azulejo-verde`, por causa dos reflexos de sol na água). `via-navy/80` passa nas quatro e é o valor no código.

Atenção ao medir: o proxy do painel de navegador corrompe `naturalWidth`/`naturalHeight` do `<img>` (reporta 375×500 no lugar de 900×1200). Obter os pixels reais via `fetch()` + `createImageBitmap()`.

- [ ] **Step 5: Verificar o comportamento com movimento reduzido**

Emular `prefers-reduced-motion: reduce` e recarregar. Confirmar: sem zoom Ken Burns, sem pulse no CTA, textos aparecendo sem deslizar, e a troca de fotos ainda funcionando de forma seca.

- [ ] **Step 6: Commit**

```bash
cd "D:/Claude/PGW"
git add src/components/home/Hero.tsx src/pages/Home.tsx
git commit -m "Adiciona hero animado com crossfade e Ken Burns"
```

---

## Task 8: Seções da Home

**Files:**
- Create: `src/components/home/Comparison.tsx`, `src/components/home/Differentials.tsx`, `src/components/home/Gallery.tsx`, `src/components/home/TrustBadges.tsx`, `src/components/home/FinalCta.tsx`
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: `site.comparacao`, `site.diferenciais`, `site.fotos`, `site.selos` (Task 3); `srcSetDe`, `Reveal`, `Section`, `Button` (Task 5)
- Produces: `<Comparison />`, `<Differentials />`, `<Gallery />`, `<TrustBadges />`, `<FinalCta />`, todos usados apenas por `Home`

- [ ] **Step 1: Escrever o Comparison**

Escrever `src/components/home/Comparison.tsx`:

```tsx
import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

export function Comparison() {
  return (
    <Section className="bg-white">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">A diferença no dia a dia</h2>
        <p className="mt-4 text-navy/70">
          A piscina não dá trabalho por ser piscina. Dá trabalho por ficar sem cuidado.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <Reveal className="rounded-2xl border border-prata bg-prata/20 p-8">
          <h3 className="text-lg font-bold uppercase tracking-wide text-navy/50">Sem a PGW</h3>
          <ul className="mt-6 space-y-5">
            {site.comparacao.map((par) => (
              <li key={par.sem} className="flex gap-3 text-navy/70">
                <svg viewBox="0 0 20 20" className="mt-1 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
                <span>{par.sem}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12} className="rounded-2xl bg-navy p-8 text-white shadow-xl">
          <h3 className="text-lg font-bold uppercase tracking-wide text-turquesa">Com a PGW</h3>
          <ul className="mt-6 space-y-5">
            {site.comparacao.map((par) => (
              <li key={par.com} className="flex gap-3">
                <svg viewBox="0 0 20 20" className="mt-1 h-5 w-5 shrink-0 text-turquesa" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{par.com}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Escrever o Differentials**

Escrever `src/components/home/Differentials.tsx`:

```tsx
import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

export function Differentials() {
  return (
    <Section className="bg-prata/20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Por que a PGW</h2>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {site.diferenciais.map((item, i) => (
          <Reveal key={item.titulo} delay={i * 0.1}>
            <article className="h-full rounded-2xl border border-prata bg-white p-7">
              <div className="h-1 w-10 rounded-full bg-turquesa" />
              <h3 className="mt-5 text-lg font-bold">{item.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/70">{item.descricao}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 3: Escrever o Gallery**

Escrever `src/components/home/Gallery.tsx`:

```tsx
import { site } from '../../content/site'
import { srcSetDe } from '../../lib/imagens'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

export function Gallery() {
  return (
    <Section className="bg-white">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Piscinas que a PGW cuida</h2>
        <p className="mt-4 text-navy/70">Fotos reais de clientes atendidos em {site.regiao}.</p>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {site.fotos.map((foto, i) => (
          <Reveal key={foto.slug} delay={i * 0.08}>
            <img
              src={`/images/${foto.slug}-640.webp`}
              srcSet={srcSetDe(foto.slug, foto.larguraNativa)}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              alt={foto.alt}
              loading="lazy"
              className="aspect-[3/4] w-full rounded-2xl object-cover"
            />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 4: Escrever o TrustBadges**

Escrever `src/components/home/TrustBadges.tsx`:

```tsx
import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

export function TrustBadges() {
  return (
    <Section className="bg-navy text-white">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {site.selos.map((selo, i) => (
          <Reveal key={selo.titulo} delay={i * 0.08}>
            <div className="flex h-full items-start gap-3 rounded-xl border border-white/10 p-6">
              <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-turquesa" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-semibold">{selo.titulo}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 5: Escrever o FinalCta**

Escrever `src/components/home/FinalCta.tsx`:

```tsx
import { site } from '../../content/site'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

export function FinalCta() {
  return (
    <Section className="bg-turquesa">
      <Reveal className="mx-auto max-w-2xl text-center text-navy">
        <h2 className="text-3xl font-bold sm:text-4xl">Quer a piscina pronta o ano todo?</h2>
        <p className="mt-4 text-navy/80">
          Chame no WhatsApp e receba um orçamento para a sua piscina. Atendemos {site.regiao}.
        </p>
        <div className="mt-9 flex justify-center">
          <Button
            mensagem="Olá, PGW! Vim pelo site e quero um orçamento."
            className="bg-navy text-white"
          >
            Falar com a PGW no WhatsApp
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}
```

- [ ] **Step 6: Montar todas as seções na Home**

Substituir `src/pages/Home.tsx`:

```tsx
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
```

- [ ] **Step 7: Verificar a Home inteira**

Rolar a Home do topo ao rodapé em 1280×800 e em 375×812. Confirmar: cada seção entra com fade + slide-up ao aparecer; os cards de diferenciais entram em cascata, e não todos juntos; as 4 fotos da galeria carregam e mantêm proporção 3:4 sem distorcer; console sem erros e sem 404 de imagem.

- [ ] **Step 8: Commit**

```bash
cd "D:/Claude/PGW"
git add src/components/home src/pages/Home.tsx
git commit -m "Adiciona secoes da home: comparacao, diferenciais, galeria, selos e CTA"
```

---

## Task 9: Páginas Serviços, Sobre e Contato

**Files:**
- Modify: `src/pages/Servicos.tsx`, `src/pages/Sobre.tsx`, `src/pages/Contato.tsx`

**Interfaces:**
- Consumes: `site.servicos`, `site.regiao`, `site.telefoneExibido`, `site.telefoneHref` (Task 3); `formToMessage`, `whatsappUrl`, tipo `ContatoForm` (Task 2); `Reveal`, `Section`, `Button` (Task 5)
- Produces: nada consumido por outras tarefas

- [ ] **Step 1: Escrever a página de Serviços**

Substituir `src/pages/Servicos.tsx`:

```tsx
import { site } from '../content/site'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'

export default function Servicos() {
  return (
    <>
      <title>Serviços | PGW Piscinas Campinas</title>
      <meta
        name="description"
        content="Limpeza periódica, tratamento químico, manutenção de bomba e filtro e recuperação de água verde em Campinas e região."
      />

      <Section className="bg-navy text-white">
        <Reveal className="max-w-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Serviços</h1>
          <p className="mt-5 text-lg text-prata">
            Cuidamos da piscina inteira: da água ao equipamento. Atendimento em {site.regiao}.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {site.servicos.map((servico, i) => (
            <Reveal key={servico.slug} delay={i * 0.1}>
              <article className="flex h-full flex-col rounded-2xl border border-prata p-8">
                <div className="h-1 w-10 rounded-full bg-turquesa" />
                <h2 className="mt-5 text-xl font-bold">{servico.titulo}</h2>
                <p className="mt-4 flex-1 leading-relaxed text-navy/70">{servico.descricao}</p>
                <div className="mt-7">
                  <Button
                    mensagem={`Olá, PGW! Vim pelo site e quero saber sobre: ${servico.titulo}.`}
                    className="px-6 py-3 text-sm"
                  >
                    Pedir orçamento
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
```

- [ ] **Step 2: Escrever a página Sobre**

Substituir `src/pages/Sobre.tsx`. O placeholder dos nomes dos sócios é **visível na página**, e não um comentário no código, para que seja impossível publicar sem perceber.

```tsx
import { site } from '../content/site'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'

export default function Sobre() {
  return (
    <>
      <title>Sobre a PGW | Piscinas em Campinas</title>
      <meta
        name="description"
        content="A PGW Piscinas nasceu de um grupo de amigos em Campinas, com equipe própria e atendimento pessoal."
      />

      <Section className="bg-navy text-white">
        <Reveal className="max-w-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Sobre a PGW</h1>
          <p className="mt-5 text-lg text-prata">
            Um grupo de amigos que resolveu cuidar de piscina do jeito que gostaria que cuidassem da
            sua.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal className="space-y-5 text-lg leading-relaxed text-navy/80">
            <p>
              A PGW nasceu em Campinas, fundada por um grupo de amigos que já trabalhava com
              manutenção e cansou de ver o mesmo problema: piscina bonita no dia da visita e
              esquecida no resto da semana.
            </p>
            <p>
              A gente montou a PGW para resolver isso de um jeito simples. Equipe própria, sempre as
              mesmas pessoas na sua casa, dia combinado cumprido e resposta no WhatsApp quando você
              precisa. Sem central de atendimento, sem terceirizado diferente a cada semana.
            </p>
            <p>
              Ser uma equipe pequena é o nosso diferencial, não a nossa limitação: quem atende você
              conhece a sua piscina pelo nome.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-2xl border-2 border-dashed border-turquesa bg-turquesa/5 p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-turquesa">
                Pendente antes de publicar
              </p>
              <h2 className="mt-4 text-2xl font-bold">Quem está por trás da PGW</h2>
              <p className="mt-4 text-navy/70">
                [PLACEHOLDER: nomes dos sócios e fundadores. Preencher antes de publicar o site.]
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16 text-center">
          <Button mensagem="Olá, PGW! Vim pelo site e quero um orçamento.">
            Falar com a PGW no WhatsApp
          </Button>
        </Reveal>
      </Section>
    </>
  )
}
```

- [ ] **Step 3: Escrever a página de Contato com o formulário**

Substituir `src/pages/Contato.tsx`. O formulário não envia nada a servidor algum: monta a mensagem e abre o WhatsApp.

```tsx
import { useState } from 'react'
import { site } from '../content/site'
import { formToMessage, whatsappUrl, type ContatoForm } from '../lib/whatsapp'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'

const VAZIO: ContatoForm = { nome: '', telefone: '', bairro: '', mensagem: '' }

export default function Contato() {
  const [form, setForm] = useState<ContatoForm>(VAZIO)

  function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    window.open(whatsappUrl(formToMessage(form)), '_blank', 'noopener,noreferrer')
  }

  function campo(nome: keyof ContatoForm) {
    return {
      value: form[nome] ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [nome]: e.target.value })),
    }
  }

  const classeCampo =
    'mt-2 w-full rounded-lg border border-prata px-4 py-3 outline-none focus:border-turquesa'

  return (
    <>
      <title>Contato | PGW Piscinas Campinas</title>
      <meta
        name="description"
        content="Fale com a PGW Piscinas no WhatsApp (19) 99271-5025. Atendimento em Campinas e região."
      />

      <Section className="bg-navy text-white">
        <Reveal className="max-w-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Falar com a PGW</h1>
          <p className="mt-5 text-lg text-prata">
            O jeito mais rápido é o WhatsApp. Se preferir, preencha o formulário — ele abre a
            conversa já com os seus dados escritos.
          </p>
          <div className="mt-9">
            <Button pulse mensagem="Olá, PGW! Vim pelo site e quero um orçamento.">
              Falar no WhatsApp
            </Button>
          </div>
        </Reveal>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal className="space-y-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-turquesa">Telefone</h2>
              <a
                href={site.telefoneHref}
                className="mt-2 block text-2xl font-bold hover:text-turquesa"
              >
                {site.telefoneExibido}
              </a>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-turquesa">
                Área de atuação
              </h2>
              <p className="mt-2 text-lg">{site.regiao}</p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form onSubmit={aoEnviar} className="rounded-2xl border border-prata p-8">
              <label className="block text-sm font-semibold">
                Nome
                <input required className={classeCampo} {...campo('nome')} />
              </label>
              <label className="mt-5 block text-sm font-semibold">
                Telefone
                <input required type="tel" className={classeCampo} {...campo('telefone')} />
              </label>
              <label className="mt-5 block text-sm font-semibold">
                Bairro
                <input className={classeCampo} {...campo('bairro')} />
              </label>
              <label className="mt-5 block text-sm font-semibold">
                Mensagem
                <textarea rows={4} className={classeCampo} {...campo('mensagem')} />
              </label>
              <button
                type="submit"
                className="mt-7 w-full rounded-full bg-turquesa px-8 py-4 font-semibold text-navy transition-transform hover:scale-[1.02]"
              >
                Abrir conversa no WhatsApp
              </button>
              <p className="mt-4 text-xs text-navy/60">
                Nada é enviado por aqui. O botão abre o WhatsApp com a sua mensagem pronta.
              </p>
            </form>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
```

- [ ] **Step 4: Confirmar que o número não vazou para fora do conteúdo**

```bash
cd "D:/Claude/PGW" && grep -rn "5519992715025\|99271-5025" src/ --include=*.tsx
```

Esperado: nenhuma saída. Qualquer ocorrência deve ser trocada por leitura de `site`.

- [ ] **Step 5: Testar o formulário de ponta a ponta**

No preview, abrir `/contato`, preencher nome `Gabriel`, telefone `(19) 90000-0000`, bairro `Cambuí` e mensagem `Minha piscina está verde.`, e enviar. Confirmar que a URL aberta contém `wa.me/5519992715025?text=` e que, ao decodificar, aparece a mensagem com os acentos corretos e as quebras de linha. Depois repetir deixando bairro e mensagem vazios e confirmar que não sobra linha órfã.

- [ ] **Step 6: Commit**

```bash
cd "D:/Claude/PGW"
git add src/pages
git commit -m "Adiciona paginas de servicos, sobre e contato"
```

---

## Task 10: SEO, deploy e verificação final

**Files:**
- Modify: `index.html`
- Create: `public/robots.txt`, `public/sitemap.xml`, `vercel.json`, `README.md`

**Interfaces:**
- Consumes: `public/og.jpg` (Task 4)
- Produces: build pronto para deploy na Vercel

- [ ] **Step 1: Acrescentar as meta tags estáticas ao index.html**

O crawler do WhatsApp não executa JavaScript. Se as tags de Open Graph forem injetadas pelo React, o link colado num grupo aparece sem imagem e sem descrição — justamente no canal que este site existe para alimentar. Por isso elas ficam estáticas aqui.

Em `index.html`, dentro do `<head>` e antes do `<title>`, acrescentar:

```html
    <meta name="theme-color" content="#0B2545" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="PGW Piscinas" />
    <meta property="og:title" content="PGW Piscinas | Limpeza e manutenção de piscina em Campinas" />
    <meta
      property="og:description"
      content="Limpeza e manutenção de piscina em Campinas e região. Equipe própria, sem fidelidade e água cristalina o ano todo."
    />
    <meta property="og:image" content="/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
```

- [ ] **Step 2: Pré-carregar a imagem LCP**

A primeira foto do hero é o maior elemento renderizado da página. Em `index.html`, dentro do `<head>`, acrescentar:

```html
    <link rel="preload" as="image" href="/images/piscina-deck-spa-900.webp" />
```

- [ ] **Step 3: Escrever o robots.txt**

Escrever `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://pgwpiscinas.com.br/sitemap.xml
```

- [ ] **Step 4: Escrever o sitemap.xml**

Escrever `public/sitemap.xml`. Contém as 4 rotas de conteúdo; a 404 fica de fora.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://pgwpiscinas.com.br/</loc><priority>1.0</priority></url>
  <url><loc>https://pgwpiscinas.com.br/servicos</loc><priority>0.8</priority></url>
  <url><loc>https://pgwpiscinas.com.br/sobre</loc><priority>0.5</priority></url>
  <url><loc>https://pgwpiscinas.com.br/contato</loc><priority>0.8</priority></url>
</urlset>
```

**O domínio `pgwpiscinas.com.br` é uma suposição.** Ao definir o domínio real, atualizar as duas URLs base aqui e no `robots.txt`, e trocar `/og.jpg` por URL absoluta no `index.html` — alguns crawlers não resolvem caminho relativo em `og:image`.

- [ ] **Step 5: Escrever o vercel.json**

Sem este rewrite, acessar `pgwpiscinas.com.br/servicos` direto retorna 404 na Vercel, porque o roteamento é client-side e não existe arquivo nesse caminho.

Escrever `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 6: Escrever o README**

Escrever `README.md`:

```markdown
# PGW Piscinas

Site institucional da PGW Piscinas — limpeza e manutenção de piscinas em Campinas e região.

## Rodar localmente

```bash
npm install
npm run dev
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm test` | Roda os testes do Vitest |
| `npm run images` | Regera os WebP e o `og.jpg` a partir de `assets-origem/` |

## Onde mexer no conteúdo

Telefone, serviços, selos, diferenciais e textos da comparação estão todos em
`src/content/site.ts`. **O número de WhatsApp existe apenas ali** — não repita
o número em nenhum outro arquivo.

## Pendências antes de publicar

- Preencher os nomes dos sócios em `src/pages/Sobre.tsx` (há um bloco marcado
  visivelmente na página)
- Trocar `pgwpiscinas.com.br` pelo domínio real em `public/robots.txt` e
  `public/sitemap.xml`, e usar URL absoluta em `og:image` no `index.html`
- Corrigir a grafia `MANUTENÇÃÓ` na arte impressa da logo (não afeta o site)

## Deploy

Vercel, build Vite padrão. O `vercel.json` reescreve todas as rotas para
`index.html`, o que é necessário para o roteamento client-side funcionar em
links diretos.
```

- [ ] **Step 7: Rodar a suíte completa e o build**

```bash
cd "D:/Claude/PGW" && npm test && npx tsc --noEmit && npm run build
```

Esperado: 5 testes passando, nenhuma saída do tsc, build concluído.

- [ ] **Step 8: Verificar o build de produção no navegador**

Servir `dist/` e percorrer as 4 páginas. Confirmar: nenhum erro no console, nenhuma requisição 404 na aba de rede, e as imagens sendo servidas como `.webp`.

- [ ] **Step 9: Rodar o Lighthouse**

Rodar Lighthouse em modo mobile na Home. Meta: 90+ em Performance, Acessibilidade, Best Practices e SEO. Se Performance ficar abaixo de 90, o suspeito mais provável é a imagem LCP do hero — conferir se o `preload` do Step 2 aponta para o arquivo que o hero realmente carrega primeiro.

- [ ] **Step 10: Commit**

```bash
cd "D:/Claude/PGW"
git add -A
git commit -m "Adiciona SEO, configuracao de deploy e README"
```

---

## Verificação final

Antes de declarar o trabalho concluído, use a skill `superpowers:verification-before-completion`. Nenhuma afirmação de "está pronto" sem a saída dos comandos acima colada como evidência.

Checklist de aceitação:

- [ ] `npm test` passa com 5 testes
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run build` conclui
- [ ] `grep -rn "5519992715025\|99271-5025" src/ --include=*.tsx` não retorna nada
- [ ] As 4 rotas navegam e a 404 aparece em URL inválida
- [ ] Hero: crossfade sem piscar, Ken Burns visível, texto legível sobre as 4 fotos no mobile
- [ ] Com `prefers-reduced-motion: reduce`: sem zoom, sem pulse, sem slide
- [ ] Formulário de contato abre o WhatsApp com acentos e quebras de linha corretos
- [ ] Lighthouse mobile 90+ nas quatro categorias
- [ ] Placeholder dos sócios visível na página Sobre
