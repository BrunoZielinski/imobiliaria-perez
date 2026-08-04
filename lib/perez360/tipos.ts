export type FinalidadeImovel = "venda" | "locacao" | "lancamento";
export type StatusPublicacao = "publicado" | "rascunho" | "em_preparacao";

export type ImovelPerez = {
  id: string;
  codigo: string;
  titulo: string;
  finalidade: FinalidadeImovel;
  tipo: "apartamento" | "casa" | "terreno" | "comercial";
  bairro: string;
  cidade: "Londrina";
  enderecoAproximado: string;
  preco: number;
  condominio: number | null;
  area: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  descricao: string;
  comodidades: string[];
  imagens: string[];
  destaque: boolean;
  statusPublicacao: StatusPublicacao;
  proprietarioId: string;
  corretor: string;
};

export type FiltrosImoveis = {
  finalidade?: FinalidadeImovel | "todos";
  busca?: string;
  tipo?: ImovelPerez["tipo"] | "todos";
  bairro?: string | "todos";
  precoMinimo?: number;
  precoMaximo?: number;
  quartos?: number;
  vagas?: number;
};

export type PapelPessoa = "lead" | "cliente" | "proprietario" | "locatario";

export type PessoaPerez = {
  id: string;
  nome: string;
  papeis: PapelPessoa[];
  telefone: string;
  email: string;
  imoveisIds: string[];
};

export type ContratoPerez = {
  id: string;
  imovelId: string;
  proprietarioId: string;
  locatarioId: string;
  inicio: string;
  fim: string;
  proximoReajuste: string;
  valor: number;
  status: "ativo" | "atencao" | "encerrado";
};

export type ManutencaoPerez = {
  id: string;
  imovelId: string;
  solicitanteId: string;
  titulo: string;
  descricao: string;
  prioridade: "urgente" | "alta" | "normal";
  status: "aberta" | "em_andamento" | "concluida";
  prestador: string | null;
  prazo: string;
};

export type LancamentoPerez = {
  id: string;
  contratoId: string;
  tipo: "recebimento" | "repasse";
  descricao: string;
  valor: number;
  vencimento: string;
  status: "previsto" | "realizado" | "pendente";
};

export type CaptacaoPerez = {
  id: string;
  imovelId: string;
  proprietarioId: string;
  responsavel: string;
  etapa: "avaliacao" | "documentacao" | "fotografia" | "publicacao";
  proximaAcao: string;
};
