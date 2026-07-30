import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Departamento } from "@/lib/tipos";
import { DEPARTAMENTOS } from "@/lib/tipos";
import { proximaAbertura } from "@/lib/expediente/expediente";

export const SAUDACAO_ANA = `Eu sou a 🙋🏻‍♀️ *Ana*, assistente virtual da Imobiliária Perez.

Por favor, encaminhar suas mensagens por texto.

Já estou lhe encaminhando para um de nossos atendentes.

Para agilizar seu atendimento por favor, digite sua dúvida.

Seja bem vindo a Imobiliária Perez.

Para iniciar seu atendimento me informe sobre qual assunto deseja falar com a gente hoje?

🔹 1 - Comercial
🔹 2 - Administrativo
🔹 3 - Recepção e Assuntos Gerais`;

export const MENU_INVALIDO = `Não consegui identificar o assunto. Pode escolher uma das opções?

🔹 1 - Comercial
🔹 2 - Administrativo
🔹 3 - Recepção e Assuntos Gerais`;

export const mensagemEncaminhando = (departamento: Departamento) =>
  `Perfeito! Estou lhe encaminhando para o setor *${DEPARTAMENTOS[departamento]}*. Um momento, por favor.`;

export const mensagemPosicaoNaFila = (posicao: number) =>
  posicao === 1
    ? "Você é o próximo a ser atendido. Enquanto isso, pode me adiantar o que precisa?"
    : `Você está na posição *${posicao}* da fila. Enquanto isso, pode me adiantar o que precisa?`;

export const mensagemForaDoExpediente = (agora: Date) => {
  const abertura = proximaAbertura(agora);
  const quando = format(abertura, "EEEE',' d 'de' MMMM 'às' HH'h'mm", { locale: ptBR });
  return `No momento estamos fora do horário de atendimento.

Nosso horário é de segunda a sexta, das 8h às 12h e das 14h às 18h, e aos sábados das 8h às 12h.

Já registrei sua mensagem e retornaremos ${quando}.`;
};
