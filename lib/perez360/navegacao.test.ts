import { describe, expect, it } from "vitest";
import { GRUPOS_NAVEGACAO } from "./navegacao";

describe("navegação Perez 360", () => {
  it("expõe cada rota interna uma única vez", () => {
    const rotas = GRUPOS_NAVEGACAO.flatMap((grupo) => grupo.itens.map((item) => item.href));

    expect(new Set(rotas).size).toBe(rotas.length);
    expect(rotas).toEqual(
      expect.arrayContaining([
        "/dashboard",
        "/inbox",
        "/pipelines",
        "/contatos",
        "/carteira",
        "/captacoes",
        "/locacoes",
        "/manutencoes",
        "/cobrancas",
        "/financeiro",
        "/atendentes",
        "/configuracoes",
      ]),
    );
  });

  it("identifica somente módulos financeiros como demonstrativos adicionais", () => {
    const adicionais = GRUPOS_NAVEGACAO.flatMap((grupo) => grupo.itens)
      .filter((item) => item.adicional)
      .map((item) => item.href);
    expect(adicionais).toEqual(["/cobrancas", "/financeiro"]);
  });
});
