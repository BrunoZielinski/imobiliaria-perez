import { IMOVEIS_PEREZ } from "./dados";

export type CanalMarketing = "instagram" | "facebook" | "google" | "tiktok" | "youtube";
export type StatusConteudo = "rascunho" | "revisao" | "aprovado" | "agendado" | "publicado";
export type StatusCampanha = "rascunho" | "ativa" | "pausada" | "concluida";
export type ObjetivoMarketing = "vender" | "alugar" | "captar" | "marca" | "visitas";
export type FormatoMarketing = "post" | "carrossel" | "stories" | "video_curto" | "busca" | "video";
export type TomMarketing = "sofisticado" | "proximo" | "direto" | "institucional";
export type AbaMarketing = "resumo" | "estudio" | "calendario" | "trafego" | "conteudos" | "aprovacoes";

export const ABAS_MARKETING: { id: AbaMarketing; rotulo: string }[] = [
  { id: "resumo", rotulo: "Visão geral" },
  { id: "estudio", rotulo: "Estúdio IA" },
  { id: "calendario", rotulo: "Calendário" },
  { id: "trafego", rotulo: "Tráfego pago" },
  { id: "conteudos", rotulo: "Conteúdos" },
  { id: "aprovacoes", rotulo: "Aprovações" },
];

export type CampanhaMarketing = {
  id: string;
  nome: string;
  canal: CanalMarketing;
  objetivo: string;
  imovelId?: string;
  periodo: string;
  publico: string;
  orcamento: number;
  investimento: number;
  alcance: number;
  impressoes: number;
  cliques: number;
  leads: number;
  conversoes: number;
  status: StatusCampanha;
};

export type ConteudoMarketing = {
  id: string;
  titulo: string;
  descricao: string;
  canais: CanalMarketing[];
  formato: FormatoMarketing;
  status: StatusConteudo;
  responsavel: string;
  data: string;
  imovelId?: string;
  observacao?: string;
};

export type EventoMarketing = {
  id: string;
  dia: number;
  horario: string;
  titulo: string;
  canal: CanalMarketing;
  tipo: "organico" | "pago";
  status: StatusConteudo;
  responsavel: string;
  imovelId?: string;
};

export type ConfiguracaoGeracao = {
  imovelId: string;
  objetivo: ObjetivoMarketing;
  publico: string;
  canais: CanalMarketing[];
  formato: FormatoMarketing;
  tom: TomMarketing;
  cta: string;
};

export type KitConteudoIA = {
  codigoImovel: string;
  imovelId: string;
  tituloImovel: string;
  bairro: string;
  conceito: string;
  legenda: string;
  carrossel: string[];
  roteiroVideo: string[];
  titulosGoogle: string[];
  descricaoGoogle: string;
  textoTikTok: string;
  textoYoutube: string;
  hashtags: string[];
  cta: string;
  aderenciaMarca: number;
  imagens: string[];
  canais: CanalMarketing[];
  formato: FormatoMarketing;
};

export type FiltrosConteudoMarketing = {
  canal?: CanalMarketing | "todos";
  status?: StatusConteudo | "todos";
  formato?: FormatoMarketing | "todos";
  imovelId?: string | "todos";
};

export const CANAIS_MARKETING: Record<CanalMarketing, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  google: "Google Ads",
  tiktok: "TikTok",
  youtube: "YouTube",
};

export const STATUS_CONTEUDO: Record<StatusConteudo, string> = {
  rascunho: "Rascunho",
  revisao: "Em revisão",
  aprovado: "Aprovado",
  agendado: "Agendado",
  publicado: "Publicado",
};

export const FORMATOS_MARKETING: Record<FormatoMarketing, string> = {
  post: "Post",
  carrossel: "Carrossel",
  stories: "Stories",
  video_curto: "Vídeo curto",
  busca: "Anúncio de busca",
  video: "Vídeo",
};

export const CAMPANHAS_MARKETING: CampanhaMarketing[] = [
  {
    id: "campanha-01",
    nome: "Maison Heritage · Alto padrão",
    canal: "instagram",
    objetivo: "Agendamentos de visita",
    imovelId: "imovel-01",
    periodo: "01 a 18 de agosto",
    publico: "Famílias de alta renda em Londrina e região",
    orcamento: 7_500,
    investimento: 5_200,
    alcance: 92_400,
    impressoes: 168_300,
    cliques: 3_112,
    leads: 54,
    conversoes: 11,
    status: "ativa",
  },
  {
    id: "campanha-02",
    nome: "Casa Terra Bonita · Pesquisa",
    canal: "google",
    objetivo: "Leads qualificados de compra",
    imovelId: "imovel-03",
    periodo: "28 de julho a 20 de agosto",
    publico: "Busca ativa por casas em condomínios",
    orcamento: 6_000,
    investimento: 4_800,
    alcance: 38_900,
    impressoes: 74_600,
    cliques: 2_430,
    leads: 63,
    conversoes: 14,
    status: "ativa",
  },
  {
    id: "campanha-03",
    nome: "Seu imóvel com a Perez",
    canal: "facebook",
    objetivo: "Captação de proprietários",
    periodo: "05 a 31 de agosto",
    publico: "Proprietários de imóveis em Londrina",
    orcamento: 4_200,
    investimento: 2_600,
    alcance: 51_700,
    impressoes: 83_100,
    cliques: 1_488,
    leads: 31,
    conversoes: 8,
    status: "ativa",
  },
  {
    id: "campanha-04",
    nome: "Lançamento Aurora em 15 segundos",
    canal: "tiktok",
    objetivo: "Descoberta do lançamento",
    imovelId: "imovel-12",
    periodo: "01 a 12 de agosto",
    publico: "Jovens casais e investidores",
    orcamento: 3_000,
    investimento: 1_800,
    alcance: 124_500,
    impressoes: 181_900,
    cliques: 2_182,
    leads: 22,
    conversoes: 4,
    status: "pausada",
  },
  {
    id: "campanha-05",
    nome: "35 anos conectando Londrina",
    canal: "youtube",
    objetivo: "Reconhecimento de marca",
    periodo: "15 de julho a 15 de agosto",
    publico: "Moradores de Londrina com interesse em imóveis",
    orcamento: 3_500,
    investimento: 2_450,
    alcance: 77_200,
    impressoes: 119_400,
    cliques: 892,
    leads: 18,
    conversoes: 3,
    status: "concluida",
  },
  {
    id: "campanha-06",
    nome: "Aluguel no Higienópolis",
    canal: "facebook",
    objetivo: "Solicitações de visita",
    imovelId: "imovel-06",
    periodo: "08 a 25 de agosto",
    publico: "Profissionais buscando locação central",
    orcamento: 3_200,
    investimento: 1_900,
    alcance: 34_800,
    impressoes: 58_300,
    cliques: 1_106,
    leads: 25,
    conversoes: 7,
    status: "rascunho",
  },
];

export const CONTEUDOS_MARKETING: ConteudoMarketing[] = [
  {
    id: "conteudo-01",
    titulo: "Tour pelo Maison Heritage",
    descricao: "Carrossel com ambientes, diferenciais e chamada para visita.",
    canais: ["instagram", "facebook"],
    formato: "carrossel",
    status: "agendado",
    responsavel: "Marina Costa",
    data: "2026-08-06T18:30:00-03:00",
    imovelId: "imovel-01",
  },
  {
    id: "conteudo-02",
    titulo: "Por que anunciar com a Perez?",
    descricao: "Vídeo institucional para captação de proprietários.",
    canais: ["instagram", "youtube"],
    formato: "video_curto",
    status: "revisao",
    responsavel: "Marina Costa",
    data: "2026-08-08T11:00:00-03:00",
    observacao: "Ajustar o encerramento para destacar os 35 anos de história.",
  },
  {
    id: "conteudo-03",
    titulo: "Casa no Terra Bonita",
    descricao: "Criativo direto para famílias que buscam condomínio.",
    canais: ["facebook", "google"],
    formato: "post",
    status: "aprovado",
    responsavel: "Lucas Martins",
    data: "2026-08-09T09:00:00-03:00",
    imovelId: "imovel-03",
  },
  {
    id: "conteudo-04",
    titulo: "Lançamento Aurora em 15 segundos",
    descricao: "Roteiro vertical com cortes rápidos e foco em localização.",
    canais: ["tiktok", "instagram"],
    formato: "video_curto",
    status: "publicado",
    responsavel: "Bianca Souza",
    data: "2026-08-03T19:00:00-03:00",
    imovelId: "imovel-12",
  },
  {
    id: "conteudo-05",
    titulo: "Guia de bairros: Gleba Palhano",
    descricao: "Conteúdo de autoridade sobre qualidade de vida e valorização.",
    canais: ["instagram", "youtube"],
    formato: "video",
    status: "rascunho",
    responsavel: "Marina Costa",
    data: "2026-08-14T18:00:00-03:00",
  },
  {
    id: "conteudo-06",
    titulo: "Apartamento para alugar no Higienópolis",
    descricao: "Stories com preço, localização e botão de contato.",
    canais: ["instagram", "facebook"],
    formato: "stories",
    status: "revisao",
    responsavel: "Bianca Souza",
    data: "2026-08-10T12:30:00-03:00",
    imovelId: "imovel-06",
    observacao: "Confirmar a ordem das fotos e reforçar proximidade do centro.",
  },
  {
    id: "conteudo-07",
    titulo: "Imóveis comerciais no Centro",
    descricao: "Anúncio de busca para empresas em expansão.",
    canais: ["google"],
    formato: "busca",
    status: "agendado",
    responsavel: "Lucas Martins",
    data: "2026-08-11T08:00:00-03:00",
    imovelId: "imovel-04",
  },
  {
    id: "conteudo-08",
    titulo: "Bastidores da equipe Perez",
    descricao: "Conteúdo humano para relacionamento e marca empregadora.",
    canais: ["instagram", "tiktok", "youtube"],
    formato: "video_curto",
    status: "aprovado",
    responsavel: "Marina Costa",
    data: "2026-08-15T17:30:00-03:00",
  },
];

export const EVENTOS_MARKETING: EventoMarketing[] = [
  { id: "evento-01", dia: 3, horario: "19:00", titulo: "Lançamento Aurora", canal: "tiktok", tipo: "pago", status: "publicado", responsavel: "Bianca Souza", imovelId: "imovel-12" },
  { id: "evento-02", dia: 6, horario: "18:30", titulo: "Tour Maison Heritage", canal: "instagram", tipo: "organico", status: "agendado", responsavel: "Marina Costa", imovelId: "imovel-01" },
  { id: "evento-03", dia: 8, horario: "11:00", titulo: "Anuncie com a Perez", canal: "youtube", tipo: "organico", status: "revisao", responsavel: "Marina Costa" },
  { id: "evento-04", dia: 9, horario: "09:00", titulo: "Casa Terra Bonita", canal: "facebook", tipo: "pago", status: "aprovado", responsavel: "Lucas Martins", imovelId: "imovel-03" },
  { id: "evento-05", dia: 10, horario: "12:30", titulo: "Locação Higienópolis", canal: "instagram", tipo: "organico", status: "revisao", responsavel: "Bianca Souza", imovelId: "imovel-06" },
  { id: "evento-06", dia: 11, horario: "08:00", titulo: "Comercial no Centro", canal: "google", tipo: "pago", status: "agendado", responsavel: "Lucas Martins", imovelId: "imovel-04" },
  { id: "evento-07", dia: 14, horario: "18:00", titulo: "Guia Gleba Palhano", canal: "youtube", tipo: "organico", status: "rascunho", responsavel: "Marina Costa" },
  { id: "evento-08", dia: 15, horario: "17:30", titulo: "Bastidores Perez", canal: "tiktok", tipo: "organico", status: "aprovado", responsavel: "Marina Costa" },
  { id: "evento-09", dia: 18, horario: "10:00", titulo: "35 anos Perez", canal: "facebook", tipo: "pago", status: "agendado", responsavel: "Bianca Souza" },
  { id: "evento-10", dia: 22, horario: "09:30", titulo: "Investir em Londrina", canal: "google", tipo: "pago", status: "rascunho", responsavel: "Lucas Martins" },
];

const dividir = (numerador: number, denominador: number) => denominador > 0 ? numerador / denominador : 0;

export const calcularMetricasCampanha = (campanha: CampanhaMarketing) => ({
  ctr: dividir(campanha.cliques, campanha.impressoes),
  cpc: dividir(campanha.investimento, campanha.cliques),
  cpl: dividir(campanha.investimento, campanha.leads),
  progressoOrcamento: dividir(campanha.investimento, campanha.orcamento),
});

export const calcularResumoMarketing = (
  campanhas: CampanhaMarketing[],
  conteudos: ConteudoMarketing[],
) => {
  const investimento = campanhas.reduce((soma, item) => soma + item.investimento, 0);
  const leads = campanhas.reduce((soma, item) => soma + item.leads, 0);

  return {
    investimento,
    leads,
    cpl: dividir(investimento, leads),
    campanhasAtivas: campanhas.filter((item) => item.status === "ativa").length,
    aguardandoAprovacao: conteudos.filter((item) => item.status === "revisao").length,
    planejados: conteudos.length,
  };
};

export const filtrarConteudos = (
  conteudos: ConteudoMarketing[],
  filtros: FiltrosConteudoMarketing,
) => conteudos.filter((item) => (
  (!filtros.canal || filtros.canal === "todos" || item.canais.includes(filtros.canal))
  && (!filtros.status || filtros.status === "todos" || item.status === filtros.status)
  && (!filtros.formato || filtros.formato === "todos" || item.formato === filtros.formato)
  && (!filtros.imovelId || filtros.imovelId === "todos" || item.imovelId === filtros.imovelId)
));

const SEQUENCIA_STATUS: StatusConteudo[] = ["rascunho", "revisao", "aprovado", "agendado", "publicado"];

export const proximoStatusConteudo = (status: StatusConteudo): StatusConteudo => {
  const indice = SEQUENCIA_STATUS.indexOf(status);
  return SEQUENCIA_STATUS[Math.min(indice + 1, SEQUENCIA_STATUS.length - 1)];
};

export const agruparConteudosPorStatus = (conteudos: ConteudoMarketing[]) => ({
  rascunho: conteudos.filter((item) => item.status === "rascunho"),
  revisao: conteudos.filter((item) => item.status === "revisao"),
  aprovado: conteudos.filter((item) => item.status === "aprovado"),
  agendado: conteudos.filter((item) => item.status === "agendado"),
  publicado: conteudos.filter((item) => item.status === "publicado"),
});

export const formatarPercentual = (valor: number) => new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}).format(valor);

const OBJETIVOS: Record<ObjetivoMarketing, string> = {
  vender: "transformar interesse em visitas qualificadas",
  alugar: "encontrar o próximo morador com agilidade",
  captar: "mostrar ao proprietário o valor de uma gestão profissional",
  marca: "fortalecer confiança e presença em Londrina",
  visitas: "gerar novos agendamentos para o imóvel",
};

export const gerarKitConteudo = (configuracao: ConfiguracaoGeracao): KitConteudoIA => {
  const imovel = IMOVEIS_PEREZ.find((item) => item.id === configuracao.imovelId);
  if (!imovel) throw new Error("Imóvel não encontrado");

  const preco = imovel.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const proposta = OBJETIVOS[configuracao.objetivo];
  const primeiraComodidade = imovel.comodidades[0] ?? "localização estratégica";

  return {
    codigoImovel: imovel.codigo,
    imovelId: imovel.id,
    tituloImovel: imovel.titulo,
    bairro: imovel.bairro,
    conceito: `Seu próximo capítulo começa em ${imovel.bairro}`,
    legenda: `${imovel.codigo} · ${imovel.titulo}. ${imovel.area}m², ${imovel.quartos} dormitórios e ${primeiraComodidade.toLowerCase()} para viver Londrina de um jeito especial. ${preco}. ${configuracao.cta}.`,
    carrossel: [
      `Capa · ${imovel.titulo}`,
      `${imovel.area}m² pensados para o seu momento`,
      `${imovel.quartos} dormitórios · ${imovel.suites} suítes`,
      `${primeiraComodidade} em destaque`,
      `${configuracao.cta} · ${imovel.codigo}`,
    ],
    roteiroVideo: [
      `Abertura: vista e fachada em ${imovel.bairro}`,
      `Cena 2: ambientes do ${imovel.titulo}`,
      `Cena 3: destaque para ${primeiraComodidade.toLowerCase()}`,
      `Cena 4: contexto de localização em Londrina`,
      `Encerramento: ${configuracao.cta} · ${imovel.codigo}`,
    ],
    titulosGoogle: [
      `${imovel.tipo} em ${imovel.bairro}`,
      `${imovel.codigo} | Imobiliária Perez`,
      `${configuracao.cta} em Londrina`,
    ],
    descricaoGoogle: `${imovel.titulo} com ${imovel.area}m² e atendimento Perez. Consulte detalhes e ${proposta}.`,
    textoTikTok: `POV: você encontrou ${imovel.area}m² em ${imovel.bairro}. Salve para visitar depois. #Perez #Londrina`,
    textoYoutube: `Conheça ${imovel.titulo}, código ${imovel.codigo}. Um tour completo pelos ambientes e diferenciais, apresentado pela Imobiliária Perez.`,
    hashtags: ["#ImobiliariaPerez", "#Londrina", `#${imovel.bairro.replaceAll(" ", "")}`, "#Imoveis", "#SeuProximoCapitulo"],
    cta: configuracao.cta,
    aderenciaMarca: 96,
    imagens: imovel.imagens,
    canais: configuracao.canais,
    formato: configuracao.formato,
  };
};

export const criarConteudoDoKit = (kit: KitConteudoIA, id: string): ConteudoMarketing => ({
  id,
  titulo: `Campanha IA · ${kit.codigoImovel}`,
  descricao: kit.conceito,
  canais: kit.canais,
  formato: kit.formato,
  status: "revisao",
  responsavel: "Marina Costa",
  data: "2026-08-12T10:00:00-03:00",
  imovelId: kit.imovelId,
  observacao: "Conteúdo criado no Estúdio IA e enviado para revisão interna.",
});
