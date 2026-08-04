"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CalendarClock,
  CircleDollarSign,
  FileKey2,
  KanbanSquare,
  Megaphone,
  MessageSquare,
  Radio,
  Settings2,
  Sparkles,
  Users,
  UsersRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { GRUPOS_NAVEGACAO, type IconeNavegacao } from "@/lib/perez360/navegacao";
import { cn } from "@/lib/utils";

export const ICONES_NAVEGACAO: Record<IconeNavegacao, LucideIcon> = {
  dashboard: BarChart3,
  radio: Radio,
  mensagens: MessageSquare,
  pipeline: KanbanSquare,
  contatos: UsersRound,
  marketing: Megaphone,
  imoveis: Building2,
  captacoes: Sparkles,
  contratos: FileKey2,
  manutencoes: Wrench,
  cobrancas: CalendarClock,
  financeiro: CircleDollarSign,
  equipe: Users,
  configuracoes: Settings2,
};

export const Navegacao = () => {
  const caminho = usePathname();
  return (
    <nav className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
      {GRUPOS_NAVEGACAO.map((grupo) => (
        <div key={grupo.rotulo}>
          <p className="mb-1.5 px-3 text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-sidebar-foreground/35">{grupo.rotulo}</p>
          <div className="grid gap-1">
            {grupo.itens.map(({ href, rotulo, icone, adicional }) => {
              const Icone = ICONES_NAVEGACAO[icone];
              return (
                <Link
                  key={href}
                  href={href}
                  title={adicional ? "Módulo demonstrativo" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-[0.8rem] font-semibold transition-all",
                    caminho.startsWith(href)
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icone className="size-4" />
                  <span className="min-w-0 flex-1 truncate">{rotulo}</span>
                  {adicional && <span className="size-1.5 rounded-full bg-amber-400 ring-2 ring-amber-400/15" />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};
