"use client";

import { useMemo, useState } from "react";
import { Grid2X2, ListFilter, Map, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { buscarImoveis } from "@/lib/perez360/seletores";
import type { FiltrosImoveis as Filtros } from "@/lib/perez360/tipos";
import { CardImovel } from "./card-imovel";
import { FiltrosImoveisForm } from "./filtros-imoveis";
import { MapaDemonstrativo } from "./mapa-demonstrativo";

const FILTROS_INICIAIS: Filtros = { finalidade: "todos", tipo: "todos", bairro: "todos" };

export const CatalogoImoveis = ({ finalidadeInicial, buscaInicial }: { finalidadeInicial?: string; buscaInicial?: string }) => {
  const [filtros, setFiltros] = useState<Filtros>({
    ...FILTROS_INICIAIS,
    finalidade: ["venda", "locacao", "lancamento"].includes(finalidadeInicial ?? "") ? (finalidadeInicial as Filtros["finalidade"]) : "todos",
    busca: buscaInicial ?? "",
  });
  const [ordem, setOrdem] = useState("relevancia");
  const [visualizacao, setVisualizacao] = useState<"grade" | "mapa">("grade");

  const resultados = useMemo(() => {
    const itens = [...buscarImoveis(filtros)];
    if (ordem === "menor-preco") itens.sort((a, b) => a.preco - b.preco);
    if (ordem === "maior-preco") itens.sort((a, b) => b.preco - a.preco);
    if (ordem === "maior-area") itens.sort((a, b) => b.area - a.area);
    return itens;
  }, [filtros, ordem]);

  const alterar = (parcial: Partial<Filtros>) => setFiltros((atuais) => ({ ...atuais, ...parcial }));
  const limpar = () => setFiltros(FILTROS_INICIAIS);

  return (
    <div className="mx-auto max-w-[90rem] px-5 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b52235]">Seleção Perez</p><h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl">Imóveis em Londrina</h1><p className="mt-3 text-sm text-zinc-500 sm:text-base">Encontre o espaço certo para morar, investir ou começar uma nova fase.</p></div>
        <label className="flex w-full max-w-md items-center gap-3 rounded-full border bg-white px-5 py-3 shadow-sm"><Search className="size-4 text-[#b52235]" /><span className="sr-only">Buscar imóveis</span><input value={filtros.busca ?? ""} onChange={(evento) => alterar({ busca: evento.target.value })} placeholder="Bairro, tipo ou código" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />{filtros.busca && <button type="button" onClick={() => alterar({ busca: "" })} aria-label="Limpar busca"><X className="size-4 text-zinc-400" /></button>}</label>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sheet><SheetTrigger render={<Button variant="outline" className="lg:hidden" />}><ListFilter className="size-4" /> Filtros</SheetTrigger><SheetContent side="left" className="w-[88%] overflow-y-auto bg-[#faf9f7] p-0"><SheetHeader className="border-b bg-white p-5 text-left"><SheetTitle>Filtrar imóveis</SheetTitle><SheetDescription>Refine a seleção Perez.</SheetDescription></SheetHeader><div className="p-5"><FiltrosImoveisForm filtros={filtros} aoAlterar={alterar} aoLimpar={limpar} compacto /></div></SheetContent></Sheet>
          <span className="text-sm font-bold text-zinc-800">{resultados.length} imóveis</span>
        </div>
        <div className="flex items-center gap-2">
          <select value={ordem} onChange={(evento) => setOrdem(evento.target.value)} aria-label="Ordenar imóveis" className="h-10 rounded-full border bg-white px-4 text-xs font-bold text-zinc-600"><option value="relevancia">Mais relevantes</option><option value="menor-preco">Menor preço</option><option value="maior-preco">Maior preço</option><option value="maior-area">Maior área</option></select>
          <div className="flex rounded-full border bg-white p-1"><button type="button" onClick={() => setVisualizacao("grade")} aria-label="Visualizar em grade" aria-pressed={visualizacao === "grade"} className={`grid size-8 place-items-center rounded-full ${visualizacao === "grade" ? "bg-zinc-950 text-white" : "text-zinc-400"}`}><Grid2X2 className="size-3.5" /></button><button type="button" onClick={() => setVisualizacao("mapa")} aria-label="Visualizar mapa" aria-pressed={visualizacao === "mapa"} className={`grid size-8 place-items-center rounded-full ${visualizacao === "mapa" ? "bg-zinc-950 text-white" : "text-zinc-400"}`}><Map className="size-3.5" /></button></div>
        </div>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[17rem_1fr]">
        <aside className="hidden rounded-[1.35rem] border bg-[#faf9f7] p-5 lg:block"><FiltrosImoveisForm filtros={filtros} aoAlterar={alterar} aoLimpar={limpar} /></aside>
        <div>
          {resultados.length === 0 ? (
            <div className="grid min-h-96 place-items-center rounded-[1.5rem] border border-dashed bg-[#faf9f7] p-8 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-full bg-[#f2dfe2] text-[#b52235]"><Search className="size-6" /></span><h2 className="mt-5 text-xl font-black">Nenhum imóvel com esses filtros</h2><p className="mt-2 text-sm text-zinc-500">Experimente ampliar sua busca para ver outras oportunidades.</p><button type="button" onClick={limpar} className="mt-5 rounded-full bg-[#b52235] px-5 py-2.5 text-sm font-bold text-white">Limpar filtros</button></div></div>
          ) : visualizacao === "mapa" ? (
            <MapaDemonstrativo imoveis={resultados} />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{resultados.map((imovel) => <CardImovel key={imovel.id} imovel={imovel} compacto />)}</div>
          )}
        </div>
      </div>
    </div>
  );
};
