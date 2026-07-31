import { describe, expect, it } from "vitest";
import type { Conversa } from "@/lib/tipos";
import { conversaAtivaDaSimulacao } from "./estado-demo";

const CONVERSA_PERSISTIDA: Conversa = {
  id: "cv-demo",
  contatoId: "ct-9",
  canal: "whatsapp",
  departamento: "administrativo",
  status: "atendimento",
  atendenteId: "at-5",
  criadaEm: "2026-07-30T13:00:00.000Z",
  entrouNaFilaEm: "2026-07-30T13:01:00.000Z",
  primeiraRespostaEm: null,
  contextoAna: "Contexto anterior",
  naoLidas: 1,
};

describe("estado visual da demonstração", () => {
  it("oculta uma conversa persistida antes de iniciar uma nova simulação", () => {
    expect(
      conversaAtivaDaSimulacao([CONVERSA_PERSISTIDA], "ct-9", false),
    ).toBeUndefined();
  });

  it("mostra a conversa ativa depois que a simulação foi iniciada", () => {
    expect(
      conversaAtivaDaSimulacao([CONVERSA_PERSISTIDA], "ct-9", true),
    ).toEqual(CONVERSA_PERSISTIDA);
  });
});
