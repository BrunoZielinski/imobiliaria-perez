export type Canal = "whatsapp" | "site" | "portal";
export type Departamento = "comercial" | "administrativo" | "recepcao";
export type Papel = "atendente" | "supervisor" | "administrador";
export type StatusConversa = "ana" | "fila" | "atendimento" | "encerrada";
export type ModoTriagem = "ana" | "manual" | "direto";
export type Autor = "contato" | "ana" | "sistema" | "atendente";
export type PipelineId = "venda" | "locacao" | "lancamentos" | "captacao";
export type MotivoAtribuicao = "roleta" | "manual" | "sla";

export type ApresentacaoMensagem =
  | { tipo: "botoes"; opcoes: string[] }
  | { tipo: "lista"; rotulo: string; opcoes: string[] }
  | { tipo: "button_reply" }
  | { tipo: "list_reply" };

export type Contato = {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  criadoEm: string;
};

export type Mensagem = {
  id: string;
  conversaId: string;
  autor: Autor;
  texto: string;
  em: string;
  apresentacao?: ApresentacaoMensagem;
};

export type Conversa = {
  id: string;
  contatoId: string;
  canal: Canal;
  modoTriagem: ModoTriagem;
  departamento: Departamento | null;
  status: StatusConversa;
  atendenteId: string | null;
  criadaEm: string;
  entrouNaFilaEm: string | null;
  primeiraRespostaEm: string | null;
  contextoAna: string | null;
  naoLidas: number;
};

export type Atendente = {
  id: string;
  nome: string;
  departamentos: Departamento[];
  papel: Papel;
  disponivel: boolean;
  ordem: number;
};

export type Imovel = {
  id: string;
  codigo: string;
  tipo: "casa" | "apartamento";
  bairro: string;
  valor: number;
  finalidade: "venda" | "locacao";
};

export type Etapa = { id: string; nome: string };

export type Pipeline = {
  id: PipelineId;
  nome: string;
  etapas: Etapa[];
  etapasTerminais: string[];
};

export type Lead = {
  id: string;
  contatoId: string;
  conversaId: string | null;
  pipeline: PipelineId;
  etapaId: string;
  imovelId: string | null;
  valor: number;
  responsavelId: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type EventoAtribuicao = {
  id: string;
  conversaId: string;
  atendenteId: string;
  motivo: MotivoAtribuicao;
  em: string;
};

export const DEPARTAMENTOS: Record<Departamento, string> = {
  comercial: "Comercial",
  administrativo: "Administrativo",
  recepcao: "Recepção e Assuntos Gerais",
};

export const CANAIS: Record<Canal, string> = {
  whatsapp: "WhatsApp",
  site: "Site",
  portal: "Portal",
};

export const TETO_ATENDIMENTOS = 5;
export const SLA_PRIMEIRA_RESPOSTA_MIN = 15;
