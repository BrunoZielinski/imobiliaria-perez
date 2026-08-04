"use client";

import { usePathname, useRouter } from "next/navigation";
import { ITENS_NAVEGACAO } from "@/lib/perez360/navegacao";

export const SeletorModulo = () => {
  const caminho = usePathname();
  const router = useRouter();
  const atual = ITENS_NAVEGACAO.find((item) => caminho.startsWith(item.href))?.href ?? "/dashboard";

  return <select value={atual} onChange={(evento) => router.push(evento.target.value)} aria-label="Módulo atual" className="max-w-40 rounded-lg border bg-white px-2 py-2 text-xs font-bold outline-none md:hidden">{ITENS_NAVEGACAO.map((item) => <option key={item.href} value={item.href}>{item.rotulo}</option>)}</select>;
};
