import type { Atendente, Departamento } from "@/lib/tipos";
import { TETO_ATENDIMENTOS } from "@/lib/tipos";
import { dentroDoExpediente } from "@/lib/expediente/expediente";

export type ParamsRodizio = {
  departamento: Departamento;
  atendentes: Atendente[];
  carga: Record<string, number>;
  ponteiro: number;
  agora: Date;
};

export type ResultadoRodizio = {
  atendente: Atendente | null;
  proximoPonteiro: number;
};

export const proximoAtendente = ({
  departamento,
  atendentes,
  carga,
  ponteiro,
  agora,
}: ParamsRodizio): ResultadoRodizio => {
  if (!dentroDoExpediente(agora)) return { atendente: null, proximoPonteiro: ponteiro };

  const doDepartamento = atendentes
    .filter((a) => a.departamentos.includes(departamento))
    .sort((a, b) => a.ordem - b.ordem);

  if (doDepartamento.length === 0) return { atendente: null, proximoPonteiro: ponteiro };

  for (let passo = 0; passo < doDepartamento.length; passo++) {
    const indice = (ponteiro + passo) % doDepartamento.length;
    const candidato = doDepartamento[indice];
    const apto = candidato.disponivel && (carga[candidato.id] ?? 0) < TETO_ATENDIMENTOS;
    if (apto) {
      return { atendente: candidato, proximoPonteiro: (indice + 1) % doDepartamento.length };
    }
  }

  return { atendente: null, proximoPonteiro: ponteiro };
};
