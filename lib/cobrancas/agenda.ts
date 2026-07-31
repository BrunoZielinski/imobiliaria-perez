import type {
  LembreteCobranca,
  NovoLembrete,
} from "@/lib/mock/cobrancas";

const dataMenosDias = (data: string, dias: number) => {
  const [ano, mes, dia] = data.split("-").map(Number);
  const calculada = new Date(Date.UTC(ano, mes - 1, dia - dias));
  return calculada.toISOString().slice(0, 10);
};

export const programarLembrete = (
  agenda: LembreteCobranca[],
  novo: NovoLembrete,
) => [
  ...agenda,
  {
    ...novo,
    id: `lc-demo-${agenda.length + 1}`,
    agendadoPara: `${dataMenosDias(novo.vencimento, novo.antecedenciaDias)}T${novo.horario}:00-03:00`,
    template: "lembrete_vencimento_aluguel" as const,
    status: "agendado" as const,
  },
];

const alterarAgendado = (
  agenda: LembreteCobranca[],
  id: string,
  status: "pausado" | "cancelado",
) =>
  agenda.map((lembrete) =>
    lembrete.id === id && lembrete.status === "agendado"
      ? { ...lembrete, status }
      : lembrete,
  );

export const pausarLembrete = (
  agenda: LembreteCobranca[],
  id: string,
) => alterarAgendado(agenda, id, "pausado");

export const cancelarLembrete = (
  agenda: LembreteCobranca[],
  id: string,
) => alterarAgendado(agenda, id, "cancelado");

export const resumoAgenda = (
  agenda: LembreteCobranca[],
  agora: Date,
) => {
  const limite = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    programados: agenda.filter((item) => item.status === "agendado").length,
    proximosSeteDias: agenda.filter((item) => {
      const data = new Date(item.agendadoPara);
      return item.status === "agendado" && data >= agora && data <= limite;
    }).length,
    enviados: agenda.filter((item) => item.status === "enviado").length,
    pausados: agenda.filter((item) => item.status === "pausado").length,
  };
};
