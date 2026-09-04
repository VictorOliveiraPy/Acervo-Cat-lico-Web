/**
 * Dashboard PÚBLICO do Himetrica (Project Settings → Public Sharing) para
 * compendio-catolico.com — não o painel privado, que exige login da conta
 * dona. Mesmo padrão do repositório irmão `melhorperfil-web`: um link fixo,
 * sem credencial nenhuma envolvida, porque é público por natureza.
 *
 * `null` até o projeto ser criado no Himetrica e a URL de compartilhamento
 * ser colada aqui — o rodapé só mostra o link "Estatísticas" quando este
 * valor existir (ver `SiteFooter.tsx`), pra nunca publicar um link morto.
 */
export const HIMETRICA_SHARE_URL: string | null =
  "https://www.himetrica.com/share/www.compendio-catolico.com";
