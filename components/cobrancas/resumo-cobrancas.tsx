import {
  CalendarClock,
  CalendarDays,
  CirclePause,
  MessageCircleCheck,
} from "lucide-react";

type Resumo = {
  programados: number;
  proximosSeteDias: number;
  enviados: number;
  pausados: number;
};

const ITENS = [
  {
    chave: "programados",
    rotulo: "Programados",
    apoio: "aguardando a data",
    Icone: CalendarClock,
    classe: "bg-violet-50 text-violet-700",
  },
  {
    chave: "proximosSeteDias",
    rotulo: "Próximos 7 dias",
    apoio: "na agenda imediata",
    Icone: CalendarDays,
    classe: "bg-amber-50 text-amber-700",
  },
  {
    chave: "enviados",
    rotulo: "Enviados",
    apoio: "na demonstração",
    Icone: MessageCircleCheck,
    classe: "bg-emerald-50 text-emerald-700",
  },
  {
    chave: "pausados",
    rotulo: "Pausados",
    apoio: "aguardando revisão",
    Icone: CirclePause,
    classe: "bg-slate-100 text-slate-600",
  },
] as const;

export const ResumoCobrancas = ({ resumo }: { resumo: Resumo }) => (
  <div className="grid grid-cols-4 gap-3">
    {ITENS.map(({ chave, rotulo, apoio, Icone, classe }) => (
      <div
        key={chave}
        className="flex items-center gap-3 rounded-2xl border bg-background px-4 py-3.5 shadow-xs"
      >
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${classe}`}>
          <Icone className="size-[18px]" />
        </span>
        <div>
          <p className="text-xl font-bold leading-none">{resumo[chave]}</p>
          <p className="mt-1 text-xs font-semibold">{rotulo}</p>
          <p className="text-[10px] text-muted-foreground">{apoio}</p>
        </div>
      </div>
    ))}
  </div>
);
