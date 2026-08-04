import { describe, expect, it } from "vitest";
import { LANCAMENTOS_PEREZ } from "./dados";
import { calcularIndicadoresExecutivos, calcularResumoFinanceiro } from "./indicadores";

describe("indicadores executivos Perez 360", () => {
  it("resume recebimentos, repasses e pendências sem movimentar valores", () => {
    expect(calcularResumoFinanceiro(LANCAMENTOS_PEREZ)).toEqual({
      recebimentosPrevistos: 7_450,
      repassesPrevistos: 6_705,
      pendencias: 6_900,
      realizado: 3_900,
    });
  });

  it("calcula carteira e ocupação usando os dados compartilhados", () => {
    expect(calcularIndicadoresExecutivos()).toMatchObject({
      imoveisAtivos: 12,
      ocupacao: 80,
      contratosAtencao: 1,
      manutencoesAbertas: 3,
    });
  });
});
