import { describe, expect, it } from "vitest";
import { resolverAssuntoCliente, resolverOpcaoInicial } from "./fluxo-manual";

describe("fluxo manual", () => {
  it("abre a lista de assuntos para um cliente atual", () => {
    expect(resolverOpcaoInicial("cliente_atual")).toEqual({
      proximaEtapa: "assuntos",
    });
  });

  it("encaminha interesse em imóvel ao comercial", () => {
    expect(resolverOpcaoInicial("comprar_alugar")).toEqual({
      proximaEtapa: "descricao",
      departamento: "comercial",
      assunto: "Comprar ou alugar um imóvel",
    });
  });

  it("encaminha outros assuntos à recepção", () => {
    expect(resolverOpcaoInicial("outros_assuntos")).toEqual({
      proximaEtapa: "descricao",
      departamento: "recepcao",
      assunto: "Outros assuntos",
    });
  });

  it("encaminha financeiro ao administrativo", () => {
    expect(resolverAssuntoCliente("financeiro_boletos")).toEqual({
      proximaEtapa: "descricao",
      departamento: "administrativo",
      assunto: "Financeiro e boletos",
    });
  });

  it("encaminha recepção geral à recepção", () => {
    expect(resolverAssuntoCliente("recepcao_geral")).toEqual({
      proximaEtapa: "descricao",
      departamento: "recepcao",
      assunto: "Recepção e assuntos gerais",
    });
  });

  it("rejeita identificadores inexistentes", () => {
    expect(resolverOpcaoInicial("inexistente")).toBeNull();
    expect(resolverAssuntoCliente("inexistente")).toBeNull();
  });
});
