import { describe, expect, it } from "vitest";
import {
  concluirDescricaoManual,
  criarSessaoManual,
  iniciarAtendimentoManual,
  selecionarAssuntoManual,
  selecionarOpcaoManual,
} from "./sessao-manual";

describe("sessão de triagem manual", () => {
  it("responde à saudação com os botões oficiais", () => {
    const sessao = iniciarAtendimentoManual(
      criarSessaoManual(),
      "Olá",
      "2026-07-30T13:00:00.000Z",
    );

    expect(sessao.etapa).toBe("opcao_inicial");
    expect(sessao.registros.map((registro) => registro.formato)).toEqual([
      "texto",
      "botoes",
    ]);
    expect(sessao.registros[1].texto).toContain("Como podemos ajudar");
  });

  it("abre a lista quando a pessoa já é cliente", () => {
    const iniciada = iniciarAtendimentoManual(
      criarSessaoManual(),
      "Olá",
      "2026-07-30T13:00:00.000Z",
    );
    const sessao = selecionarOpcaoManual(
      iniciada,
      "cliente_atual",
      "2026-07-30T13:01:00.000Z",
    );

    expect(sessao?.etapa).toBe("assuntos");
    expect(sessao?.registros.at(-1)?.formato).toBe("lista");
  });

  it("guarda assunto e departamento ao selecionar financeiro", () => {
    const iniciada = iniciarAtendimentoManual(
      criarSessaoManual(),
      "Olá",
      "2026-07-30T13:00:00.000Z",
    );
    const comLista = selecionarOpcaoManual(
      iniciada,
      "cliente_atual",
      "2026-07-30T13:01:00.000Z",
    );
    const sessao = selecionarAssuntoManual(
      comLista!,
      "financeiro_boletos",
      "2026-07-30T13:02:00.000Z",
    );

    expect(sessao).toMatchObject({
      etapa: "descricao",
      departamento: "administrativo",
      assunto: "Financeiro e boletos",
    });
  });

  it("conclui a triagem com contexto estruturado sem IA", () => {
    const iniciada = iniciarAtendimentoManual(
      criarSessaoManual(),
      "Olá",
      "2026-07-30T13:00:00.000Z",
    );
    const comLista = selecionarOpcaoManual(
      iniciada,
      "cliente_atual",
      "2026-07-30T13:01:00.000Z",
    );
    const comAssunto = selecionarAssuntoManual(
      comLista!,
      "financeiro_boletos",
      "2026-07-30T13:02:00.000Z",
    );
    const resultado = concluirDescricaoManual(
      comAssunto!,
      "Gostaria de revisar a multa do aluguel.",
      "2026-07-30T13:03:00.000Z",
    );

    expect(resultado?.sessao.etapa).toBe("encaminhado");
    expect(resultado?.contexto).toBe(
      "Financeiro e boletos: Gostaria de revisar a multa do aluguel.",
    );
    expect(resultado?.departamento).toBe("administrativo");
  });

  it("não aceita escolhas fora da etapa esperada", () => {
    const vazia = criarSessaoManual();

    expect(
      selecionarOpcaoManual(vazia, "cliente_atual", "2026-07-30T13:00:00.000Z"),
    ).toBeNull();
    expect(
      concluirDescricaoManual(vazia, "texto", "2026-07-30T13:00:00.000Z"),
    ).toBeNull();
  });
});
