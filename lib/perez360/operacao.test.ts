import { describe, expect, it } from "vitest";
import { CAPTACOES_PEREZ, CONTRATOS_PEREZ, MANUTENCOES_PEREZ } from "./dados";
import { agruparCaptacoes, agruparManutencoes, resumoContratos } from "./operacao";

describe("operação imobiliária demonstrativa", () => {
  it("resume contratos usando a data fixa da apresentação", () => {
    expect(resumoContratos(CONTRATOS_PEREZ)).toEqual({
      ativos: 3,
      reajustesProximos: 1,
      vencimentosProximos: 1,
      atencao: 1,
    });
  });

  it("separa manutenções concluídas das filas de prioridade", () => {
    const grupos = agruparManutencoes(MANUTENCOES_PEREZ);
    expect(grupos.urgente).toHaveLength(1);
    expect(grupos.alta).toHaveLength(1);
    expect(grupos.normal).toHaveLength(1);
    expect(grupos.concluida).toHaveLength(2);
  });

  it("representa as quatro etapas da captação", () => {
    const grupos = agruparCaptacoes(CAPTACOES_PEREZ);
    expect(Object.values(grupos).every((itens) => itens.length === 1)).toBe(true);
  });
});
