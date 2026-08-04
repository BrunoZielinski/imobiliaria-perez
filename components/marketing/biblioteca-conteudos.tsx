"use client";

import Image from "next/image";
import { useState } from "react";
import { Filter, FolderOpen, RotateCcw, Search } from "lucide-react";
import { IMOVEIS_PEREZ } from "@/lib/perez360/dados";
import {
  CANAIS_MARKETING,
  FORMATOS_MARKETING,
  STATUS_CONTEUDO,
  filtrarConteudos,
  type CanalMarketing,
  type ConteudoMarketing,
  type FormatoMarketing,
  type StatusConteudo,
} from "@/lib/perez360/marketing";
import { CanalMarketingBadge } from "./canal-marketing-badge";

type Filtros = {
  canal: CanalMarketing | "todos";
  status: StatusConteudo | "todos";
  formato: FormatoMarketing | "todos";
  imovelId: string | "todos";
};

const filtrosIniciais: Filtros = { canal: "todos", status: "todos", formato: "todos", imovelId: "todos" };

const COR_STATUS: Record<StatusConteudo, string> = {
  rascunho: "bg-zinc-100 text-zinc-600",
  revisao: "bg-amber-50 text-amber-700",
  aprovado: "bg-blue-50 text-blue-700",
  agendado: "bg-violet-50 text-violet-700",
  publicado: "bg-emerald-50 text-emerald-700",
};

export const BibliotecaConteudos = ({ conteudos }: { conteudos: ConteudoMarketing[] }) => {
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciais);
  const resultados = filtrarConteudos(conteudos, filtros);
  const alterar = <Chave extends keyof Filtros>(chave: Chave, valor: Filtros[Chave]) => setFiltros((atuais) => ({ ...atuais, [chave]: valor }));

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl border bg-white p-4 shadow-xs sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[.14em] text-primary"><FolderOpen className="size-3.5" /> Acervo interno</p><h2 className="mt-1 text-xl font-black">Biblioteca de conteúdos</h2><p className="mt-1 text-xs text-zinc-400">Peças orgânicas e pagas organizadas por canal, imóvel e etapa.</p></div><span className="self-start rounded-full bg-zinc-100 px-3 py-1.5 text-[10px] font-bold text-zinc-600">{resultados.length} de {conteudos.length} conteúdos</span></div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <label className="relative"><span className="sr-only">Filtrar por canal</span><Filter className="pointer-events-none absolute left-3 top-3.5 size-3.5 text-zinc-400" /><select aria-label="Filtrar por canal" value={filtros.canal} onChange={(evento) => alterar("canal", evento.target.value as Filtros["canal"])} className="w-full rounded-xl border bg-white py-3 pl-9 pr-3 text-[10px] font-semibold outline-none"><option value="todos">Todos os canais</option>{Object.entries(CANAIS_MARKETING).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}</select></label>
          <label><span className="sr-only">Filtrar por status</span><select aria-label="Filtrar por status" value={filtros.status} onChange={(evento) => alterar("status", evento.target.value as Filtros["status"])} className="w-full rounded-xl border bg-white px-3 py-3 text-[10px] font-semibold outline-none"><option value="todos">Todos os status</option>{Object.entries(STATUS_CONTEUDO).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}</select></label>
          <label><span className="sr-only">Filtrar por formato</span><select aria-label="Filtrar por formato" value={filtros.formato} onChange={(evento) => alterar("formato", evento.target.value as Filtros["formato"])} className="w-full rounded-xl border bg-white px-3 py-3 text-[10px] font-semibold outline-none"><option value="todos">Todos os formatos</option>{Object.entries(FORMATOS_MARKETING).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}</select></label>
          <label><span className="sr-only">Filtrar por imóvel</span><select aria-label="Filtrar por imóvel" value={filtros.imovelId} onChange={(evento) => alterar("imovelId", evento.target.value)} className="w-full rounded-xl border bg-white px-3 py-3 text-[10px] font-semibold outline-none"><option value="todos">Todos os imóveis</option>{IMOVEIS_PEREZ.map((item) => <option key={item.id} value={item.id}>{item.codigo} · {item.bairro}</option>)}</select></label>
        </div>
      </section>

      {resultados.length === 0 ? (
        <section className="grid min-h-80 place-items-center rounded-2xl border border-dashed bg-white p-8 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-zinc-100 text-zinc-400"><Search className="size-6" /></span><h2 className="mt-5 text-lg font-black">Nenhum conteúdo com esses filtros</h2><p className="mt-2 text-xs text-zinc-400">Amplie a busca para voltar a visualizar a biblioteca.</p><button type="button" onClick={() => setFiltros(filtrosIniciais)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-[10px] font-bold text-white"><RotateCcw className="size-3.5" /> Limpar filtros</button></div></section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {resultados.map((conteudo, indice) => {
            const imovel = IMOVEIS_PEREZ.find((item) => item.id === conteudo.imovelId);
            return <article key={conteudo.id} className="overflow-hidden rounded-2xl border bg-white shadow-xs"><div className="relative aspect-[1.9/1] overflow-hidden bg-gradient-to-br from-zinc-950 via-[#711522] to-[#c52b3e]">{imovel ? <Image src={imovel.imagens[0]} alt={imovel.titulo} fill loading={indice < 3 ? "eager" : "lazy"} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="absolute inset-0 grid place-items-center"><span className="text-3xl font-black tracking-[.2em] text-white/20">PEREZ</span></div>}<div className="absolute inset-x-3 top-3 flex items-start justify-between"><span className="rounded-full bg-white/90 px-2.5 py-1 text-[8px] font-black text-primary backdrop-blur">{FORMATOS_MARKETING[conteudo.formato]}</span><span className={`rounded-full px-2.5 py-1 text-[8px] font-black ${COR_STATUS[conteudo.status]}`}>{STATUS_CONTEUDO[conteudo.status]}</span></div></div><div className="p-4"><div className="flex flex-wrap gap-1">{conteudo.canais.map((canal) => <CanalMarketingBadge key={canal} canal={canal} compacto />)}</div><h3 className="mt-4 line-clamp-2 text-sm font-black leading-5">{conteudo.titulo}</h3><p className="mt-2 line-clamp-2 text-[9px] leading-4 text-zinc-400">{conteudo.descricao}</p><div className="mt-4 flex items-center justify-between border-t pt-3 text-[9px]"><span className="font-semibold text-zinc-500">{conteudo.responsavel}</span><span className="text-zinc-400">{new Date(conteudo.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span></div></div></article>;
          })}
        </section>
      )}
    </div>
  );
};
