import type { Pipeline, PipelineId } from "@/lib/tipos";

export const PIPELINES: Pipeline[] = [
  {
    id: "venda",
    nome: "Venda",
    etapas: [
      { id: "venda-novo", nome: "Novo" },
      { id: "venda-contato", nome: "Contato feito" },
      { id: "venda-visita-agendada", nome: "Visita agendada" },
      { id: "venda-visita-realizada", nome: "Visita realizada" },
      { id: "venda-proposta", nome: "Proposta" },
      { id: "venda-fechado", nome: "Fechado" },
      { id: "venda-perdido", nome: "Perdido" },
    ],
    etapasTerminais: ["venda-fechado", "venda-perdido"],
  },
  {
    id: "locacao",
    nome: "Locação",
    etapas: [
      { id: "loc-novo", nome: "Novo" },
      { id: "loc-contato", nome: "Contato feito" },
      { id: "loc-visita", nome: "Visita" },
      { id: "loc-documentacao", nome: "Documentação" },
      { id: "loc-analise", nome: "Análise cadastral" },
      { id: "loc-assinado", nome: "Contrato assinado" },
      { id: "loc-perdido", nome: "Perdido" },
    ],
    etapasTerminais: ["loc-assinado", "loc-perdido"],
  },
  {
    id: "lancamentos",
    nome: "Lançamentos",
    etapas: [
      { id: "lanc-novo", nome: "Novo" },
      { id: "lanc-interesse", nome: "Interesse" },
      { id: "lanc-apresentacao", nome: "Apresentação" },
      { id: "lanc-reserva", nome: "Reserva" },
      { id: "lanc-contrato", nome: "Contrato" },
      { id: "lanc-perdido", nome: "Perdido" },
    ],
    etapasTerminais: ["lanc-contrato", "lanc-perdido"],
  },
  {
    id: "captacao",
    nome: "Captação",
    etapas: [
      { id: "cap-contatado", nome: "Proprietário contatado" },
      { id: "cap-avaliacao", nome: "Avaliação" },
      { id: "cap-exclusividade", nome: "Proposta de exclusividade" },
      { id: "cap-carteira", nome: "Imóvel na carteira" },
      { id: "cap-perdido", nome: "Não captado" },
    ],
    etapasTerminais: ["cap-carteira", "cap-perdido"],
  },
];

export const buscarPipeline = (id: PipelineId) => PIPELINES.find((p) => p.id === id)!;

export const ETAPAS_TERMINAIS = new Set(PIPELINES.flatMap((p) => p.etapasTerminais));
