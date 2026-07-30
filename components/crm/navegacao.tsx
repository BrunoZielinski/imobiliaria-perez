"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, KanbanSquare, MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const ITENS = [
  { href: "/inbox", rotulo: "Conversas", icone: MessageSquare },
  { href: "/pipelines", rotulo: "CRM", icone: KanbanSquare },
  { href: "/carteira", rotulo: "Carteira", icone: Building2 },
  { href: "/atendentes", rotulo: "Equipe", icone: Users },
  { href: "/dashboard", rotulo: "Indicadores", icone: BarChart3 },
];

export const Navegacao = () => {
  const caminho = usePathname();
  return (
    <nav className="flex flex-col gap-1 px-3 py-5">
      {ITENS.map(({ href, rotulo, icone: Icone }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
            caminho.startsWith(href)
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <Icone className="size-[18px]" />
          {rotulo}
        </Link>
      ))}
    </nav>
  );
};
