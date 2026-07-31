import {
  ASSUNTOS_CLIENTE,
  OPCOES_INICIAIS,
  resolverAssuntoCliente,
  resolverOpcaoInicial,
} from "@/lib/simulador/fluxo-manual";
import { DEPARTAMENTOS, type Departamento } from "@/lib/tipos";

export type EtapaManual =
  | "saudacao"
  | "opcao_inicial"
  | "assuntos"
  | "descricao"
  | "encaminhado";

export type RegistroManual = {
  id: string;
  autor: "cliente" | "sistema";
  texto: string;
  formato: "texto" | "botoes" | "lista";
  em: string;
};

export type SessaoManual = {
  etapa: EtapaManual;
  departamento: Departamento | null;
  assunto: string | null;
  registros: RegistroManual[];
};

const registro = (
  sessao: SessaoManual,
  autor: RegistroManual["autor"],
  texto: string,
  formato: RegistroManual["formato"],
  em: string,
): RegistroManual => ({
  id: `manual-${sessao.registros.length + 1}-${new Date(em).getTime()}`,
  autor,
  texto,
  formato,
  em,
});

export const criarSessaoManual = (): SessaoManual => ({
  etapa: "saudacao",
  departamento: null,
  assunto: null,
  registros: [],
});

export const iniciarAtendimentoManual = (
  sessao: SessaoManual,
  texto: string,
  em: string,
): SessaoManual => {
  if (sessao.etapa !== "saudacao") return sessao;

  const cliente = registro(sessao, "cliente", texto, "texto", em);
  const parcial = { ...sessao, registros: [...sessao.registros, cliente] };
  const sistema = registro(
    parcial,
    "sistema",
    "Olá! Como podemos ajudar hoje?",
    "botoes",
    em,
  );

  return {
    ...parcial,
    etapa: "opcao_inicial",
    registros: [...parcial.registros, sistema],
  };
};

export const selecionarOpcaoManual = (
  sessao: SessaoManual,
  id: string,
  em: string,
): SessaoManual | null => {
  if (sessao.etapa !== "opcao_inicial") return null;

  const encaminhamento = resolverOpcaoInicial(id);
  const opcao = OPCOES_INICIAIS.find((item) => item.id === id);
  if (!encaminhamento || !opcao) return null;

  const escolha = registro(sessao, "cliente", opcao.titulo, "texto", em);
  const parcial = { ...sessao, registros: [...sessao.registros, escolha] };

  if (encaminhamento.proximaEtapa === "assuntos") {
    const lista = registro(
      parcial,
      "sistema",
      "Escolha o assunto do seu atendimento.",
      "lista",
      em,
    );
    return {
      ...parcial,
      etapa: "assuntos",
      registros: [...parcial.registros, lista],
    };
  }

  const pedido = registro(
    parcial,
    "sistema",
    "Conte brevemente como podemos ajudar.",
    "texto",
    em,
  );
  return {
    ...parcial,
    etapa: "descricao",
    departamento: encaminhamento.departamento,
    assunto: encaminhamento.assunto,
    registros: [...parcial.registros, pedido],
  };
};

export const selecionarAssuntoManual = (
  sessao: SessaoManual,
  id: string,
  em: string,
): SessaoManual | null => {
  if (sessao.etapa !== "assuntos") return null;

  const encaminhamento = resolverAssuntoCliente(id);
  const assunto = ASSUNTOS_CLIENTE.find((item) => item.id === id);
  if (!encaminhamento || !assunto) return null;

  const escolha = registro(sessao, "cliente", assunto.titulo, "texto", em);
  const parcial = { ...sessao, registros: [...sessao.registros, escolha] };
  const pedido = registro(
    parcial,
    "sistema",
    "Conte brevemente o que aconteceu para a equipe receber o contexto.",
    "texto",
    em,
  );

  return {
    ...parcial,
    etapa: "descricao",
    departamento: encaminhamento.departamento,
    assunto: encaminhamento.assunto,
    registros: [...parcial.registros, pedido],
  };
};

export const concluirDescricaoManual = (
  sessao: SessaoManual,
  texto: string,
  em: string,
): {
  sessao: SessaoManual;
  departamento: Departamento;
  contexto: string;
} | null => {
  const descricao = texto.trim();
  if (
    sessao.etapa !== "descricao" ||
    !sessao.departamento ||
    !sessao.assunto ||
    !descricao
  ) {
    return null;
  }

  const cliente = registro(sessao, "cliente", descricao, "texto", em);
  const parcial = { ...sessao, registros: [...sessao.registros, cliente] };
  const confirmacao = registro(
    parcial,
    "sistema",
    `Recebemos sua solicitação e encaminhamos para o setor ${
      DEPARTAMENTOS[sessao.departamento]
    }.`,
    "texto",
    em,
  );

  return {
    departamento: sessao.departamento,
    contexto: `${sessao.assunto}: ${descricao}`,
    sessao: {
      ...parcial,
      etapa: "encaminhado",
      registros: [...parcial.registros, confirmacao],
    },
  };
};
