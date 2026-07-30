type Turno = { inicio: number; fim: number };

const TURNOS_SEMANA: Turno[] = [
  { inicio: 8 * 60, fim: 12 * 60 },
  { inicio: 14 * 60, fim: 18 * 60 },
];

const TURNOS_SABADO: Turno[] = [{ inicio: 8 * 60, fim: 12 * 60 }];

const turnosDoDia = (diaDaSemana: number): Turno[] => {
  if (diaDaSemana === 0) return [];
  if (diaDaSemana === 6) return TURNOS_SABADO;
  return TURNOS_SEMANA;
};

const minutosDoDia = (data: Date) => data.getHours() * 60 + data.getMinutes();

export const dentroDoExpediente = (agora: Date) =>
  turnosDoDia(agora.getDay()).some((turno) => {
    const minutos = minutosDoDia(agora);
    return minutos >= turno.inicio && minutos < turno.fim;
  });

export const proximaAbertura = (agora: Date): Date => {
  for (let offset = 0; offset < 8; offset++) {
    const dia = new Date(agora);
    dia.setDate(agora.getDate() + offset);
    for (const turno of turnosDoDia(dia.getDay())) {
      const abertura = new Date(dia);
      abertura.setHours(Math.floor(turno.inicio / 60), turno.inicio % 60, 0, 0);
      if (abertura > agora) return abertura;
    }
  }
  return agora;
};

export const minutosUteisEntre = (inicio: Date, fim: Date): number => {
  if (fim <= inicio) return 0;
  let total = 0;
  for (let offset = 0; offset < 14; offset++) {
    const dia = new Date(inicio);
    dia.setDate(inicio.getDate() + offset);
    dia.setHours(0, 0, 0, 0);
    if (dia > fim) break;
    for (const turno of turnosDoDia(dia.getDay())) {
      const abertura = new Date(dia);
      abertura.setHours(Math.floor(turno.inicio / 60), turno.inicio % 60, 0, 0);
      const fechamento = new Date(dia);
      fechamento.setHours(Math.floor(turno.fim / 60), turno.fim % 60, 0, 0);
      const de = inicio > abertura ? inicio : abertura;
      const ate = fim < fechamento ? fim : fechamento;
      if (ate > de) total += Math.round((ate.getTime() - de.getTime()) / 60000);
    }
  }
  return total;
};
