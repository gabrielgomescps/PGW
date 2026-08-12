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
- Trocar `pgwpiscinas.com.br` pelo domínio real nos três lugares onde ele é
  placeholder: `public/robots.txt`, `public/sitemap.xml` e as tags
  `og:image` / `og:url` em `index.html`
- Corrigir a grafia `MANUTENÇÃÓ` na arte impressa da logo (não afeta o site)

## Deploy

Vercel, build Vite padrão. O `vercel.json` reescreve todas as rotas para
`index.html`, o que é necessário para o roteamento client-side funcionar em
links diretos.
