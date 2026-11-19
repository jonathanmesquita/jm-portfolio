# v1.2.0 — QA

Data: 2026-11-19 (America/Sao_Paulo). Build de produção (`vite build` + `vite preview`) em Chromium.

## Testes automatizados (`npm test`)

10 aprovados, 0 reprovados. Rodam sozinhos em todo PR (`.github/workflows/ci.yml`):

1. Todas as fileiras e títulos renderizam, sem erro de console nem de rede.
2. Passar o mouse num título no ar toca a prévia; título bloqueado não tem vídeo.
3. Janela de detalhes: hash, link para a página do projeto, Esc devolve o foco.
4. Título bloqueado não mostra link.
5. Filtro troca as fileiras por uma grade com os títulos certos.
6. EN → PT → EN traduz a página e mantém a janela aberta.
7. Movimento reduzido: nada toca sozinho.
8. As 36 páginas de projeto (18 × 2 idiomas) e as imagens de compartilhamento respondem 200; o
   sitemap tem 37 endereços.
9. Sem rolagem horizontal em 320 px (home e duas páginas de projeto).
10. axe sem violação WCAG A/AA em cinco estados, a 1440 e 375 px.

## Lighthouse mobile (local)

| Página | Performance | Acessibilidade | Boas práticas | SEO |
|---|---:|---:|---:|---:|
| `/` | 97 | 100 | 96 | 100 |
| `/work/arriba/` | 98 | 100 | 96 | 100 |

Boas práticas em 96 por um único motivo: `/_vercel/insights/script.js` dá 404 fora da Vercel.
Na Vercel, com **Analytics ligado no projeto**, o script existe e o erro some. Se o Analytics
ficar desligado, o 404 acontece também em produção — ligar ou remover `startAnalytics()`.

## Atualização automática das prévias

`update.mjs` testado de ponta a ponta para base64, store-analysis, arriba, nexus e csv-reader;
`--changed` diz "nothing changed" quando o lock confere. **O workflow semanal ainda não rodou**
— só roda no GitHub, e precisa da opção "Allow GitHub Actions to create and approve pull
requests" ligada no repositório.

## Não verificado

- Prévia de link no LinkedIn/WhatsApp: as tags e as imagens existem e respondem, mas só dá para
  ver o cartão depois do deploy (o LinkedIn tem o Post Inspector para isso).
- Eventos personalizados do Analytics dependem do plano da Vercel.
- Safari/iOS real.
