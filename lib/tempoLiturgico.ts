/**
 * Tempo litúrgico de uma data, calculado pelo calendário romano como se usa no
 * Brasil (Epifania no domingo entre 2 e 8 de janeiro). A liturgia do dia só diz o
 * tempo quando o nome da celebração o menciona; em dia de memória ou festa ela
 * diz o santo, e o cartão "Tempo litúrgico" ficava repetindo o santo.
 *
 * Datas como `AAAA-MM-DD`, contadas em UTC para não depender do fuso da máquina.
 */

export type TempoLiturgico = {
  tempo: "Advento" | "Tempo do Natal" | "Tempo Comum" | "Quaresma" | "Semana Santa" | "Tempo Pascal";
  /** Só no Tempo Comum: a semana, de 1 a 34. */
  semana: number | undefined;
};

const DIA = 24 * 60 * 60 * 1000;

const emDias = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / DIA;
const diaDaSemana = (dias: number) => new Date(dias * DIA).getUTCDay(); // 0 = domingo
const domingoAteDia = (dias: number) => dias - diaDaSemana(dias);

/** Domingo de Páscoa do calendário gregoriano (algoritmo de Meeus/Jones/Butcher). */
export function domingoDePascoa(ano: number): string {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

/** Batismo do Senhor: domingo depois da Epifania, ou a segunda-feira se ela cair em 7 ou 8. */
function batismoDoSenhor(ano: number): number {
  const epifania = domingoAteDia(emDias(`${ano}-01-08`));
  const diaDoMes = new Date(epifania * DIA).getUTCDate();
  return diaDoMes >= 7 ? epifania + 1 : epifania + 7;
}

/** 1º domingo do Advento: o quarto domingo antes do Natal (entre 27/11 e 3/12). */
const primeiroDoAdvento = (ano: number) => domingoAteDia(emDias(`${ano}-12-24`)) - 21;

export function tempoLiturgico(data: string): TempoLiturgico {
  const dia = emDias(data);
  const ano = Number(data.slice(0, 4));
  const pascoa = emDias(domingoDePascoa(ano));
  const advento = primeiroDoAdvento(ano);
  const batismo = batismoDoSenhor(ano);
  const sem = (tempo: TempoLiturgico["tempo"]): TempoLiturgico => ({ tempo, semana: undefined });

  if (dia >= emDias(`${ano}-12-25`) || dia <= batismo) return sem("Tempo do Natal");
  if (dia >= advento) return sem("Advento");
  if (dia >= pascoa && dia <= pascoa + 49) return sem("Tempo Pascal");
  if (dia >= pascoa - 7 && dia < pascoa) return sem("Semana Santa");
  if (dia >= pascoa - 46 && dia < pascoa - 7) return sem("Quaresma");

  // Tempo Comum: antes da Quaresma conta-se do Batismo; depois de Pentecostes,
  // para trás a partir de Cristo Rei, que abre sempre a 34ª semana.
  const semana =
    dia < pascoa
      ? Math.floor((dia - domingoAteDia(batismo)) / 7) + 1
      : 34 - (advento - 7 - domingoAteDia(dia)) / 7;
  return { tempo: "Tempo Comum", semana };
}

/** "Tempo Comum · 33ª semana", "Advento". */
export function tempoLiturgicoRotulo(data: string): string {
  const { tempo, semana } = tempoLiturgico(data);
  return semana ? `${tempo} · ${semana}ª semana` : tempo;
}
