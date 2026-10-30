# Tarefas pendentes

O que depende de uma pessoa: acesso, decisão ou revisão. Marque ao concluir.

## Publicar o novo perfil (fazer primeiro, nesta ordem)
O código está pronto e testado na branch `perfil-padroeiro` dos dois repositórios, mas ainda não está em produção.

- [ ] Trocar o `INTERNAL_API_SECRET`. O valor apareceu em uma conversa e dá acesso às anotações de qualquer pessoa. Usar o mesmo valor novo em dois lugares:
  - VPS: `/opt/acervo-catolico-api/deploy/.env`
  - Vercel: variável de ambiente
- [ ] Publicar a API. Tem que ser antes do site, ou `/perfil` quebra:
  ```sh
  cd Acervo-Cat-lico-API
  git switch main && git merge --ff-only perfil-padroeiro && git push origin main
  ssh root@212.28.185.69 'sh /opt/acervo-catolico-api/deploy/atualizar.sh'
  ```
- [ ] Publicar o site. A Vercel faz o deploy sozinha ao receber a `main`, e isso também aplica a troca do segredo:
  ```sh
  cd Acervo-Cat-lico-Web
  git switch main && git merge --ff-only perfil-padroeiro && git push origin main
  ```

## Revisão religiosa
- [ ] Revisar com um padre o exame de consciência e o roteiro "Na hora" (`lib/confissao.ts`). Esses textos vieram do protótipo, sem fonte citada. Os 5 passos já batem com o n. 303 do Compêndio.
- [ ] Olhar os 4 santos em 3D em `/perfil`, principalmente Nossa Senhora. São figuras provisórias, sem rosto.
- [ ] Passar os textos do Catecismo Maior de São Pio X (1905) e do Catecismo da Doutrina Cristã (1912). O Vaticano não os publica, e as lições dependem deles.

## Testar com a sua conta
- [ ] Entrar com o Google em `/perfil` e testar padroeiro, favoritos, anotações e "Guardar texto". Os testes automáticos usaram uma sessão simulada.
- [ ] Testar o exame de consciência no Firefox: marcar, recarregar e ver se as marcações somem.
- [ ] Abrir `/perfil` no celular e ver se o 3D roda bem. Os testes usaram renderização por software.
- [ ] Validar 3 páginas no [Rich Results Test](https://search.google.com/test/rich-results): um santo, um papa e uma oração.

## Textos do site
- [ ] Escrever a página `/sobre` (`app/(pt)/sobre/page.tsx`) e mudar `TEXTO_PRONTO` para `true`. Até lá ela fica em `noindex`.
- [ ] Revisar as 49 descrições das categorias (`lib/categorySeo.ts`), que são provisórias.
- [ ] Escrever as descrições dos temas principais (`THEME_DESCRIPTIONS` em `lib/temas.ts`).

## Search Console
- [ ] Reenviar o sitemap (2500 URLs).
- [ ] Clicar em "Validar correção" nos relatórios de indexação.
- [ ] Conferir "Ações manuais" e, em "Desempenho", a queda de impressões desde 2026-10-02.
- [ ] Exportar a lista das 23 URLs de "cópia sem canônica".
- [ ] Acompanhar os 586 temas: alguns são fracos (século, país) e podem pesar no rastreamento.

## Imagens
- [ ] Aprovar as 29 fotos de santos que estão na pasta. Outras 48 aguardam revisão.
- [ ] Remover os PNGs sem uso em `public/santos/retratos/`.
- [ ] Depois de alguns dias, desativar o `r2.dev` do bucket `compendio-img`, quando nenhuma página citar mais esse endereço.
- [ ] Apagar a cópia `.env.bak-img` em `/opt/acervo-catolico-api/deploy/`.
- [ ] Conferir se a foto sai vazia no gerador de imagens do Instagram. O problema não foi confirmado.

## Decisões em aberto
- [ ] `/velas`: a primeira página é indexável e mostra texto de visitantes. Decidir se precisa de moderação, por risco de spam no Google.
- [ ] Decidir o que fazer com `perfil-padroeiro.html` na raiz do projeto, que está fora do Git.

## Conteúdo e evolução
- [ ] Aprofundar os verbetes curtos: 613 das 1776 entradas têm menos de 100 palavras, e 422 não têm imagem (`content-audit.csv`, no repositório da API).
- [ ] Preencher as seções opcionais dos verbetes: biografia, oração, frases, iconografia, curiosidades e perguntas frequentes.
- [ ] Trocar os santos de primitivas por modelos `.glb` (`SAINT_GLB` em `components/perfil/SaintModel.tsx`).
- [ ] Levar ao espanhol o que existe só em português: WhatsApp, seções opcionais, links de tema, lupa e "Guardar texto".
