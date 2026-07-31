import type { Conversa, ModoTriagem } from "@/lib/tipos";

const IDS_EXEMPLOS = ["cv-4", "cv-9"] as const;

export const separarExemplosTriagem = (conversas: Conversa[]) => {
  const porId = new Map(conversas.map((conversa) => [conversa.id, conversa]));
  const exemplos = IDS_EXEMPLOS.flatMap((id) => {
    const conversa = porId.get(id);
    return conversa ? [conversa] : [];
  });
  const ids = new Set(IDS_EXEMPLOS);

  return {
    exemplos,
    operacionais: conversas.filter(
      (conversa) => !ids.has(conversa.id as (typeof IDS_EXEMPLOS)[number]),
    ),
  };
};

export const rotuloModoTriagem = (modo: ModoTriagem) => {
  if (modo === "ana") return "Com Ana";
  if (modo === "manual") return "Manual Meta";
  return null;
};
