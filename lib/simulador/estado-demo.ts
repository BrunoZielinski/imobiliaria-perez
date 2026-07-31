import type { Conversa } from "@/lib/tipos";

export const conversaAtivaDaSimulacao = (
  conversas: Conversa[],
  contatoId: string,
  iniciada: boolean,
): Conversa | undefined => {
  if (!iniciada) return undefined;
  return conversas.find(
    (conversa) =>
      conversa.contatoId === contatoId && conversa.status !== "encerrada",
  );
};
