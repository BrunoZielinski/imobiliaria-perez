import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ResumoCobrancas } from "@/components/cobrancas/resumo-cobrancas";
import { DetalheLembrete } from "@/components/cobrancas/detalhe-lembrete";
import { LEMBRETES_DEMO } from "@/lib/mock/cobrancas";

describe("apresentação do módulo de lembretes", () => {
  it("mostra os quatro indicadores sem valores financeiros", () => {
    const html = renderToStaticMarkup(
      createElement(ResumoCobrancas, {
        resumo: {
          programados: 4,
          proximosSeteDias: 2,
          enviados: 2,
          pausados: 1,
        },
      }),
    );

    expect(html).toContain("Programados");
    expect(html).toContain("Próximos 7 dias");
    expect(html).toContain(">4<");
    expect(html).toContain(">2<");
  });

  it("explica que template e envio são demonstrativos", () => {
    const html = renderToStaticMarkup(
      createElement(DetalheLembrete, {
        lembrete: LEMBRETES_DEMO[0],
        aoPausar: () => undefined,
        aoSolicitarCancelamento: () => undefined,
      }),
    );

    expect(html).toContain("Template Meta aprovado — demonstração");
    expect(html).toContain("Pausar");
    expect(html).toContain("Cancelar");
    expect(html).toContain("Nenhuma mensagem real será enviada");
  });
});
