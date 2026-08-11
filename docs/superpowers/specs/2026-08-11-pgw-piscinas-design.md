# PGW Piscinas — Design do site institucional

**Data:** 2026-08-11
**Status:** aprovado, pronto para plano de implementação

## Objetivo

Site institucional de 4 páginas para a PGW Piscinas — limpeza e manutenção de piscinas em Campinas e região (SP). Objetivo único de conversão: levar o visitante ao WhatsApp `(19) 99271-5025`. Sem carrinho, sem login, sem back-end.

Tom de voz: direto e confiável, falando com o dono da casa e não com engenheiro. Nenhum exagero técnico.

## Restrições descobertas no material real

Estas restrições vieram da inspeção dos arquivos e alteraram decisões do brief original. Registradas aqui porque explicam escolhas que de outra forma parecem arbitrárias.

1. **As 4 fotos são verticais de celular.** `piscina1/2` em 1200×1600, `piscina3/4` em 900×1600. O brief as descrevia como "enquadramento aberto, ótimas pro hero" — não são. Um hero full-bleed 16:9 no desktop descartaria ~60% da imagem (a água, que é a prova visual) e faria upscale de 900–1200px para 1920px.
2. **São fotos honestas de cliente, não de marketing.** `piscina1` tem uma capa azul amassada no deck e a sombra do fotógrafo na água; `piscina3` tem flare forte de sol; `piscina4` mostra casas de vizinhos e carros estacionados no terço superior. Servem como prova social, mas exigem crop deliberado.
3. **A logo original não serve para header.** Cromado 3D pesado com coqueiros e faixa. Além disso contém erro de grafia: `MANUTENÇÃÓ` em vez de `MANUTENÇÃO`.
4. **Não existem depoimentos reais de clientes.** Nada de depoimento será inventado.

## Decisões de conteúdo confirmadas

- **Serviços (4):** limpeza e manutenção periódica (semanal/quinzenal); tratamento químico (pH, cloro, algicida); manutenção preventiva de equipamentos (bomba, filtro, troca de areia); recuperação de água verde / limpeza pesada.
  *Substitui "abertura e fechamento sazonal" do brief, que é conceito de clima temperado e não existe no mercado de Campinas — piscina roda o ano todo. "Recuperação de água verde" entrou no lugar por ser a dor aguda que gera contato imediato.*
- **Preço:** nenhum valor no site. Todo CTA leva ao WhatsApp para orçamento personalizado.
- **Selos de confiança (4, todos confirmados como verdadeiros):** atendimento em Campinas e região; equipe própria sem terceirização; sem fidelidade e sem multa de cancelamento; produtos de linha profissional.
- **Sem seção de depoimentos.** A faixa de selos ocupa esse espaço até existirem depoimentos reais.

## Stack

Vite · React 18 · TypeScript · React Router v7 · Tailwind CSS · Framer Motion. Deploy na Vercel. `sharp` em devDependencies apenas para o script de otimização de imagens.

## Identidade visual

| Cor | Hex | Uso |
|---|---|---|
| Azul marinho profundo | `#0B2545` | fundo escuro, texto, header |
| Turquesa piscina | `#17C3E0` | accent, CTAs, hovers |
| Branco | `#FFFFFF` | fundo claro, texto sobre escuro |
| Prata/cinza claro | `#C9D6DF` | detalhes, bordas, texto secundário |

Tipografia: **Inter** via Google Fonts com `preconnect` e `display=swap`. Títulos 600/700, corpo 400.

**Logo:** wordmark `PGW` em SVG inline — Inter 800, tracking apertado, onda turquesa sutil embaixo, `PISCINAS` menor em prata com letterspacing largo. Duas variantes (`light` / `dark`) via prop. A arte original 3D não é usada no site.

**Favicon:** monograma turquesa sobre navy em SVG. *Diverge do brief, que sugeria um crop do ícone central da logo — aquele ícone é uma piscina com dois coqueiros e reflexo, ilegível a 32×32px.*

## Arquitetura

```
D:\Claude\PGW\
├─ public/
│  ├─ images/              # WebP derivados em 640/900/1280
│  ├─ favicon.svg
│  ├─ og.jpg
│  ├─ robots.txt
│  └─ sitemap.xml
├─ scripts/
│  └─ optimize-images.mjs  # sharp: crop + WebP multi-resolução
├─ src/
│  ├─ main.tsx
│  ├─ routes.tsx
│  ├─ content/site.ts
│  ├─ components/
│  │  ├─ layout/  RootLayout · Header · Footer · PageTransition
│  │  ├─ ui/      Button · Section · Card · Reveal
│  │  ├─ Logo.tsx · WhatsAppFab.tsx
│  │  └─ home/    Hero · Comparison · Differentials · Gallery · TrustBadges · FinalCta
│  ├─ pages/      Home · Servicos · Sobre · Contato · NotFound
│  ├─ hooks/      useSeo · usePrefersReducedMotion
│  └─ lib/        whatsapp.ts
└─ vercel.json
```

### Unidades e responsabilidades

**`content/site.ts`** — fonte única de verdade para telefone, número de WhatsApp, lista de serviços, selos, diferenciais, pares da comparação e metadados das fotos. Nenhum outro arquivo contém o telefone em string literal.
*Justificativa: o número aparece em 6 lugares (header, footer, FAB, hero, página de contato, formulário). Espalhado, uma troca de número deixa um resíduo errado em algum canto.*

**`lib/whatsapp.ts`** — funções puras, sem dependência de React:
- `whatsappUrl(message?: string): string` — monta `https://wa.me/5519992715025` com `?text=` corretamente codificado.
- `formToMessage(form: ContactForm): string` — serializa nome, telefone, bairro e mensagem em texto legível com quebras de linha.
É a única lógica real do projeto e a única coberta por testes.

**`components/ui/Reveal.tsx`** — encapsula o padrão `whileInView` (fade + slide-up, com `stagger` opcional para grids). Evita repetir variantes do Framer Motion em ~15 arquivos e centraliza o respeito a reduced-motion.

**`hooks/usePrefersReducedMotion.ts`** — lê `matchMedia('(prefers-reduced-motion: reduce)')` e reage a mudanças. Consumido por `Hero`, `Reveal` e `WhatsAppFab`.

**`hooks/useSeo.ts`** — define `document.title` e a meta description por página.

## Hero

O elemento central do projeto.

**Desktop (≥1024px):** grid de 2 colunas. Coluna esquerda em navy `#0B2545` com o conteúdo textual; coluna direita é um painel de foto vertical ocupando 100% da altura do hero, com `overflow: hidden`. As fotos aparecem em proporção próxima da nativa — sem upscale e sem cortar a água.

**Mobile (<1024px):** full-bleed conforme o brief — foto vertical cobrindo a viewport em `100svh`, overlay em gradiente navy de baixo para cima garantindo contraste, texto sobreposto. É o formato nativo das fotos e a origem da maioria dos leads.
*`svh` e não `vh`: no mobile a barra do navegador aparece e some durante o scroll, e `100vh` faz o hero saltar de altura quando isso acontece.*

**Animação:**
- Cada foto permanece 8s em cena. A troca é um crossfade de 1.2s em que a foto seguinte entra por cima antes de a anterior sair — nunca há um quadro sem imagem. Ciclo total de 8s por foto, via `AnimatePresence` sobre um índice em estado.
- Ken Burns: cada foto anima `scale` de 1 para 1.08 ao longo dos seus 8s em cena, easing linear. O zoom começa no momento em que a foto entra, não no fim do crossfade.
- Headline em duas linhas (`Piscina sempre cristalina.` / `Sem você precisar pensar nisso.`) com reveal linha a linha — fade + slide-up, stagger de ~0.12s.
- Subheadline com fade-in atrasado em 0.3s após a headline.
- CTA `Falar com a PGW no WhatsApp`: hover `scale 1.03` + sombra; pulse contínuo sutil.
- Indicador de scroll animado no rodapé do hero.

**Reduced motion:** com `prefers-reduced-motion: reduce` ativo, o Ken Burns e o pulse são desligados e o crossfade vira troca de opacidade curta. Os textos aparecem sem slide.
*Acréscimo ao brief. Custo baixo e evita desconforto real em quem tem sensibilidade vestibular.*

## Pipeline de imagens

`scripts/optimize-images.mjs` roda uma vez com `sharp`, lê os 4 JPGs da raiz e grava WebP em `public/images/` nas larguras 640/900/1280, servidos por `srcset`. Saídas versionadas no repositório — o script não roda no build.

Crops por foto:

| Foto | Uso | Crop |
|---|---|---|
| `piscina2` | hero (primeira) + galeria | deck e spa, enquadramento cheio |
| `piscina1` | hero + galeria | corte no topo, remove a capa azul amassada |
| `piscina3` | hero + galeria | corte inferior, reduz o flare de sol |
| `piscina4` | hero + galeria | corte no topo, remove carros e casas vizinhas |

Carregamento: a primeira foto do hero (`piscina2`) entra por `<link rel="preload">` no `index.html` e é a LCP. As outras três fotos do hero são pré-carregadas em background após o mount, para que o primeiro crossfade não mostre um painel vazio. Todas as imagens fora do hero usam `loading="lazy"`.

## Páginas

### Home (`/`)

1. Hero (acima)
2. **Com PGW × Sem PGW** — duas colunas: dor à esquerda em cinza com ícone de X, benefício à direita em card navy com check turquesa. 5 pares:
   - Água turva justo quando chega visita → Água cristalina o ano todo
   - Seu fim de semana comprando cloro e medindo pH → Tratamento químico feito por quem entende
   - Bomba queima e vira gasto de emergência → Manutenção preventiva de bomba e filtro
   - Prestador que some e não responde → Atendimento pontual, resposta no WhatsApp
   - Um técnico diferente a cada visita → Equipe própria, sempre as mesmas pessoas
3. **Diferenciais** — 4 cards com stagger: água sempre cristalina; equipe própria e de confiança; produtos de qualidade; atendimento pontual sem enrolação
4. **Galeria** — as 4 fotos em grid, fade-in on scroll
5. **Selos de confiança** — faixa com os 4 selos confirmados
6. **CTA final** + FAB de WhatsApp fixo (presente em todas as páginas)

### Serviços (`/servicos`)

Um card por serviço, com os 4 serviços confirmados. Cada card tem título, descrição curta em linguagem de dono de casa e CTA para o WhatsApp com mensagem pré-preenchida citando o serviço. Nenhum preço.

### Sobre (`/sobre`)

História da PGW: fundada por um grupo de amigos em Campinas, focada em manter piscinas sempre prontas para uso, com atendimento pessoal — o diferencial de uma equipe pequena contra grandes prestadoras impessoais.

`[PLACEHOLDER: nomes dos sócios/fundadores]` renderizado de forma **visível** na página, não como comentário no código, para que seja impossível publicar sem perceber.

### Contato (`/contato`)

- CTA principal grande: `Falar no WhatsApp` → `https://wa.me/5519992715025`
- Telefone visível e clicável: `(19) 99271-5025`
- Área de atuação: Campinas e região
- Formulário opcional (nome, telefone, bairro, mensagem) que **não envia nada a servidor algum** — monta a mensagem e abre o WhatsApp com o texto pré-preenchido via `formToMessage` + `whatsappUrl`

### 404 (`*`)

Página simples com link de volta para a home e CTA de WhatsApp.

## Micro-interações

- Scroll reveal em todas as seções via `Reveal` (fade + slide-up, stagger em grids)
- Transição entre páginas: fade de ~200ms via `PageTransition` + `AnimatePresence`
- FAB de WhatsApp com pulse infinito sutil

Todas desligadas sob `prefers-reduced-motion`.

## SEO e compartilhamento

**Problema identificado:** SPA em Vite não renderiza no servidor, e o crawler do WhatsApp não executa JavaScript. Meta tags de Open Graph injetadas por hook não seriam lidas. Num site cujo objetivo inteiro é ser compartilhado no WhatsApp, o link colado num grupo apareceria sem imagem e sem descrição.

**Solução:**
- `og:title`, `og:description`, `og:image` e `twitter:card` ficam **estáticos no `index.html`** — são os mesmos para o site inteiro.
- `<title>` e meta description por página vão pelo hook `useSeo`, suficiente para o Google, que executa JS.
- `public/og.jpg` gerado a partir de `piscina2` com o wordmark aplicado, 1200×630.

Meta tags focadas em "limpeza de piscina Campinas" e "manutenção de piscina Campinas SP". `robots.txt` e `sitemap.xml` estáticos com as 4 rotas.

## Deploy

Vercel, build Vite padrão. `vercel.json` com rewrite de todas as rotas para `/index.html` — **sem isso, `/servicos` acessado diretamente retorna 404**, porque o roteamento é client-side.

## Testes

Escopo proporcional a um site institucional de 4 páginas.

**Vitest, cobrindo `lib/whatsapp.ts`:**
- `whatsappUrl()` sem mensagem retorna a URL base correta
- `whatsappUrl()` com mensagem codifica acentos e quebras de linha corretamente
- `formToMessage()` produz texto legível com todos os campos preenchidos
- `formToMessage()` omite campos opcionais vazios sem deixar linha órfã

*Justificativa do escopo: encoding de acento e quebra de linha em query string erra com facilidade e falha em silêncio — o sintoma é o cliente recebendo mensagem com caractere quebrado, descoberto tarde. É a única lógica não trivial do projeto. Snapshot de componente não pagaria o custo de manutenção aqui.*

**Verificação manual:** navegador via preview, incluindo desktop e mobile, checagem de console e Lighthouse.

## Metas de qualidade

- Lighthouse ≥ 90 em Performance, Acessibilidade, Best Practices e SEO
- Mobile-first
- Sem erros de console
- Contraste adequado do texto sobre as fotos em todos os 4 crops

## Pendências antes de publicar

1. **Nomes dos sócios** — placeholder visível na página Sobre, a ser preenchido pelo Gabriel
2. **Erro de grafia na logo impressa** — `MANUTENÇÃÓ` deve virar `MANUTENÇÃO` antes de ir para uniforme e cartão. Não afeta o site, que não usa a arte original.
3. **Depoimentos** — adicionar seção somente quando existirem depoimentos reais de clientes

## Fora de escopo

Back-end, formulário com envio por e-mail, blog, área do cliente, tabela de preços, integração com CRM, múltiplos idiomas.
