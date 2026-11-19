import { expect, test } from "@playwright/test";

/**
 * Jornadas principais de quem visita o compêndio. Cada teste é o caminho de uma pessoa
 * de verdade, do clique ao conteúdo, contra a API local (ver playwright.config.ts).
 */

test("a home abre e leva aos santos", async ({ page }) => {
  const resposta = await page.goto("/");
  expect(resposta?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/santos");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("da lista de santos até a página de um santo", async ({ page }) => {
  await page.goto("/santos");
  const primeiro = page.locator('main a[href^="/santos/"]').first();
  const destino = await primeiro.getAttribute("href");
  await primeiro.click();

  await expect(page).toHaveURL(new RegExp(`${destino}$`));
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("a busca encontra verbetes", async ({ page }) => {
  await page.goto("/busca?q=maria");
  await expect(page.locator('main a[href^="/"]').filter({ hasText: /maria/i }).first()).toBeVisible();
});

test("troca para espanhol e volta para português", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");

  await page.locator('a[hreflang="es"]').first().click();
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");

  await page.locator('a[hreflang="pt-BR"]').first().click();
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
});

test("endereço que não existe responde 404 com a página do site", async ({ page }) => {
  const resposta = await page.goto("/um-endereco-que-nao-existe");
  expect(resposta?.status()).toBe(404);
  await expect(page.getByRole("link", { name: /compêndio/i }).first()).toBeVisible();
});

test("o perfil pede login a quem não entrou", async ({ page }) => {
  await page.goto("/perfil");
  await expect(page).toHaveURL(/\/api\/auth\/signin/);
});

test("em inglês, da home até um santo", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[hreflang="en"]').first().click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.goto("/en/santos");
  const primeiro = page.locator('main a[href^="/en/santos/"]').first();
  await primeiro.click();
  await expect(page).toHaveURL(/\/en\/santos\/[^/]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("todo idioma declarado no hreflang abre de verdade", async ({ page, request }) => {
  // A tradução é parcial: declarar um idioma em que a página não existe manda o
  // Google para um 404 e o par inteiro é descartado.
  for (const caminho of ["/", "/santos", "/oracoes", "/santos/francisco-de-assis"]) {
    await page.goto(caminho);
    const alternativos = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
    for (const href of alternativos) {
      const resposta = await request.get(new URL(href).pathname);
      expect(resposta.status(), `${caminho} declara ${href}`).toBe(200);
    }
  }
});

test("a home abre com o dia de hoje e o santo", async ({ page }) => {
  await page.goto("/");
  // O santo do dia (ou a próxima festa) sempre existe no acervo.
  await expect(page.getByText(/Santo do dia|Próxima festa/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Conhecer sua história" })).toBeVisible();
  await expect(page.getByRole("searchbox").first()).toBeVisible();
});

test("o verbete de um santo leva à vela dele já escolhida", async ({ page }) => {
  await page.goto("/santos/antonio-de-padua");
  await expect(page.getByText("Santo Antônio de Pádua, rogai por nós.")).toBeVisible();
  await page.getByRole("link", { name: "Acender uma vela" }).click();
  await expect(page).toHaveURL(/\/velas\?tipo=santo_antonio#acender$/);
  await expect(page.getByRole("radio", { name: /Santo Antônio/ })).toBeChecked();
});

test("o tema troca num botão só", async ({ page }) => {
  await page.goto("/sobre");
  const botao = page.getByRole("button", { name: /^Tema automático/ });
  await botao.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: /^Tema claro/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("o calendário dos santos é um iCalendar válido", async ({ request }) => {
  const resposta = await request.get("/calendario/santos.ics");
  expect(resposta.status()).toBe(200);
  expect(resposta.headers()["content-type"]).toContain("text/calendar");
  const ics = await resposta.text();
  expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
  expect(ics).toContain("UID:francisco-de-assis-10-04@compendio-catolico.com");
});
