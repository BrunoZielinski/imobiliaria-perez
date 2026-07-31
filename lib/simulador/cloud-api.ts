export type TipoEventoCloud =
  | "webhook.received"
  | "webhook.acknowledged"
  | "message.accepted"
  | "message.sent"
  | "message.delivered"
  | "message.read";

export type EventoCloud = {
  id: string;
  tipo: TipoEventoCloud;
  rotulo: string;
  detalhe: string;
  em: string;
  simulado: true;
};

type SaidaCloud = {
  texto: string;
  autor: "ana" | "atendente";
  em: string;
  wamid: string;
};

const idEvento = (tipo: TipoEventoCloud, em: string, sufixo: string) =>
  `${tipo}-${em}-${sufixo}`.replaceAll(/[^a-zA-Z0-9.-]/g, "-");

const avancarSegundos = (em: string, segundos: number) =>
  new Date(new Date(em).getTime() + segundos * 1000).toISOString();

export const eventosEntradaCloud = (texto: string, em: string): EventoCloud[] => [
  {
    id: idEvento("webhook.received", em, "inbound"),
    tipo: "webhook.received",
    rotulo: "Webhook recebido",
    detalhe: `POST /webhooks/whatsapp · mensagem: “${texto}”`,
    em,
    simulado: true,
  },
  {
    id: idEvento("webhook.acknowledged", em, "ack"),
    tipo: "webhook.acknowledged",
    rotulo: "Evento confirmado",
    detalhe: "200 OK · webhook processado pela Central Perez",
    em: avancarSegundos(em, 1),
    simulado: true,
  },
];

export const eventosSaidaCloud = ({
  texto,
  autor,
  em,
  wamid,
}: SaidaCloud): EventoCloud[] => {
  const origem = autor === "ana" ? "Ana" : "Atendente";
  const base = `${wamid} · ${origem}`;

  return [
    {
      id: idEvento("message.accepted", em, wamid),
      tipo: "message.accepted",
      rotulo: "Mensagem aceita",
      detalhe: `POST /messages · ${base} · “${texto}”`,
      em,
      simulado: true,
    },
    {
      id: idEvento("message.sent", em, wamid),
      tipo: "message.sent",
      rotulo: "Enviada",
      detalhe: `${base} · status sent`,
      em: avancarSegundos(em, 1),
      simulado: true,
    },
    {
      id: idEvento("message.delivered", em, wamid),
      tipo: "message.delivered",
      rotulo: "Entregue",
      detalhe: `${base} · status delivered`,
      em: avancarSegundos(em, 2),
      simulado: true,
    },
    {
      id: idEvento("message.read", em, wamid),
      tipo: "message.read",
      rotulo: "Lida",
      detalhe: `${base} · status read`,
      em: avancarSegundos(em, 3),
      simulado: true,
    },
  ];
};
