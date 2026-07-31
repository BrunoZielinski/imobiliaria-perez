import type { Departamento } from "@/lib/tipos";

export const OPCOES_INICIAIS = [
  { id: "comprar_alugar", titulo: "Comprar/alugar" },
  { id: "cliente_atual", titulo: "Já sou cliente" },
  { id: "outros_assuntos", titulo: "Outros assuntos" },
] as const;

export const ASSUNTOS_CLIENTE = [
  {
    id: "financeiro_boletos",
    titulo: "Financeiro/boletos",
    descricao: "Pagamentos, multas e segunda via",
  },
  {
    id: "manutencao",
    titulo: "Manutenção",
    descricao: "Reparo em imóvel alugado",
  },
  {
    id: "vistoria_saida",
    titulo: "Vistoria/saída",
    descricao: "Vistoria e desocupação",
  },
  {
    id: "repasse_proprietario",
    titulo: "Repasse proprietário",
    descricao: "Rendimentos e repasses",
  },
  {
    id: "recepcao_geral",
    titulo: "Recepção/geral",
    descricao: "Demais orientações",
  },
] as const;

export type OpcaoInicialId = (typeof OPCOES_INICIAIS)[number]["id"];
export type AssuntoClienteId = (typeof ASSUNTOS_CLIENTE)[number]["id"];

type AbrirAssuntos = {
  proximaEtapa: "assuntos";
};

export type EncaminhamentoManual = {
  proximaEtapa: "descricao";
  departamento: Departamento;
  assunto: string;
};

const ENCAMINHAMENTOS_INICIAIS: Partial<
  Record<OpcaoInicialId, EncaminhamentoManual>
> = {
  comprar_alugar: {
    proximaEtapa: "descricao",
    departamento: "comercial",
    assunto: "Comprar ou alugar um imóvel",
  },
  outros_assuntos: {
    proximaEtapa: "descricao",
    departamento: "recepcao",
    assunto: "Outros assuntos",
  },
};

const ENCAMINHAMENTOS_CLIENTE: Record<AssuntoClienteId, EncaminhamentoManual> = {
  financeiro_boletos: {
    proximaEtapa: "descricao",
    departamento: "administrativo",
    assunto: "Financeiro e boletos",
  },
  manutencao: {
    proximaEtapa: "descricao",
    departamento: "administrativo",
    assunto: "Manutenção",
  },
  vistoria_saida: {
    proximaEtapa: "descricao",
    departamento: "administrativo",
    assunto: "Vistoria e desocupação",
  },
  repasse_proprietario: {
    proximaEtapa: "descricao",
    departamento: "administrativo",
    assunto: "Repasse ao proprietário",
  },
  recepcao_geral: {
    proximaEtapa: "descricao",
    departamento: "recepcao",
    assunto: "Recepção e assuntos gerais",
  },
};

export const resolverOpcaoInicial = (
  id: string,
): AbrirAssuntos | EncaminhamentoManual | null => {
  if (id === "cliente_atual") return { proximaEtapa: "assuntos" };
  return ENCAMINHAMENTOS_INICIAIS[id as OpcaoInicialId] ?? null;
};

export const resolverAssuntoCliente = (id: string): EncaminhamentoManual | null =>
  ENCAMINHAMENTOS_CLIENTE[id as AssuntoClienteId] ?? null;
