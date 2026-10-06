# v0.8.0 — QA

Data: 2026-10-05 (America/Sao_Paulo). Build de produção auditado localmente em Chrome.

## Resultado

- Build Vite 8.3.0: aprovado (9 módulos).
- npm audit: zero vulnerabilidades.
- Responsividade: 320, 375, 420, 720, 768, 900, 1024 e 1440 px sem rolagem horizontal. Capturas em docs/qa.
- axe: zero violações e zero verificações incompletas em 375 e 1440 px. Isso não equivale a certificação completa de acessibilidade.
- Teclado: skip link visível com Tab e Enter transfere foco para main-content. Foco visível em fundo claro e no projeto destacado.
- Movimento reduzido: scroll-behavior auto.
- Console: sem erros no build final.
- Links internos: todos os fragmentos possuem destino; links externos usam noopener noreferrer. Email mantém mailto.
- GitHub e Arriba: HTTP 200. LinkedIn bloqueia consulta automatizada; confirmação manual pendente. Não foi enviado email nem testada entrega de mensagens.
- SEO: um h1, lang en, título, descrição, canonical, JSON-LD Person válido e metadados sociais.
- Favicon SVG e PNG, Apple touch icon, imagem OG PNG 1200×630: arquivos presentes no dist e HTTP 200.
- robots.txt permite / e aponta para https://jm.dev.br/sitemap.xml; sitemap lista somente a página canonical, sem âncoras.

## Lighthouse mobile

| Categoria | Nota |
|---|---:|
| Performance | 95 |
| Acessibilidade | 100 |
| Boas práticas | 100 |
| SEO | 100 |

FCP 1,7 s; LCP 1,8 s; Speed Index 2,1 s; TBT 200 ms. Relatório completo: docs/qa/lighthouse-mobile.report.html e .json.

O servidor local não usa compressão nem política de cache de produção. Lighthouse também sinalizou CPU mais lenta que a referência. As notas são desta execução local e devem ser confirmadas na Vercel.

## Ajustes

- Tons de texto verde, terracota e cinza ajustados para contraste, incluindo terracota mais clara no cartão escuro. Paleta, composição e seções Tech Boho preservadas.
- Nome acessível do logo inclui JM., conforme o texto visível.
- Main recebe foco pelo skip link; alvos de navegação têm no mínimo 24 px de altura.
- Email pode quebrar linha em qualquer largura.
- Assets de marca e social, robots e sitemap adicionados.
- Versão 0.8.0 em package, lockfile, README e rodapé.

## Validação na pré-produção

1. Confirmar HTTPS, domínio e redirecionamento www no ambiente de hospedagem.
2. Confirmar compressão/cache no deploy e repetir Lighthouse no preview.
3. Confirmar LinkedIn manualmente.
4. Confirmar imagem social em URL pública (o arquivo foi validado localmente; crawlers ainda não foram testados).
5. Garantir que preview não seja indexado e que produção permita indexação.

Não foi feito deploy. Tag v0.8.0 deve apontar para o commit revisado; não foi criada automaticamente.
