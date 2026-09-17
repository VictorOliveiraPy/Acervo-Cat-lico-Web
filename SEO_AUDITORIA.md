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

## Auditoria de implementacao do novo layout

Data da revisao: 2026-09-16

### Fase 1 — Diagnostico

- [x] Mantida a stack existente: Next.js App Router, React, Tailwind e Server Components.
- [x] Mantidas as rotas, chamadas de API, URLs publicas e funcionalidades de busca, liturgia e velas.
- [x] Identificada a necessidade de hierarquia editorial mais clara na home.
- [x] Identificada a necessidade de busca contextual nas categorias.
- [x] Identificada a necessidade de tratar `prefers-reduced-motion` e revisar alt text.

### Fase 2 — Correcoes aplicadas

- [x] Home reorganizada para explorar a fe por grandes grupos reais de categorias, sem inventar contagens.
- [x] Bloco de amostra renomeado para `Descubra algo novo`, com texto editorial curto.
- [x] Liturgia da home passou a exibir cor liturgica, Evangelho e primeira leitura quando fornecidos pela API.
- [x] Categorias receberam busca contextual preservando `categoria` nos modos com e sem JavaScript.
- [x] Adicionada regra global de reducao de movimento para usuarios que a solicitarem.
- [x] Imagem decorativa do cabecalho deixou de expor texto alternativo conflitante com `aria-hidden`.

### Fase 3 — Preservacao

- [x] Nenhuma URL ou contrato de API foi alterado.
- [x] Conteudo editorial existente foi preservado.
- [x] Dados exibidos na home continuam vindo da API e dos grupos existentes.
- [x] SEO, sitemap, robots, canonicals e redirecionamento do dominio foram preservados.

### Fase 4 — Validacao

- [x] Diagnostico do VS Code: nenhum erro nos arquivos alterados.
- [x] TypeScript passou sem diagnosticos usando `tsc --noEmit --incremental false`.
- [x] Testes passaram: 5 arquivos e 38 testes.
- [x] Lint do Next passou sem saidas de erro.
- [ ] Concluir `npm run build` no frontend.
- [ ] Testar visualmente em 320, 360, 375, 390, 414, 768, 1024, 1280 e 1440 pixels.
- [ ] Conferir teclado, contraste, foco, leitor de tela e reducao de movimento.
- [ ] Fazer deploy e verificar HTML, sitemap, canonicals e redirecionamento `www` em producao.

### Pendencias fora deste ciclo

- [ ] Relacionamentos semanticos reais entre verbetes ainda nao existem no contrato da API; nao foram inventados.
- [ ] Imagens continuam com a estrategia atual de `unoptimized`; uma troca exige decisao de CDN/cache e medicao de performance.
- [ ] A geracao do sitemap continua dependente da consulta paginada a API; monitorar tempo de geracao no deploy.

## Relatorio da Sprint 1 — 2026-09-16

### Entregas

- [x] Liturgia com hierarquia clara: `Liturgia de hoje`, data e celebracao no subtitulo.
- [x] Busca registra eventos `search_submitted` com tamanho da consulta e filtro de categoria.
- [x] Vela registra `candle_lit` e apresenta sucesso/erro com aria-live e destaque visual.
- [x] Home carrega apenas as duas primeiras imagens da vitrine como prioridade; as demais ficam lazy.
- [x] Campo de busca contextual preserva a categoria durante o envio com e sem JavaScript.

### Validacao

- [x] TypeScript sem erros.
- [x] 38 testes passando.
- [x] Lint passou; permanece apenas o aviso conhecido de `img` no cabecalho.
- [x] Nenhum contrato de API ou URL foi alterado.

### Publicacao

- [x] Commit e push da Sprint 1: `94e9120`.
- [ ] Confirmar deploy da Vercel e eventos no destino de analytics.

## Relatorio da Sprint 2 — 2026-09-16

### Entregas

- [x] Conteudos relacionados agora priorizam tags reais do verbete e podem atravessar categorias.
- [x] Fallback preservado para outros verbetes da mesma categoria quando nao ha resultados por tags.
- [x] Titulo da secao de relacionados alterado para `Continue sua leitura`.
- [x] Categoria exibida nos itens relacionados para deixar clara a procedencia.
- [x] `Perguntar ao acervo` ganhou CTA visivel na home, sem substituir a busca.

### Validacao

- [x] TypeScript sem erros.
- [x] 38 testes passando.
- [x] Lint passou; permanece apenas o aviso conhecido de `img` no cabecalho.
- [x] Nenhum contrato de API ou URL foi alterado.

### Publicacao

- [x] Commit e push da Sprint 2: `4f47863`.
- [ ] Confirmar no deploy que a busca por tags nao aumenta o tempo de resposta das paginas.

## Relatorio da Sprint 3 — 2026-09-16

### Entregas

- [x] Verbetes podem ser guardados localmente neste navegador, sem conta e sem enviar dados pessoais.
- [x] Adicionado compartilhamento nativo quando o dispositivo oferece Web Share API.
- [x] Fallback de compartilhamento copia o link quando Web Share nao esta disponivel.
- [x] Eventos `entry_favorited` e `entry_shared` preparados no mesmo barramento de analytics.

### Validacao

- [x] TypeScript sem erros apos corrigir a deteccao da Web Share API.
- [x] 38 testes passando.
- [x] Lint passou; permanece apenas o aviso conhecido de `img` no cabecalho.
- [x] Build compilou e passou a fase de lint/typecheck; o Next ainda sinaliza que paginas com edge runtime nao sao estaticas.

### Publicacao

- [x] Commit e push da Sprint 3: `84abc13`.
- [ ] Confirmar deploy final na Vercel.
- [ ] Conectar o barramento de eventos a uma ferramenta de analytics com consentimento adequado.
