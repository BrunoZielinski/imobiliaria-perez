import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CelularCliente } from "@/components/simulacao/celular-cliente";
import { CentralAoVivo } from "@/components/simulacao/central-ao-vivo";
import { criarSessaoManual, iniciarAtendimentoManual } from "./sessao-manual";

describe("celular do cliente", () => {
  it("mostra os botões oficiais durante a triagem manual", () => {
    const sessao = iniciarAtendimentoManual(
      criarSessaoManual(),
      "Olá",
      "2026-07-30T13:00:00.000Z",
    );

    const html = renderToStaticMarkup(
      createElement(CelularCliente, {
        mensagens: [],
        rascunho: "",
        iniciada: true,
        enviando: false,
        modo: "manual",
        sessaoManual: sessao,
        aoAlterarRascunho: () => undefined,
        aoEnviar: () => undefined,
        aoSelecionarOpcaoInicial: () => undefined,
        aoSelecionarAssunto: () => undefined,
      }),
    );

    expect(html).toContain("Comprar/alugar");
    expect(html).toContain("Já sou cliente");
    expect(html).toContain("Outros assuntos");
  });

  it("explica na central que o roteamento manual não usa IA", () => {
    const sessao = iniciarAtendimentoManual(
      criarSessaoManual(),
      "Olá",
      "2026-07-30T13:00:00.000Z",
    );

    const html = renderToStaticMarkup(
      createElement(CentralAoVivo, {
        mensagens: [],
        resposta: "",
        enviando: false,
        modo: "manual",
        iniciada: true,
        sessaoManual: sessao,
        aoAlterarResposta: () => undefined,
        aoResponder: () => undefined,
      }),
    );

    expect(html).toContain("Triagem manual em andamento");
    expect(html).toContain("sem IA");
  });
});
