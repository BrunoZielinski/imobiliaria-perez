import { describe, expect, it } from "vitest";
import { criarSeed } from "@/lib/mock/seed";
import { rotuloModoTriagem, separarExemplosTriagem } from "./apresentacao";

describe("apresentação dos exemplos de triagem", () => {
  const conversas = criarSeed(
    new Date("2026-07-30T13:00:00.000Z"),
  ).conversas;

  it("mantém Ana e Manual Meta em uma seção fixa", () => {
    const secoes = separarExemplosTriagem(conversas);

    expect(secoes.exemplos.map((conversa) => conversa.id)).toEqual([
      "cv-4",
      "cv-9",
    ]);
    expect(secoes.operacionais.map((conversa) => conversa.id)).not.toContain(
      "cv-4",
    );
    expect(secoes.operacionais.map((conversa) => conversa.id)).not.toContain(
      "cv-9",
    );
  });

  it("usa rótulos comerciais claros", () => {
    expect(rotuloModoTriagem("ana")).toBe("Com Ana");
    expect(rotuloModoTriagem("manual")).toBe("Manual Meta");
    expect(rotuloModoTriagem("direto")).toBeNull();
  });
});
