import { Globe, MessageCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Canal } from "@/lib/tipos";
import { CANAIS } from "@/lib/tipos";

const ESTILOS: Record<Canal, string> = {
  whatsapp: "bg-whatsapp/10 text-whatsapp border-whatsapp/20",
  site: "bg-canal-site/10 text-canal-site border-canal-site/20",
  portal: "bg-canal-portal/10 text-canal-portal border-canal-portal/20",
};

const ICONES: Record<Canal, typeof Globe> = {
  whatsapp: MessageCircle,
  site: Globe,
  portal: Building2,
};

export const BadgeCanal = ({ canal, className }: { canal: Canal; className?: string }) => {
  const Icone = ICONES[canal];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
        ESTILOS[canal],
        className
      )}
    >
      <Icone className="size-3" />
      {CANAIS[canal]}
    </span>
  );
};
