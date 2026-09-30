"use client";

import { useEffect } from "react";

/**
 * Ajusta `<html lang>` nas páginas traduzidas.
 *
 * O layout raiz é único (o `lang="pt-BR"` dele vale para o site em português) e
 * torná-lo dinâmico por idioma exigiria ler headers da requisição, o que tira
 * o site inteiro da geração estática. Aqui o atributo é corrigido no cliente;
 * para os buscadores, o idioma da página vem de `hreflang`, do `og:locale` e do
 * `inLanguage` do JSON-LD, que já saem certos no HTML do servidor.
 */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = "pt-BR";
    };
  }, [lang]);
  return null;
}
