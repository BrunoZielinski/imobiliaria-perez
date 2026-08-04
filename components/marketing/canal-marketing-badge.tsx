import { AtSign, MessageCircle, Music2, Play, Search, type LucideIcon } from "lucide-react";
import { CANAIS_MARKETING, type CanalMarketing } from "@/lib/perez360/marketing";
import { cn } from "@/lib/utils";

const ESTILOS: Record<CanalMarketing, { icone: LucideIcon; cor: string }> = {
  instagram: { icone: AtSign, cor: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100" },
  facebook: { icone: MessageCircle, cor: "bg-blue-50 text-blue-700 border-blue-100" },
  google: { icone: Search, cor: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  tiktok: { icone: Music2, cor: "bg-zinc-100 text-zinc-900 border-zinc-200" },
  youtube: { icone: Play, cor: "bg-red-50 text-red-700 border-red-100" },
};

export const CanalMarketingBadge = ({ canal, compacto = false }: { canal: CanalMarketing; compacto?: boolean }) => {
  const { icone: Icone, cor } = ESTILOS[canal];
  return <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full border font-bold", cor, compacto ? "size-7 justify-center p-0" : "px-2.5 py-1 text-[9px]")} title={CANAIS_MARKETING[canal]}><Icone className="size-3" />{!compacto && CANAIS_MARKETING[canal]}</span>;
};
