import { describe, expect, it } from "vitest";
import { criarSeed } from "@/lib/mock/seed";
import { migrarSessaoPersistida } from "./migracao";

describe("migração do estado persistido do CRM", () => {
  it("substitui o seed antigo e preserva o perfil da apresentação", () => {
    const dadosAntigos = criarSeed(
      new Date("2026-07-29T13:00:00.000Z"),
    ) as unknown as {
      conversas: Array<Record<string, unknown>>;
    };
    dadosAntigos.conversas = dadosAntigos.conversas
      .filter((conversa) => conversa.id !== "cv-9")
      .map((conversa) => {
        const copia = { ...conversa };
        delete copia.modoTriagem;
        return copia;
      });

    const migrado = migrarSessaoPersistida(
      {
        dados: dadosAntigos,
        papel: "supervisor",
        usuarioId: "at-6",
      },
      0,
      new Date("2026-07-30T13:00:00.000Z"),
    );

    expect(migrado.papel).toBe("supervisor");
    expect(migrado.usuarioId).toBe("at-6");
    expect(
      migrado.dados.conversas.find((conversa) => conversa.id === "cv-4"),
    ).toMatchObject({ modoTriagem: "ana" });
    expect(
      migrado.dados.conversas.find((conversa) => conversa.id === "cv-9"),
    ).toMatchObject({ modoTriagem: "manual" });
  });

  it("atualiza sessões da versão 2 para a jornada PZ-1001", () => {
    const dadosVersao2 = criarSeed(new Date("2026-08-03T13:00:00.000Z"));
    dadosVersao2.imoveis[0] = { ...dadosVersao2.imoveis[0], codigo: "PZ-1042" };

    const migrado = migrarSessaoPersistida(
      { dados: dadosVersao2, papel: "administrador", usuarioId: "at-1" },
      2,
      new Date("2026-08-04T13:00:00.000Z"),
    );

    expect(migrado.dados.imoveis[0].codigo).toBe("PZ-1001");
  });
});
