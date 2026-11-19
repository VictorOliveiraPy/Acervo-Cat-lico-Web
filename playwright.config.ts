import { defineConfig, devices } from "@playwright/test";

/**
 * Jornadas do site no navegador, contra a API local de verdade (sem mock): sobe a API
 * do repositório irmão e o front em modo dev, cada um numa porta própria, para não
 * brigar com quem já estiver rodando o projeto na 3000 e na 8000.
 *
 * Usa o Google Chrome da máquina (`channel: "chrome"`), sem baixar navegador. Numa
 * máquina sem Chrome: `npx playwright install chromium` e `E2E_CHANNEL=` vazio.
 */
const API_PORT = 8100;
const WEB_PORT = 3300;

export default defineConfig({
  testDir: "./e2e",
  // O modo dev compila cada página na primeira visita.
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${WEB_PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], channel: process.env.E2E_CHANNEL ?? "chrome" },
    },
    {
      name: "celular",
      use: { ...devices["Pixel 7"], channel: process.env.E2E_CHANNEL ?? "chrome" },
    },
  ],
  webServer: [
    {
      command: `.venv/bin/python -m uvicorn app.main:app --port ${API_PORT}`,
      cwd: "../Acervo-Cat-lico-API",
      url: `http://127.0.0.1:${API_PORT}/api/health`,
      timeout: 60_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `node node_modules/next/dist/bin/next dev -p ${WEB_PORT}`,
      url: `http://127.0.0.1:${WEB_PORT}/sobre`,
      timeout: 180_000,
      reuseExistingServer: !process.env.CI,
      env: {
        API_URL: `http://127.0.0.1:${API_PORT}/api`,
        // O login liga quando há AUTH_GOOGLE_ID (next.config.js). Valores de mentira:
        // só servem para o next-auth montar o redirecionamento; ninguém entra aqui.
        AUTH_GOOGLE_ID: "e2e",
        AUTH_GOOGLE_SECRET: "e2e",
        AUTH_SECRET: "segredo-so-dos-testes-e2e",
        NEXTAUTH_URL: `http://127.0.0.1:${WEB_PORT}`,
      },
    },
  ],
});
