import { describe, it, expect } from "vitest";
import { classificar } from "./classificar";

describe("classificar por menu numérico", () => {
  it("mapeia 1 para comercial com confiança total", () => {
    expect(classificar("1")).toEqual({ departamento: "comercial", confianca: 1, contexto: null });
  });

  it("mapeia 2 para administrativo", () => {
    expect(classificar("2").departamento).toBe("administrativo");
  });

  it("mapeia 3 para recepção", () => {
    expect(classificar("3").departamento).toBe("recepcao");
  });

  it("tolera espaços e emoji ao redor do número", () => {
    expect(classificar(" 🔹 1 ").departamento).toBe("comercial");
  });

  it("recusa número fora do menu", () => {
    expect(classificar("7").departamento).toBe(null);
  });
});

describe("classificar por texto livre", () => {
  it("entende intenção de compra como comercial", () => {
    const r = classificar("quero comprar um apartamento na Gleba Palhano");
    expect(r.departamento).toBe("comercial");
    expect(r.confianca).toBeGreaterThan(0);
  });

  it("entende intenção de locação como comercial", () => {
    expect(classificar("tem casa pra alugar no centro?").departamento).toBe("comercial");
  });

  it("entende boleto como administrativo", () => {
    expect(classificar("preciso da segunda via do boleto").departamento).toBe("administrativo");
  });

  it("entende vistoria como administrativo", () => {
    expect(classificar("quando vai ser a vistoria do imóvel").departamento).toBe("administrativo");
  });

  it("preserva o texto original como contexto", () => {
    const texto = "quero comprar um apartamento na Gleba Palhano";
    expect(classificar(texto).contexto).toBe(texto);
  });

  it("não classifica texto sem sinal", () => {
    const r = classificar("bom dia");
    expect(r.departamento).toBe(null);
    expect(r.confianca).toBe(0);
  });

  it("escolhe o departamento com mais sinais quando há termos dos dois", () => {
    const r = classificar("quero alugar uma casa e visitar o apartamento, e também pagar o boleto");
    expect(r.departamento).toBe("comercial");
    expect(r.confianca).toBeLessThan(1);
  });
});
