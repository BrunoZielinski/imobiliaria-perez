import { describe, expect, it } from "vitest";
import { IMOVEIS_PEREZ } from "./dados";
import { buscarImoveis, imoveisRelacionados, obterImovel } from "./seletores";

describe("catálogo Perez 360", () => {
  it("filtra finalidade, bairro, dormitórios e preço", () => {
    const resultado = buscarImoveis({
      finalidade: "venda",
      bairro: "Gleba Palhano",
      quartos: 3,
      precoMaximo: 1_500_000,
    });

    expect(resultado.length).toBeGreaterThan(0);
    expect(
      resultado.every(
        (item) =>
          item.finalidade === "venda" &&
          item.bairro === "Gleba Palhano" &&
          item.quartos >= 3 &&
          item.preco <= 1_500_000,
      ),
    ).toBe(true);
  });

  it("encontra imóvel pelo código independentemente de caixa", () => {
    expect(obterImovel("pz-1001")?.codigo).toBe("PZ-1001");
  });

  it("busca texto sem depender de acentos", () => {
    expect(buscarImoveis({ busca: "higienopolis" }).map((item) => item.codigo)).toContain(
      "PZ-1006",
    );
  });

  it("não repete o imóvel entre os relacionados", () => {
    const base = IMOVEIS_PEREZ[0];
    expect(imoveisRelacionados(base, 3)).not.toContainEqual(base);
  });
});
