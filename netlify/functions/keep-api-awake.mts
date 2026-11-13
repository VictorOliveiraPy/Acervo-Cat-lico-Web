// Mantém a API do Render acordada: no plano grátis ela dorme após 15 min sem
// requisição, e o primeiro acesso depois disso leva ~1 min (estoura o build).
import { getApiBaseUrl } from "../../lib/api";

export default async () => {
  const res = await fetch(`${getApiBaseUrl()}/health`);
  console.log(`API /health ${res.status}`);
};

// Cron não tem granularidade de segundos; 5 min fica bem abaixo dos 15 de sono.
export const config = { schedule: "*/5 * * * *" };
