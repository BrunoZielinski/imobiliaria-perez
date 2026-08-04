import { describe, expect, it } from "vitest";
import { alternarFavorito, lerFavoritos } from "./favoritos";

describe("favoritos do catálogo", () => {
  it("adiciona e remove um código sem duplicar", () => {
    expect(alternarFavorito([], "PZ-1001")).toEqual(["PZ-1001"]);
    expect(alternarFavorito(["PZ-1001"], "PZ-1001")).toEqual([]);
    expect(alternarFavorito(["PZ-1001"], "PZ-1002")).toEqual(["PZ-1001", "PZ-1002"]);
  });

  it("ignora conteúdo inválido armazenado", () => {
    expect(lerFavoritos("texto inválido")).toEqual([]);
    expect(lerFavoritos('["PZ-1001", 42]')).toEqual([]);
    expect(lerFavoritos('["PZ-1001"]')).toEqual(["PZ-1001"]);
  });
});
