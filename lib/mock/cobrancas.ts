export type StatusLembrete =
  | "agendado"
  | "enviado"
  | "pausado"
  | "cancelado";

export type LembreteCobranca = {
  id: string;
  locatario: string;
  contrato: string;
  imovel: string;
  vencimento: string;
  antecedenciaDias: 1 | 3 | 5 | 7;
  horario: string;
  agendadoPara: string;
  template: "lembrete_vencimento_aluguel";
  status: StatusLembrete;
};

export type NovoLembrete = Omit<
  LembreteCobranca,
  "id" | "agendadoPara" | "template" | "status"
>;

export const NOVO_LEMBRETE_PADRAO: NovoLembrete = {
  locatario: "Renata Almeida",
  contrato: "LOC-2048",
  imovel: "Rua Santos, 245",
  vencimento: "2026-08-10",
  antecedenciaDias: 3,
  horario: "09:00",
};

export const LEMBRETES_DEMO: LembreteCobranca[] = [
  {
    id: "lc-1",
    locatario: "Beatriz Nogueira",
    contrato: "LOC-1872",
    imovel: "Ed. Aurora · Apto 804",
    vencimento: "2026-08-03",
    antecedenciaDias: 3,
    horario: "09:00",
    agendadoPara: "2026-07-31T09:00:00-03:00",
    template: "lembrete_vencimento_aluguel",
    status: "agendado",
  },
  {
    id: "lc-2",
    locatario: "Paulo Henrique",
    contrato: "LOC-1921",
    imovel: "Rua Alagoas, 630",
    vencimento: "2026-08-10",
    antecedenciaDias: 5,
    horario: "10:30",
    agendadoPara: "2026-08-05T10:30:00-03:00",
    template: "lembrete_vencimento_aluguel",
    status: "agendado",
  },
  {
    id: "lc-3",
    locatario: "Camila Rodrigues",
    contrato: "LOC-1960",
    imovel: "Residencial Íris · Casa 12",
    vencimento: "2026-08-15",
    antecedenciaDias: 7,
    horario: "09:00",
    agendadoPara: "2026-08-08T09:00:00-03:00",
    template: "lembrete_vencimento_aluguel",
    status: "agendado",
  },
  {
    id: "lc-4",
    locatario: "Eduardo Martins",
    contrato: "LOC-2004",
    imovel: "Ed. Alameda · Apto 302",
    vencimento: "2026-08-18",
    antecedenciaDias: 7,
    horario: "14:00",
    agendadoPara: "2026-08-11T14:00:00-03:00",
    template: "lembrete_vencimento_aluguel",
    status: "agendado",
  },
  {
    id: "lc-5",
    locatario: "Silvana Costa",
    contrato: "LOC-1740",
    imovel: "Av. Higienópolis, 980",
    vencimento: "2026-08-01",
    antecedenciaDias: 5,
    horario: "09:00",
    agendadoPara: "2026-07-27T09:00:00-03:00",
    template: "lembrete_vencimento_aluguel",
    status: "enviado",
  },
  {
    id: "lc-6",
    locatario: "André Carvalho",
    contrato: "LOC-1815",
    imovel: "Ed. Bosque · Apto 1102",
    vencimento: "2026-08-02",
    antecedenciaDias: 3,
    horario: "11:00",
    agendadoPara: "2026-07-30T11:00:00-03:00",
    template: "lembrete_vencimento_aluguel",
    status: "enviado",
  },
  {
    id: "lc-7",
    locatario: "Márcia Tavares",
    contrato: "LOC-1888",
    imovel: "Rua Pará, 415",
    vencimento: "2026-08-09",
    antecedenciaDias: 7,
    horario: "09:30",
    agendadoPara: "2026-08-02T09:30:00-03:00",
    template: "lembrete_vencimento_aluguel",
    status: "pausado",
  },
];
