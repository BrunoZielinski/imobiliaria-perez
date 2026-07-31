import { describe, expect, it } from "vitest";
import {
  eventosEntradaCloud,
  eventosEntradaInterativaCloud,
  eventosSaidaCloud,
  eventosSaidaInterativaCloud,
} from "./cloud-api";

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

  it("representa a resposta de um botão interativo", () => {
    const eventos = eventosEntradaInterativaCloud({
      tipo: "button_reply",
      id: "cliente_atual",
      titulo: "Já sou cliente",
      em: "2026-07-30T13:00:00.000Z",
    });

    expect(eventos.map((evento) => evento.tipo)).toEqual([
      "webhook.received",
      "webhook.acknowledged",
    ]);
    expect(eventos[0].detalhe).toContain("interactive.button_reply");
    expect(eventos[0].detalhe).toContain("cliente_atual");
  });

  it("representa a resposta de um item de lista", () => {
    const eventos = eventosEntradaInterativaCloud({
      tipo: "list_reply",
      id: "financeiro_boletos",
      titulo: "Financeiro/boletos",
      em: "2026-07-30T13:00:00.000Z",
    });

    expect(eventos[0].detalhe).toContain("interactive.list_reply");
    expect(eventos[0].detalhe).toContain("financeiro_boletos");
  });

  it("representa o envio de uma lista interativa", () => {
    const eventos = eventosSaidaInterativaCloud({
      tipo: "list",
      titulo: "Escolha o assunto",
      em: "2026-07-30T13:00:02.000Z",
      wamid: "wamid.manual.lista",
    });

    expect(eventos[0].detalhe).toContain("interactive.type=list");
    expect(eventos.map((evento) => evento.tipo)).toEqual([
      "message.accepted",
      "message.sent",
      "message.delivered",
      "message.read",
    ]);
    expect(eventos.every((evento) => evento.detalhe.includes("wamid.manual.lista"))).toBe(true);
  });
});
