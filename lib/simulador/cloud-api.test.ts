import { describe, expect, it } from "vitest";
import { eventosEntradaCloud, eventosSaidaCloud } from "./cloud-api";

describe("eventos da Cloud API simulada", () => {
  it("representa o webhook de entrada e sua confirmação", () => {
    const eventos = eventosEntradaCloud("Olá", "2026-07-30T13:00:00.000Z");

    expect(eventos.map((evento) => evento.tipo)).toEqual([
      "webhook.received",
      "webhook.acknowledged",
    ]);
    expect(eventos[0].detalhe).toContain("Olá");
    expect(eventos[1].detalhe).toContain("200 OK");
  });

  it("representa aceite, envio, entrega e leitura da resposta", () => {
    const eventos = eventosSaidaCloud({
      texto: "Olá! Eu sou a Ana.",
      autor: "ana",
      em: "2026-07-30T13:00:02.000Z",
      wamid: "wamid.demo-1",
    });

    expect(eventos.map((evento) => evento.tipo)).toEqual([
      "message.accepted",
      "message.sent",
      "message.delivered",
      "message.read",
    ]);
    expect(eventos.every((evento) => evento.simulado)).toBe(true);
    expect(eventos.every((evento) => evento.detalhe.includes("wamid.demo-1"))).toBe(true);
  });
});
