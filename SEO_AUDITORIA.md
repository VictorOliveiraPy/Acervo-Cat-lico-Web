# Auditoria de indexacao SEO

Data: 2026-09-16
Dominio auditado: https://compendio-catolico.com
Repositorios auditados: Acervo-Catolico-Web e Acervo-Catolico-API

## Fase 1 — Diagnostico externo

- [x] `robots.txt` acessivel com `Allow: /`.
- [x] Sitemap acessivel em `/sitemap.xml`.
- [x] Paginas de categoria e verbete testadas com `200 OK`.
- [x] Paginas testadas entregam HTML renderizado no servidor.
- [x] Meta robots das paginas principais confirmou `index, follow` antes da correcao.
- [x] Canonical das paginas testadas aponta para o dominio canonico HTTPS.
- [x] Sitemap externo continha 1.800 URLs, sem duplicatas, query strings ou URLs HTTP/www.
- [x] Foi detectado que as versões `www` e raiz respondiam `200` para o mesmo verbete, dividindo sinais entre dois hosts.

Conclusao: nao havia bloqueio global por `robots.txt`, JavaScript, HTTP ou canonical nas paginas principais.

## Fase 2 — Causas encontradas no frontend

- [x] `/busca` estava no sitemap embora seja uma pagina utilitaria e aceite infinitas combinacoes de parametros.
- [x] `/velas` estava no sitemap embora seja uma pagina de participacao/dados dinamicos, sem valor de pagina editorial para busca.
- [x] Listagens paginadas por `?offset=` tinham canonical para a categoria principal, sem declarar explicitamente que nao deveriam ser indexadas.
- [x] O Search Console informa 1.076 URLs como "detectadas, mas nao indexadas"; isso nao pode ser resolvido apenas por metadata e tambem exige avaliacao editorial do Google.

## Fase 3 — Correcoes aplicadas

- [x] `app/busca/page.tsx`: adicionada politica `noindex, follow`.
- [x] `app/velas/page.tsx`: adicionada politica `noindex, follow`.
- [x] `app/[categoria]/page.tsx`: paginas com `offset > 0` agora recebem `noindex, follow`; a primeira pagina de cada categoria continua indexavel.
- [x] `app/sitemap.ts`: removidas `/busca` e `/velas`; o sitemap agora prioriza home, categorias e verbetes editoriais.
- [x] `next.config.js`: adicionado redirecionamento permanente de `www.compendio-catolico.com` para `compendio-catolico.com`.
- [x] Canonicals das paginas editoriais de categoria e verbete foram preservados.

## Fase 4 — Validacao local

- [x] Diagnostico do VS Code: nenhum erro nos quatro arquivos alterados.
- [ ] `npm run typecheck`: a saida do terminal local retornou listagens internas do `node_modules`, sem resultado confiavel; a validacao por diagnostico do TypeScript passou nos arquivos alterados.
- [ ] `npm run build`: executar antes do deploy de producao.
- [ ] Conferir no HTML de producao que `/busca` e `/velas` contenham `noindex`.
- [ ] Conferir no HTML de producao que `/anjos-demonios` contenha `index, follow`.
- [ ] Conferir no HTML de producao que `/anjos-demonios?offset=12` contenha `noindex, follow`.
- [ ] Conferir em producao que qualquer URL `www` responda `308` ou `301` para a URL sem `www`.

## Fase 5 — Acoes necessarias no deploy/Search Console

- [ ] Fazer deploy do repositorio `Acervo-Cat-lico-Web` na Vercel.
- [ ] Confirmar que `https://compendio-catolico.com/sitemap.xml` foi regenerado sem `/busca` e `/velas`.
- [ ] No Search Console, usar Inspecao de URL e solicitar indexacao para uma amostra de categorias e verbetes.
- [ ] Clicar em "Validar correcao" nos grupos de canonical, redirect e noindex depois do deploy.
- [ ] Reenviar o sitemap no Search Console.
- [ ] Reavaliar os grupos apos 2 a 4 semanas; o Google nao garante indexacao imediata.

## Fase 6 — Trabalho editorial ainda pendente

- [ ] Comparar as 17 URLs classificadas como copia sem canonical escolhida pelo usuario.
- [ ] Abrir as 3 URLs rastreadas mas nao indexadas e revisar diferenca real de conteudo.
- [ ] Revisar verbetes muito curtos, repetitivos ou com resumos semelhantes.
- [ ] Garantir fontes, referencias, links internos e valor independente em cada verbete.
- [ ] Monitorar Core Web Vitals, erros 404/5xx e cobertura por tipo de pagina.

## Resultado e limite

As correcoes eliminam URLs utilitarias e paginacoes do conjunto que o Google tenta indexar, mantendo o acervo editorial indexavel. Elas nao permitem forcar o Google a indexar 100% das paginas: a decisao final depende de rastreamento, qualidade percebida, novidade, autoridade e sinais externos.
