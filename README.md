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

## Lighthouse

Medido no build de produção servido por `vite preview`, com o Microsoft Edge em
modo headless:

| Perfil | Performance | Acessibilidade | Best Practices | SEO |
|---|---|---|---|---|
| Mobile | 92 | 100 | 100 | 100 |
| Desktop | 99 | 100 | 100 | 100 |

No mobile: LCP 2,8 s, FCP 2,5 s, TBT 0 ms, CLS 0,001, nenhuma auditoria
reprovada. A única oportunidade restante é ~150 ms de JavaScript não usado — o
`framer-motion` vem num chunk único. Se algum dia isso incomodar, o caminho é
code-splitting por rota.

Para repetir a medição:

```bash
npm run build
npx vite preview --port 4173
CHROME_PATH="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" npx lighthouse@12 http://localhost:4173/ --chrome-flags="--headless=new"
```

## Pendências antes de publicar

- **Conferir as animações num navegador real.** O crossfade e o Ken Burns do
  hero, o pulse do botão, a transição de 200 ms entre páginas e o menu mobile a
  375 px foram verificados por configuração no código e por medição estática,
  não observados rodando — o ambiente onde o site foi construído não compunha
  frames.
- Corrigir a grafia `MANUTENÇÃÓ` na arte impressa da logo (não afeta o site,
  que não usa a arte original)

## Deploy

Vercel, build Vite padrão. O `vercel.json` reescreve todas as rotas para
`index.html`, o que é necessário para o roteamento client-side funcionar em
links diretos.
