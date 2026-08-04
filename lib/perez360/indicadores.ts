import { CONTRATOS_PEREZ, IMOVEIS_PEREZ, MANUTENCOES_PEREZ } from "./dados";
import type { LancamentoPerez } from "./tipos";

export const DATA_DEMO = new Date("2026-08-04T10:00:00-03:00");

const somar = (itens: LancamentoPerez[]) => itens.reduce((total, item) => total + item.valor, 0);

export const calcularResumoFinanceiro = (lancamentos: LancamentoPerez[]) => ({
  recebimentosPrevistos: somar(lancamentos.filter((item) => item.tipo === "recebimento" && item.status === "previsto")),
  repassesPrevistos: somar(lancamentos.filter((item) => item.tipo === "repasse" && item.status === "previsto")),
  pendencias: somar(lancamentos.filter((item) => item.tipo === "recebimento" && item.status === "pendente")),
  realizado: somar(lancamentos.filter((item) => item.tipo === "recebimento" && item.status === "realizado")),
});

export const calcularIndicadoresExecutivos = () => {
  const imoveisLocacao = IMOVEIS_PEREZ.filter((item) => item.finalidade === "locacao").length;
  const contratosEmOperacao = CONTRATOS_PEREZ.filter((item) => item.status !== "encerrado").length;
  return {
    imoveisAtivos: IMOVEIS_PEREZ.filter((item) => item.statusPublicacao === "publicado").length,
    ocupacao: Math.round((contratosEmOperacao / imoveisLocacao) * 100),
    contratosAtencao: CONTRATOS_PEREZ.filter((item) => item.status === "atencao").length,
    manutencoesAbertas: MANUTENCOES_PEREZ.filter((item) => item.status !== "concluida").length,
  };
};
