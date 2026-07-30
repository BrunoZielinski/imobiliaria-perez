"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, KanbanSquare, Users, ChartLine } from "lucide-react";
import { cn } from "@/lib/utils";

const ITENS = [
  { href: "/inbox", rotulo: "Inbox", icone: Inbox },
  { href: "/pipelines", rotulo: "Pipelines", icone: KanbanSquare },
  { href: "/atendentes", rotulo: "Atendentes", icone: Users },
  { href: "/dashboard", rotulo: "Dashboard", icone: ChartLine },
];

export const Navegacao = () => {
  const caminho = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-2">
      {ITENS.map(({ href, rotulo, icone: Icone }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            caminho.startsWith(href)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icone className="size-4" />
          {rotulo}
        </Link>
      ))}
    </nav>
  );
};
