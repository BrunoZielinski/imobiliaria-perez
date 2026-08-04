import type { LucideIcon } from "lucide-react";

export const CabecalhoModulo = ({ sobrelinha, titulo, descricao, icone: Icone, acao }: { sobrelinha: string; titulo: string; descricao: string; icone: LucideIcon; acao?: React.ReactNode }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Icone className="size-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{sobrelinha}</p><h1 className="mt-1 text-2xl font-bold tracking-tight">{titulo}</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{descricao}</p></div></div>{acao}
  </div>
);
