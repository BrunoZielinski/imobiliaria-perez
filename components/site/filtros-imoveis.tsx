"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { FiltrosImoveis as Filtros } from "@/lib/perez360/tipos";

const BAIRROS = ["todos", "Gleba Palhano", "Terra Bonita", "Aurora", "Higienópolis", "Jardim Quebec", "Centro"] as const;

type FiltrosImoveisProps = {
  filtros: Filtros;
  aoAlterar: (parcial: Partial<Filtros>) => void;
  aoLimpar: () => void;
  compacto?: boolean;
};

export const FiltrosImoveisForm = ({ filtros, aoAlterar, aoLimpar, compacto = false }: FiltrosImoveisProps) => (
  <div className={compacto ? "grid gap-5" : "sticky top-32 grid gap-6"}>
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-sm font-extrabold"><SlidersHorizontal className="size-4 text-[#b52235]" /> Filtros</h2>
      <button type="button" onClick={aoLimpar} className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 transition hover:text-[#b52235]"><RotateCcw className="size-3" /> Limpar</button>
    </div>

    <label className="grid gap-2 text-xs font-bold text-zinc-700">
      Finalidade
      <select value={filtros.finalidade ?? "todos"} onChange={(evento) => aoAlterar({ finalidade: evento.target.value as Filtros["finalidade"] })} className="h-11 rounded-xl border bg-white px-3 text-sm font-medium outline-none focus:border-[#b52235]">
        <option value="todos">Todas</option><option value="venda">Comprar</option><option value="locacao">Alugar</option><option value="lancamento">Lançamentos</option>
      </select>
    </label>

    <label className="grid gap-2 text-xs font-bold text-zinc-700">
      Tipo de imóvel
      <select value={filtros.tipo ?? "todos"} onChange={(evento) => aoAlterar({ tipo: evento.target.value as Filtros["tipo"] })} className="h-11 rounded-xl border bg-white px-3 text-sm font-medium outline-none focus:border-[#b52235]">
        <option value="todos">Todos os tipos</option><option value="apartamento">Apartamento</option><option value="casa">Casa</option><option value="comercial">Comercial</option><option value="terreno">Terreno</option>
      </select>
    </label>

    <label className="grid gap-2 text-xs font-bold text-zinc-700">
      Bairro
      <select value={filtros.bairro ?? "todos"} onChange={(evento) => aoAlterar({ bairro: evento.target.value })} className="h-11 rounded-xl border bg-white px-3 text-sm font-medium outline-none focus:border-[#b52235]">
        {BAIRROS.map((bairro) => <option key={bairro} value={bairro}>{bairro === "todos" ? "Todos os bairros" : bairro}</option>)}
      </select>
    </label>

    <div>
      <p className="text-xs font-bold text-zinc-700">Faixa de preço</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="grid gap-1 text-[0.65rem] text-zinc-400">Mínimo<input type="number" min="0" value={filtros.precoMinimo ?? ""} onChange={(evento) => aoAlterar({ precoMinimo: evento.target.value ? Number(evento.target.value) : undefined })} placeholder="R$ 0" className="h-10 min-w-0 rounded-xl border px-3 text-sm text-zinc-700 outline-none focus:border-[#b52235]" /></label>
        <label className="grid gap-1 text-[0.65rem] text-zinc-400">Máximo<input type="number" min="0" value={filtros.precoMaximo ?? ""} onChange={(evento) => aoAlterar({ precoMaximo: evento.target.value ? Number(evento.target.value) : undefined })} placeholder="Sem limite" className="h-10 min-w-0 rounded-xl border px-3 text-sm text-zinc-700 outline-none focus:border-[#b52235]" /></label>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <label className="grid gap-2 text-xs font-bold text-zinc-700">Quartos<select value={filtros.quartos ?? 0} onChange={(evento) => aoAlterar({ quartos: Number(evento.target.value) || undefined })} className="h-11 rounded-xl border bg-white px-3 text-sm font-medium"><option value="0">Qualquer</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></label>
      <label className="grid gap-2 text-xs font-bold text-zinc-700">Vagas<select value={filtros.vagas ?? 0} onChange={(evento) => aoAlterar({ vagas: Number(evento.target.value) || undefined })} className="h-11 rounded-xl border bg-white px-3 text-sm font-medium"><option value="0">Qualquer</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select></label>
    </div>
  </div>
);
