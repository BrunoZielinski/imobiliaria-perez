import { describe, expect, it } from "vitest";
import { LEMBRETES_DEMO } from "@/lib/mock/cobrancas";
import {
  cancelarLembrete,
  pausarLembrete,
  programarLembrete,
  resumoAgenda,
} from "./agenda";

describe("agenda demonstrativa de lembretes", () => {
  it("programa um lembrete local como agendado", () => {
    const resultado = programarLembrete(LEMBRETES_DEMO, {
      locatario: "Renata Almeida",
      contrato: "LOC-2048",
      imovel: "Rua Santos, 245",
      vencimento: "2026-08-10",
      antecedenciaDias: 3,
      horario: "09:00",
    });

    expect(resultado.at(-1)).toMatchObject({
      locatario: "Renata Almeida",
      status: "agendado",
      agendadoPara: "2026-08-07T09:00:00-03:00",
    });
  });

  it("pausa e cancela somente itens editáveis", () => {
    const agendado = LEMBRETES_DEMO.find(
      (item) => item.status === "agendado",
    )!;
    const enviado = LEMBRETES_DEMO.find(
      (item) => item.status === "enviado",
    )!;

    expect(pausarLembrete(LEMBRETES_DEMO, agendado.id)).toContainEqual({
      ...agendado,
      status: "pausado",
    });
    expect(cancelarLembrete(LEMBRETES_DEMO, enviado.id)).toEqual(
      LEMBRETES_DEMO,
    );
  });

  it("resume os quatro indicadores da agenda", () => {
    expect(
      resumoAgenda(
        LEMBRETES_DEMO,
        new Date("2026-07-30T12:00:00-03:00"),
      ),
    ).toEqual({
      programados: 4,
      proximosSeteDias: 2,
      enviados: 2,
      pausados: 1,
    });
  });
});
