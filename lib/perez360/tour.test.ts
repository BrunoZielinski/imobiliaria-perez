import { describe, expect, it } from "vitest";
import { PASSOS_TOUR } from "./tour";

describe("tour da apresentação Perez 360", () => {
  it("percorre os oito módulos na ordem aprovada", () => {
    expect(PASSOS_TOUR.map((passo) => passo.href)).toEqual([
      "/",
      "/imoveis/pz-1001",
      "/inbox",
      "/pipelines",
      "/carteira",
      "/manutencoes",
      "/portal",
      "/dashboard",
    ]);
  });
});
