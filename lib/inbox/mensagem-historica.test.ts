import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MensagemHistorica } from "@/components/inbox/mensagem-historica";

describe("mensagem histórica do inbox", () => {
  it("exibe botões da Meta como opções já respondidas", () => {
    const html = renderToStaticMarkup(
      createElement(MensagemHistorica, {
        mensagem: {
          id: "ms-1",
          conversaId: "cv-1",
          autor: "sistema",
          texto: "Como podemos ajudar hoje?",
          em: "2026-07-30T13:00:00.000Z",
          apresentacao: {
            tipo: "botoes",
            opcoes: ["Comprar ou alugar", "Já sou cliente"],
          },
        },
      }),
    );

    expect(html).toContain("Automação Meta");
    expect(html).toContain("Já sou cliente");
    expect(html).toContain("aria-disabled=\"true\"");
  });

  it("identifica a mensagem da Ana", () => {
    const html = renderToStaticMarkup(
      createElement(MensagemHistorica, {
        mensagem: {
          id: "ms-2",
          conversaId: "cv-1",
          autor: "ana",
          texto: "Vou organizar seu atendimento.",
          em: "2026-07-30T13:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Ana");
    expect(html).toContain("Vou organizar seu atendimento.");
  });
});
