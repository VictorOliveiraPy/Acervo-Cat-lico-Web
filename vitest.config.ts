import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Testes cobrem apenas `lib/**` e rodam em ambiente `node`, sem jsdom.
 *
 * É uma escolha de arquitetura, não economia: toda regra de verdade (campos por
 * categoria, destaque do termo na busca, paginação) mora em módulo puro. Testar
 * componente visual direto seria caro e frágil sem provar nada além de markup.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["lib/**/*.ts"],
      exclude: ["lib/**/*.test.ts"],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
      },
    },
  },
});
