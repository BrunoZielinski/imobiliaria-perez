import { describe, expect, it } from "vitest";
import { IMOVEIS_PEREZ } from "./dados";
import {
  ABAS_MARKETING,
  CAMPANHAS_MARKETING,
  CONTEUDOS_MARKETING,
  calcularResumoMarketing,
  calcularMetricasCampanha,
  criarConteudoDoKit,
  filtrarConteudos,
  formatarPercentual,
  gerarKitConteudo,
  proximoStatusConteudo,
} from "./marketing";

describe("marketing Perez 360", () => {
  it("expõe as seis áreas da central interna", () => {
    expect(ABAS_MARKETING.map((item) => item.id)).toEqual([
      "resumo",
      "estudio",
      "calendario",
      "trafego",
      "conteudos",
      "aprovacoes",
    ]);
  });

  it("mantém campanhas vinculadas a imóveis existentes", () => {
    const ids = new Set(IMOVEIS_PEREZ.map((item) => item.id));

    expect(
      CAMPANHAS_MARKETING.filter((item) => item.imovelId).every((item) => ids.has(item.imovelId!)),
    ).toBe(true);
  });

  it("deriva investimento, leads e CPL das campanhas", () => {
    const resumo = calcularResumoMarketing(CAMPANHAS_MARKETING, CONTEUDOS_MARKETING);

    expect(resumo.investimento).toBe(18_750);
    expect(resumo.leads).toBe(213);
    expect(resumo.cpl).toBeCloseTo(88.03, 2);
  });

  it("calcula CTR, CPC e CPL sem duplicar métricas na interface", () => {
    expect(calcularMetricasCampanha(CAMPANHAS_MARKETING[0])).toEqual({
      ctr: 3_112 / 168_300,
      cpc: 5_200 / 3_112,
      cpl: 5_200 / 54,
      progressoOrcamento: 5_200 / 7_500,
    });
  });

  it("evita métricas inválidas quando não há investimento ou leads", () => {
    expect(calcularResumoMarketing([], []).cpl).toBe(0);
    expect(formatarPercentual(0.1234)).toBe("12,3%");
  });

  it("filtra conteúdos por canal, status e imóvel", () => {
    const resultado = filtrarConteudos(CONTEUDOS_MARKETING, {
      canal: "instagram",
      status: "agendado",
      imovelId: "imovel-01",
    });

    expect(resultado.map((item) => item.id)).toEqual(["conteudo-01"]);
  });

  it("gera um kit determinístico para o imóvel principal", () => {
    const kit = gerarKitConteudo({
      imovelId: "imovel-01",
      objetivo: "vender",
      publico: "Famílias que buscam alto padrão em Londrina",
      canais: ["instagram", "facebook", "google", "tiktok", "youtube"],
      formato: "carrossel",
      tom: "sofisticado",
      cta: "Agende sua visita",
    });

    expect(kit.codigoImovel).toBe("PZ-1001");
    expect(kit.legenda).toContain("PZ-1001");
    expect(kit.titulosGoogle).toHaveLength(3);
    expect(kit.roteiroVideo.length).toBeGreaterThan(3);
    expect(kit.aderenciaMarca).toBe(96);
  });

  it("transforma o kit gerado em conteúdo para revisão", () => {
    const kit = gerarKitConteudo({
      imovelId: "imovel-01",
      objetivo: "vender",
      publico: "Famílias de Londrina",
      canais: ["instagram", "google"],
      formato: "carrossel",
      tom: "sofisticado",
      cta: "Agende sua visita",
    });

    expect(criarConteudoDoKit(kit, "conteudo-ia-01")).toMatchObject({
      id: "conteudo-ia-01",
      titulo: "Campanha IA · PZ-1001",
      canais: ["instagram", "google"],
      formato: "carrossel",
      status: "revisao",
      responsavel: "Marina Costa",
      imovelId: "imovel-01",
    });
  });

  it("avança somente pela sequência de aprovação", () => {
    expect(proximoStatusConteudo("rascunho")).toBe("revisao");
    expect(proximoStatusConteudo("revisao")).toBe("aprovado");
    expect(proximoStatusConteudo("publicado")).toBe("publicado");
  });
});
