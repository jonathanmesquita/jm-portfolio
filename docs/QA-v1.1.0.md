# v1.1.0 — QA do catálogo

Data: 2026-11-18 (America/Sao_Paulo). Build de produção (`vite build` + `vite preview`) em Chromium.

## Resultado

- Build Vite 8.3.8: aprovado. `npm audit`: zero vulnerabilidades (a 8.3.0 tinha um aviso alto).
- axe (wcag2a, wcag2aa, wcag21aa, best-practice): **zero violações** em 1440 e 375 px, nos três
  estados: página carregada, janela de detalhes aberta e filtro "Data" aplicado.
  Texto sobre imagem é o que o axe não mede: o título dos cards fica sobre um degradê que
  chega a 96% de Ink na faixa do texto.
- Rolagem horizontal da página: nenhuma em 320, 390 e 1440 px. As fileiras rolam por dentro.
- Teclado: Tab percorre os cards (cada um é `<button>`), o foco amplia o card e inicia a
  prévia; Enter abre a janela; Esc fecha e devolve o foco ao card de origem. As setas das
  fileiras aparecem com foco.
- Link direto: `/#work/arriba-jump` abre a janela daquele título; fechar volta para `#work`.
- Movimento reduzido e Save-Data: nenhum vídeo toca sozinho; a janela mostra o vídeo com
  controles.
- Console: sem erros.

## Lighthouse mobile (local)

| Categoria | v1.0.0 | v1.1.0 |
|---|---:|---:|
| Performance | 95 | 99 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 100 | 100 |

FCP 1,7 s; LCP 1,7 s; TBT 0 ms; CLS 0,001; 347 KiB transferidos no carregamento — os vídeos
(~1,7 MB no total) não entram, porque só baixam quando uma prévia começa.
Relatório: `docs/qa/lighthouse-mobile-v1.1.0.report.html`.

Mesma ressalva da v0.8.0: servidor local sem compressão nem cache de produção. Confirmar no
preview da Vercel.

## Capturas

`docs/qa/catalog-desktop.webp`, `catalog-dialog.webp`, `catalog-mobile.webp`.

## Não verificado

- Safari/iOS real (autoplay de vídeo mudo com `playsinline` deve funcionar, mas não foi testado
  em aparelho).
- Os links "Open live" de GitHub Pages e da Arriba foram conferidos pelo código dos
  repositórios, não por requisição: a rede deste ambiente bloqueia esses domínios.
