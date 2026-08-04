import { describe, expect, it } from "vitest";
import { criarSeed } from "./seed";

describe("exemplos de triagem no seed", () => {
  const estado = criarSeed(new Date("2026-07-30T13:00:00.000Z"));

  it("mantém Marcos como exemplo de triagem com Ana", () => {
    const contato = estado.contatos.find(
      (item) => item.nome === "Marcos Oliveira",
    );
    const conversa = estado.conversas.find(
      (item) => item.contatoId === contato?.id,
    );

    expect(conversa).toMatchObject({
      id: "cv-4",
      modoTriagem: "ana",
      departamento: "administrativo",
    });
  });

  it("inclui Renata como exemplo do Manual Meta", () => {
    const contato = estado.contatos.find(
      (item) => item.nome === "Renata Almeida",
    );
    const conversa = estado.conversas.find(
      (item) => item.contatoId === contato?.id,
    );
    const mensagens = estado.mensagens.filter(
      (mensagem) => mensagem.conversaId === conversa?.id,
    );

    expect(conversa).toMatchObject({
      id: "cv-9",
      modoTriagem: "manual",
      departamento: "administrativo",
      atendenteId: "at-5",
    });
    expect(mensagens.some((mensagem) => mensagem.autor === "sistema")).toBe(true);
    expect(
      mensagens.some(
        (mensagem) => mensagem.apresentacao?.tipo === "botoes",
      ),
    ).toBe(true);
    expect(
      mensagens.some((mensagem) => mensagem.apresentacao?.tipo === "lista"),
    ).toBe(true);
  });

  it("conecta o interesse do site ao imóvel principal PZ-1001", () => {
    const imovel = estado.imoveis.find((item) => item.codigo === "PZ-1001");
    const conversa = estado.conversas.find((item) => item.id === "cv-1");
    const mensagens = estado.mensagens.filter((item) => item.conversaId === conversa?.id);
    const lead = estado.leads.find((item) => item.conversaId === conversa?.id);

    expect(imovel).toBeDefined();
    expect(mensagens.some((item) => item.texto.includes("PZ-1001"))).toBe(true);
    expect(lead?.imovelId).toBe(imovel?.id);
  });
});
