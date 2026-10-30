/**
 * Definido em `next.config.js` no build. Fica fora de `lib/auth.ts` para os
 * componentes do navegador não importarem o código de servidor do login.
 */
export const LOGIN_ENABLED = process.env.NEXT_PUBLIC_LOGIN_ENABLED === "1";
