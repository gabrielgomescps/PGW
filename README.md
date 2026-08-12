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

## Domínio

`pgwpiscinas.com.br`, confirmado. Ele aparece em três lugares e os três precisam
mudar juntos se o domínio mudar: `public/robots.txt`, `public/sitemap.xml` e as
tags `og:image` / `og:url` em `index.html`. As tags Open Graph exigem URL
absoluta — o crawler do WhatsApp não resolve caminho relativo, e sem elas um
link colado em grupo aparece sem imagem.

## Pendências antes de publicar

- **Rodar o Lighthouse.** A meta é 90+ em Performance, Acessibilidade, Best
  Practices e SEO, e ela nunca foi medida — a máquina onde o site foi construído
  não tinha Chrome instalado.
- **Conferir as animações num navegador real.** O crossfade e o Ken Burns do
  hero, o pulse do botão, a transição de 200ms entre páginas e o menu mobile a
  375px foram verificados por configuração no código, não observados rodando.
- Corrigir a grafia `MANUTENÇÃÓ` na arte impressa da logo (não afeta o site,
  que não usa a arte original)

## Deploy

Vercel, build Vite padrão. O `vercel.json` reescreve todas as rotas para
`index.html`, o que é necessário para o roteamento client-side funcionar em
links diretos.
