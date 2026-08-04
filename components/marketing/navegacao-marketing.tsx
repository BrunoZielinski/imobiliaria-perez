import {
  BarChart3,
  Bot,
  CalendarDays,
  CheckCheck,
  FolderKanban,
  MousePointerClick,
  type LucideIcon,
} from "lucide-react";
import { ABAS_MARKETING, type AbaMarketing } from "@/lib/perez360/marketing";
import { cn } from "@/lib/utils";

const ICONES: Record<AbaMarketing, LucideIcon> = {
  resumo: BarChart3,
  estudio: Bot,
  calendario: CalendarDays,
  trafego: MousePointerClick,
  conteudos: FolderKanban,
  aprovacoes: CheckCheck,
};

export const NavegacaoMarketing = ({
  aba,
  aoAlterar,
}: {
  aba: AbaMarketing;
  aoAlterar: (aba: AbaMarketing) => void;
}) => (
  <div>
    <label className="sm:hidden">
      <span className="sr-only">Área de marketing</span>
      <select
        aria-label="Área de marketing"
        value={aba}
        onChange={(evento) => aoAlterar(evento.target.value as AbaMarketing)}
        className="w-full rounded-xl border bg-white px-3 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/25"
      >
        {ABAS_MARKETING.map((item) => <option key={item.id} value={item.id}>{item.rotulo}</option>)}
      </select>
    </label>
    <div className="hidden gap-1 rounded-2xl border bg-white p-1.5 shadow-xs sm:grid sm:grid-cols-3 xl:grid-cols-6">
      {ABAS_MARKETING.map((item) => {
        const Icone = ICONES[item.id];
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={aba === item.id}
            onClick={() => aoAlterar(item.id)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition",
              aba === item.id
                ? "bg-zinc-950 text-white shadow-sm"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
            )}
          >
            <Icone className="size-3.5" />
            {item.rotulo}
          </button>
        );
      })}
    </div>
  </div>
);
