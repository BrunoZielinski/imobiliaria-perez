import type { CaptacaoPerez, ContratoPerez, ManutencaoPerez } from "./tipos";

export const DATA_DEMO = new Date("2026-08-04T10:00:00-03:00");

const diasEntre = (inicio: Date, fim: Date) => Math.ceil((fim.getTime() - inicio.getTime()) / 86_400_000);

export const resumoContratos = (contratos: ContratoPerez[]) => ({
  ativos: contratos.filter((item) => item.status === "ativo").length,
  reajustesProximos: contratos.filter((item) => item.status === "ativo" && diasEntre(DATA_DEMO, new Date(`${item.proximoReajuste}T12:00:00-03:00`)) <= 60 && diasEntre(DATA_DEMO, new Date(`${item.proximoReajuste}T12:00:00-03:00`)) >= 0).length,
  vencimentosProximos: contratos.filter((item) => diasEntre(DATA_DEMO, new Date(`${item.fim}T12:00:00-03:00`)) <= 60 && diasEntre(DATA_DEMO, new Date(`${item.fim}T12:00:00-03:00`)) >= 0).length,
  atencao: contratos.filter((item) => item.status === "atencao").length,
});

export const agruparCaptacoes = (captacoes: CaptacaoPerez[]) => ({
  avaliacao: captacoes.filter((item) => item.etapa === "avaliacao"),
  documentacao: captacoes.filter((item) => item.etapa === "documentacao"),
  fotografia: captacoes.filter((item) => item.etapa === "fotografia"),
  publicacao: captacoes.filter((item) => item.etapa === "publicacao"),
});

export const agruparManutencoes = (manutencoes: ManutencaoPerez[]) => ({
  urgente: manutencoes.filter((item) => item.status !== "concluida" && item.prioridade === "urgente"),
  alta: manutencoes.filter((item) => item.status !== "concluida" && item.prioridade === "alta"),
  normal: manutencoes.filter((item) => item.status !== "concluida" && item.prioridade === "normal"),
  concluida: manutencoes.filter((item) => item.status === "concluida"),
});
