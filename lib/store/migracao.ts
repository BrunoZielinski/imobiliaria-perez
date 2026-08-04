import { criarSeed, type EstadoCrm } from "@/lib/mock/seed";
import type { Papel } from "@/lib/tipos";

export type SessaoPersistida = {
  dados: EstadoCrm;
  papel: Papel;
  usuarioId: string;
};

const papeis: Papel[] = ["atendente", "supervisor", "administrador"];

export const migrarSessaoPersistida = (
  persistido: unknown,
  versao: number,
  agora = new Date(),
): SessaoPersistida => {
  if (versao >= 3) return persistido as SessaoPersistida;

  const anterior = persistido as Partial<SessaoPersistida> | undefined;
  const papel = papeis.includes(anterior?.papel as Papel)
    ? (anterior?.papel as Papel)
    : "administrador";

  return {
    dados: criarSeed(agora),
    papel,
    usuarioId: anterior?.usuarioId ?? "at-1",
  };
};
