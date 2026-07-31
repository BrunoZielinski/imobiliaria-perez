import type {
  Atendente,
  Contato,
  Conversa,
  Departamento,
  EventoAtribuicao,
  Imovel,
  Lead,
  Mensagem,
} from "@/lib/tipos";
import { SAUDACAO_ANA, mensagemEncaminhando } from "@/lib/ana/script";

export type EstadoCrm = {
  contatos: Contato[];
  conversas: Conversa[];
  mensagens: Mensagem[];
  atendentes: Atendente[];
  imoveis: Imovel[];
  leads: Lead[];
  eventos: EventoAtribuicao[];
  ponteiro: Record<Departamento, number>;
};

const ATENDENTES: Atendente[] = [
  { id: "at-1", nome: "Carlos Ferreira", departamentos: ["comercial"], papel: "atendente", disponivel: true, ordem: 0 },
  { id: "at-2", nome: "Juliana Moraes", departamentos: ["comercial"], papel: "atendente", disponivel: true, ordem: 1 },
  { id: "at-3", nome: "Rafael Tanaka", departamentos: ["comercial"], papel: "atendente", disponivel: false, ordem: 2 },
  { id: "at-4", nome: "Patrícia Lopes", departamentos: ["comercial"], papel: "supervisor", disponivel: true, ordem: 3 },
  { id: "at-5", nome: "Zilda Camilotti", departamentos: ["administrativo"], papel: "atendente", disponivel: true, ordem: 0 },
  { id: "at-6", nome: "Simone Prado", departamentos: ["administrativo"], papel: "supervisor", disponivel: true, ordem: 1 },
  { id: "at-7", nome: "Bianca Lima", departamentos: ["recepcao"], papel: "atendente", disponivel: true, ordem: 0 },
  { id: "at-8", nome: "Marcos Perez", departamentos: ["comercial", "administrativo", "recepcao"], papel: "administrador", disponivel: false, ordem: 4 },
];

const IMOVEIS: Imovel[] = [
  { id: "im-1", codigo: "PZ-1042", tipo: "apartamento", bairro: "Gleba Palhano", valor: 780000, finalidade: "venda" },
  { id: "im-2", codigo: "PZ-2210", tipo: "apartamento", bairro: "Centro", valor: 2400, finalidade: "locacao" },
  { id: "im-3", codigo: "PZ-3388", tipo: "casa", bairro: "Jardim Higienópolis", valor: 1250000, finalidade: "venda" },
  { id: "im-4", codigo: "PZ-4501", tipo: "casa", bairro: "Vila Nova", valor: 3800, finalidade: "locacao" },
  { id: "im-5", codigo: "PZ-5127", tipo: "apartamento", bairro: "Gleba Palhano", valor: 610000, finalidade: "venda" },
];

const CONTATOS = [
  { nome: "João Silva", telefone: "43 99812-4477", email: "joao.silva@email.com" },
  { nome: "Maria Antunes", telefone: "43 99733-1290", email: null },
  { nome: "Pedro Nakamura", telefone: "43 99604-8815", email: "pnakamura@email.com" },
  { nome: "Marcos Oliveira", telefone: "43 99187-3320", email: "marcos.oliveira@email.com" },
  { nome: "Ricardo Molina", telefone: "43 99450-7761", email: "rmolina@email.com" },
  { nome: "Fernanda Duarte", telefone: "43 99920-5504", email: null },
  { nome: "Sérgio Batista", telefone: "43 99311-6672", email: "sergio.b@email.com" },
  { nome: "Luciana Prado", telefone: "43 99845-2213", email: null },
  { nome: "Cliente da apresentação", telefone: "43 99999-0000", email: null },
  { nome: "Renata Almeida", telefone: "43 99241-9088", email: "renata.almeida@email.com" },
];

const minutosAtras = (base: Date, minutos: number) =>
  new Date(base.getTime() - minutos * 60000).toISOString();

export const criarSeed = (base: Date): EstadoCrm => {
  const contatos: Contato[] = CONTATOS.map((contato, indice) => ({
    id: `ct-${indice + 1}`,
    nome: contato.nome,
    telefone: contato.telefone,
    email: contato.email,
    criadoEm: minutosAtras(base, 600 - indice * 40),
  }));

  const conversas: Conversa[] = [
    { id: "cv-1", contatoId: "ct-1", canal: "whatsapp", modoTriagem: "ana", departamento: "comercial", status: "atendimento", atendenteId: "at-1", criadaEm: minutosAtras(base, 95), entrouNaFilaEm: minutosAtras(base, 93), primeiraRespostaEm: minutosAtras(base, 88), contextoAna: "quero comprar um apartamento na Gleba Palhano", naoLidas: 2 },
    { id: "cv-2", contatoId: "ct-2", canal: "whatsapp", modoTriagem: "ana", departamento: "comercial", status: "fila", atendenteId: null, criadaEm: minutosAtras(base, 22), entrouNaFilaEm: minutosAtras(base, 20), primeiraRespostaEm: null, contextoAna: "tem casa pra alugar no centro?", naoLidas: 1 },
    { id: "cv-3", contatoId: "ct-3", canal: "site", modoTriagem: "direto", departamento: "comercial", status: "atendimento", atendenteId: "at-2", criadaEm: minutosAtras(base, 240), entrouNaFilaEm: minutosAtras(base, 240), primeiraRespostaEm: minutosAtras(base, 231), contextoAna: null, naoLidas: 0 },
    { id: "cv-4", contatoId: "ct-4", canal: "whatsapp", modoTriagem: "ana", departamento: "administrativo", status: "atendimento", atendenteId: "at-5", criadaEm: minutosAtras(base, 180), entrouNaFilaEm: minutosAtras(base, 178), primeiraRespostaEm: minutosAtras(base, 170), contextoAna: "Tivemos um imprevisto de saúde na família e não conseguimos pagar o aluguel no vencimento. Gostaria de solicitar a revisão da multa, se possível.", naoLidas: 1 },
    { id: "cv-5", contatoId: "ct-5", canal: "portal", modoTriagem: "direto", departamento: "comercial", status: "fila", atendenteId: null, criadaEm: minutosAtras(base, 8), entrouNaFilaEm: minutosAtras(base, 8), primeiraRespostaEm: null, contextoAna: null, naoLidas: 1 },
    { id: "cv-6", contatoId: "ct-6", canal: "whatsapp", modoTriagem: "ana", departamento: null, status: "ana", atendenteId: null, criadaEm: minutosAtras(base, 3), entrouNaFilaEm: null, primeiraRespostaEm: null, contextoAna: null, naoLidas: 1 },
    { id: "cv-7", contatoId: "ct-7", canal: "whatsapp", modoTriagem: "direto", departamento: "recepcao", status: "encerrada", atendenteId: "at-7", criadaEm: minutosAtras(base, 1400), entrouNaFilaEm: minutosAtras(base, 1398), primeiraRespostaEm: minutosAtras(base, 1392), contextoAna: null, naoLidas: 0 },
    { id: "cv-8", contatoId: "ct-8", canal: "site", modoTriagem: "direto", departamento: "comercial", status: "atendimento", atendenteId: "at-1", criadaEm: minutosAtras(base, 320), entrouNaFilaEm: minutosAtras(base, 320), primeiraRespostaEm: minutosAtras(base, 300), contextoAna: null, naoLidas: 0 },
    { id: "cv-9", contatoId: "ct-10", canal: "whatsapp", modoTriagem: "manual", departamento: "administrativo", status: "atendimento", atendenteId: "at-5", criadaEm: minutosAtras(base, 70), entrouNaFilaEm: minutosAtras(base, 66), primeiraRespostaEm: minutosAtras(base, 59), contextoAna: "Financeiro e boletos: quero confirmar o vencimento deste mês.", naoLidas: 0 },
  ];

  const mensagens: Mensagem[] = [
    { id: "ms-1", conversaId: "cv-1", autor: "contato", texto: "Boa tarde", em: minutosAtras(base, 95) },
    { id: "ms-2", conversaId: "cv-1", autor: "ana", texto: SAUDACAO_ANA, em: minutosAtras(base, 95) },
    { id: "ms-3", conversaId: "cv-1", autor: "contato", texto: "quero comprar um apartamento na Gleba Palhano", em: minutosAtras(base, 94) },
    { id: "ms-4", conversaId: "cv-1", autor: "ana", texto: mensagemEncaminhando("comercial"), em: minutosAtras(base, 93) },
    { id: "ms-5", conversaId: "cv-1", autor: "atendente", texto: "Olá, João! Aqui é o Carlos, da Perez. Temos ótimas opções na Gleba Palhano. Você procura de quantos dormitórios?", em: minutosAtras(base, 88) },
    { id: "ms-6", conversaId: "cv-1", autor: "contato", texto: "3 dormitórios, com suíte se possível", em: minutosAtras(base, 84) },
    { id: "ms-7", conversaId: "cv-1", autor: "atendente", texto: "Perfeito. Tenho o PZ-1042, 3 dormitórios com suíte, 96m², por R$ 780.000. Posso te enviar as fotos?", em: minutosAtras(base, 80) },
    { id: "ms-8", conversaId: "cv-1", autor: "contato", texto: "Pode sim! Consigo visitar essa semana?", em: minutosAtras(base, 12) },
    { id: "ms-9", conversaId: "cv-1", autor: "contato", texto: "Prefiro quinta à tarde", em: minutosAtras(base, 11) },

    { id: "ms-10", conversaId: "cv-2", autor: "contato", texto: "Oi", em: minutosAtras(base, 22) },
    { id: "ms-11", conversaId: "cv-2", autor: "ana", texto: SAUDACAO_ANA, em: minutosAtras(base, 22) },
    { id: "ms-12", conversaId: "cv-2", autor: "contato", texto: "tem casa pra alugar no centro?", em: minutosAtras(base, 21) },
    { id: "ms-13", conversaId: "cv-2", autor: "ana", texto: mensagemEncaminhando("comercial"), em: minutosAtras(base, 20) },

    { id: "ms-14", conversaId: "cv-3", autor: "contato", texto: "Tenho interesse no imóvel PZ-3388 anunciado no site.", em: minutosAtras(base, 240) },
    { id: "ms-15", conversaId: "cv-3", autor: "atendente", texto: "Olá, Pedro! Sou a Juliana. A casa do Jardim Higienópolis está disponível, sim. Quer agendar uma visita?", em: minutosAtras(base, 231) },

    { id: "ms-16", conversaId: "cv-4", autor: "contato", texto: "Boa tarde", em: minutosAtras(base, 180) },
    { id: "ms-17", conversaId: "cv-4", autor: "ana", texto: SAUDACAO_ANA, em: minutosAtras(base, 180) },
    { id: "ms-18", conversaId: "cv-4", autor: "contato", texto: "Tivemos um imprevisto de saúde na família e não conseguimos pagar o aluguel no vencimento. Gostaria de solicitar a revisão da multa, se possível.", em: minutosAtras(base, 179) },
    { id: "ms-19", conversaId: "cv-4", autor: "ana", texto: mensagemEncaminhando("administrativo"), em: minutosAtras(base, 178) },
    { id: "ms-20", conversaId: "cv-4", autor: "atendente", texto: "Boa tarde, Marcos. Aqui é a Zilda, do financeiro da Perez. Recebi o contexto completo e vou verificar a situação da multa para você.", em: minutosAtras(base, 170) },

    { id: "ms-21", conversaId: "cv-5", autor: "contato", texto: "Vim pelo ZAP Imóveis, quero informações do apartamento PZ-5127.", em: minutosAtras(base, 8) },

    { id: "ms-22", conversaId: "cv-6", autor: "contato", texto: "oi, boa tarde", em: minutosAtras(base, 3) },
    { id: "ms-23", conversaId: "cv-6", autor: "ana", texto: SAUDACAO_ANA, em: minutosAtras(base, 3) },

    { id: "ms-24", conversaId: "cv-7", autor: "contato", texto: "qual o horário de vocês no sábado?", em: minutosAtras(base, 1400) },
    { id: "ms-25", conversaId: "cv-7", autor: "atendente", texto: "Sábado atendemos das 8h às 12h. Até logo!", em: minutosAtras(base, 1392) },

    { id: "ms-26", conversaId: "cv-8", autor: "contato", texto: "Quero colocar meu apartamento para alugar com vocês.", em: minutosAtras(base, 320) },
    { id: "ms-27", conversaId: "cv-8", autor: "atendente", texto: "Que ótimo, Luciana! Podemos agendar uma avaliação do imóvel?", em: minutosAtras(base, 300) },

    { id: "ms-28", conversaId: "cv-9", autor: "contato", texto: "Olá", em: minutosAtras(base, 70) },
    { id: "ms-29", conversaId: "cv-9", autor: "sistema", texto: "Olá! Como podemos ajudar hoje?", em: minutosAtras(base, 69), apresentacao: { tipo: "botoes", opcoes: ["Comprar ou alugar", "Já sou cliente", "Outros assuntos"] } },
    { id: "ms-30", conversaId: "cv-9", autor: "contato", texto: "Já sou cliente", em: minutosAtras(base, 68), apresentacao: { tipo: "button_reply" } },
    { id: "ms-31", conversaId: "cv-9", autor: "sistema", texto: "Escolha o assunto do seu atendimento.", em: minutosAtras(base, 67), apresentacao: { tipo: "lista", rotulo: "Ver assuntos", opcoes: ["Manutenção", "Vistoria e desocupação", "Financeiro e boletos", "Aluguel em atraso", "Repasse ao proprietário"] } },
    { id: "ms-32", conversaId: "cv-9", autor: "contato", texto: "Financeiro e boletos", em: minutosAtras(base, 66), apresentacao: { tipo: "list_reply" } },
    { id: "ms-33", conversaId: "cv-9", autor: "sistema", texto: "Conte brevemente o que aconteceu para a equipe receber o contexto.", em: minutosAtras(base, 65) },
    { id: "ms-34", conversaId: "cv-9", autor: "contato", texto: "Quero confirmar o vencimento do aluguel deste mês.", em: minutosAtras(base, 64) },
    { id: "ms-35", conversaId: "cv-9", autor: "sistema", texto: "Recebemos sua solicitação e encaminhamos para o setor Administrativo.", em: minutosAtras(base, 63) },
    { id: "ms-36", conversaId: "cv-9", autor: "atendente", texto: "Olá, Renata! Aqui é a Zilda, do Financeiro da Perez. O vencimento deste mês está previsto para o dia 10. Posso ajudar com mais alguma informação?", em: minutosAtras(base, 59) },
  ];

  const leads: Lead[] = [
    { id: "ld-1", contatoId: "ct-1", conversaId: "cv-1", pipeline: "venda", etapaId: "venda-visita-agendada", imovelId: "im-1", valor: 780000, responsavelId: "at-1", criadoEm: minutosAtras(base, 95), atualizadoEm: minutosAtras(base, 80) },
    { id: "ld-2", contatoId: "ct-2", conversaId: "cv-2", pipeline: "locacao", etapaId: "loc-novo", imovelId: "im-2", valor: 2400, responsavelId: null, criadoEm: minutosAtras(base, 22), atualizadoEm: minutosAtras(base, 22) },
    { id: "ld-3", contatoId: "ct-3", conversaId: "cv-3", pipeline: "venda", etapaId: "venda-contato", imovelId: "im-3", valor: 1250000, responsavelId: "at-2", criadoEm: minutosAtras(base, 240), atualizadoEm: minutosAtras(base, 231) },
    { id: "ld-4", contatoId: "ct-5", conversaId: "cv-5", pipeline: "venda", etapaId: "venda-novo", imovelId: "im-5", valor: 610000, responsavelId: null, criadoEm: minutosAtras(base, 8), atualizadoEm: minutosAtras(base, 8) },
    { id: "ld-5", contatoId: "ct-8", conversaId: "cv-8", pipeline: "captacao", etapaId: "cap-avaliacao", imovelId: null, valor: 0, responsavelId: "at-1", criadoEm: minutosAtras(base, 320), atualizadoEm: minutosAtras(base, 300) },
    { id: "ld-6", contatoId: "ct-6", conversaId: null, pipeline: "lancamentos", etapaId: "lanc-interesse", imovelId: null, valor: 450000, responsavelId: "at-2", criadoEm: minutosAtras(base, 2880), atualizadoEm: minutosAtras(base, 1440) },
    { id: "ld-7", contatoId: "ct-7", conversaId: null, pipeline: "venda", etapaId: "venda-proposta", imovelId: "im-5", valor: 590000, responsavelId: "at-4", criadoEm: minutosAtras(base, 5760), atualizadoEm: minutosAtras(base, 2880) },
    { id: "ld-8", contatoId: "ct-4", conversaId: null, pipeline: "locacao", etapaId: "loc-assinado", imovelId: "im-4", valor: 3800, responsavelId: "at-2", criadoEm: minutosAtras(base, 10080), atualizadoEm: minutosAtras(base, 4320) },
  ];

  const eventos: EventoAtribuicao[] = [
    { id: "ev-1", conversaId: "cv-1", atendenteId: "at-1", motivo: "roleta", em: minutosAtras(base, 93) },
    { id: "ev-2", conversaId: "cv-3", atendenteId: "at-2", motivo: "roleta", em: minutosAtras(base, 240) },
    { id: "ev-3", conversaId: "cv-4", atendenteId: "at-5", motivo: "roleta", em: minutosAtras(base, 178) },
    { id: "ev-4", conversaId: "cv-7", atendenteId: "at-7", motivo: "roleta", em: minutosAtras(base, 1398) },
    { id: "ev-5", conversaId: "cv-8", atendenteId: "at-1", motivo: "manual", em: minutosAtras(base, 320) },
  ];

  return {
    contatos,
    conversas,
    mensagens,
    atendentes: ATENDENTES,
    imoveis: IMOVEIS,
    leads,
    eventos,
    ponteiro: { comercial: 2, administrativo: 1, recepcao: 0 },
  };
};
