"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy, FileText, Search, Send, Sparkles, Video } from "lucide-react";
import type { KitConteudoIA } from "@/lib/perez360/marketing";
import { CanalMarketingBadge } from "./canal-marketing-badge";
import { cn } from "@/lib/utils";

type AbaPreview = "social" | "google" | "video";

export const PreviewConteudo = ({
  kit,
  aoEnviarAprovacao,
}: {
  kit: KitConteudoIA;
  aoEnviarAprovacao: (kit: KitConteudoIA) => void;
}) => {
  const [aba, setAba] = useState<AbaPreview>("social");
  const [salvo, setSalvo] = useState(false);

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-xs">
      <header className="border-b bg-[#faf9f7] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[.14em] text-violet-700"><Sparkles className="size-3" /> Kit criado pela IA</p><h2 className="mt-2 text-xl font-black tracking-[-.035em]">{kit.conceito}</h2><p className="mt-1 text-[10px] text-zinc-400">{kit.codigoImovel} · {kit.bairro} · demonstração visual</p></div>
          <div className="flex flex-wrap gap-1.5">{kit.canais.map((canal) => <CanalMarketingBadge key={canal} canal={canal} />)}</div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1">
          {([
            ["social", FileText, "Social"],
            ["google", Search, "Google"],
            ["video", Video, "Vídeo"],
          ] as const).map(([id, Icone, rotulo]) => <button key={id} type="button" onClick={() => setAba(id)} className={cn("flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[10px] font-bold transition", aba === id ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500")}><Icone className="size-3.5" /> {rotulo}</button>)}
        </div>
      </header>

      <div className="p-4 sm:p-5">
        {aba === "social" && (
          <div className="grid gap-5 xl:grid-cols-[16rem_1fr]">
            <div className="overflow-hidden rounded-2xl border bg-zinc-950">
              <div className="relative aspect-square"><Image src={kit.imagens[0]} alt={kit.tituloImovel} fill loading="eager" sizes="256px" className="object-cover opacity-90" /><span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black text-[#a71f32]">PEREZ</span><span className="absolute inset-x-3 bottom-3 rounded-xl bg-black/65 p-3 text-white backdrop-blur"><b className="block text-xs">{kit.tituloImovel}</b><span className="mt-1 block text-[9px] text-white/60">{kit.bairro} · {kit.codigoImovel}</span></span></div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">Legenda sugerida</p><button type="button" title="Copiar exemplo" className="grid size-7 place-items-center rounded-lg border text-zinc-400"><Copy className="size-3" /></button></div>
              <p className="mt-3 whitespace-pre-line text-xs leading-6 text-zinc-700">{kit.legenda}</p>
              <p className="mt-3 text-[10px] font-semibold leading-5 text-primary">{kit.hashtags.join(" ")}</p>
              <div className="mt-5 grid grid-cols-5 gap-2">{kit.carrossel.map((slide, indice) => <div key={slide} className="rounded-lg border bg-[#faf9f7] p-2"><span className="text-[8px] font-black text-primary">0{indice + 1}</span><p className="mt-2 line-clamp-3 text-[8px] leading-3 text-zinc-600">{slide}</p></div>)}</div>
            </div>
          </div>
        )}

        {aba === "google" && (
          <div className="rounded-2xl border bg-white p-4 sm:p-5"><p className="text-[9px] text-zinc-400">Anúncio · www.imobiliariaperez.com.br/imoveis/{kit.codigoImovel.toLowerCase()}</p><h3 className="mt-2 text-lg font-medium text-blue-700">{kit.titulosGoogle.join(" | ")}</h3><p className="mt-2 max-w-3xl text-xs leading-5 text-zinc-600">{kit.descricaoGoogle}</p><div className="mt-5 grid gap-2 sm:grid-cols-3">{kit.titulosGoogle.map((titulo, indice) => <div key={titulo} className="rounded-xl bg-zinc-50 p-3"><span className="text-[8px] font-black uppercase text-zinc-400">Título {indice + 1}</span><p className="mt-1 text-[10px] font-bold">{titulo}</p></div>)}</div></div>
        )}

        {aba === "video" && (
          <div className="grid gap-5 lg:grid-cols-[1fr_16rem]"><div><p className="text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">Roteiro vertical</p><div className="mt-3 grid gap-2">{kit.roteiroVideo.map((passo, indice) => <div key={passo} className="flex items-center gap-3 rounded-xl border p-3"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-zinc-950 text-[9px] font-black text-white">{indice + 1}</span><p className="text-[10px] font-semibold text-zinc-600">{passo}</p></div>)}</div></div><div className="rounded-2xl bg-zinc-950 p-4 text-white"><p className="text-[9px] font-black uppercase tracking-[.12em] text-rose-300">TikTok</p><p className="mt-3 text-[10px] leading-5 text-white/70">{kit.textoTikTok}</p><div className="my-4 h-px bg-white/10" /><p className="text-[9px] font-black uppercase tracking-[.12em] text-rose-300">YouTube</p><p className="mt-3 text-[10px] leading-5 text-white/70">{kit.textoYoutube}</p></div></div>
        )}

        <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div><div className="flex items-center justify-between text-[10px]"><span className="font-bold text-zinc-500">Aderência à marca Perez</span><b className="text-emerald-700">{kit.aderenciaMarca}%</b></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-gradient-to-r from-[#a71f32] to-emerald-500" style={{ width: `${kit.aderenciaMarca}%` }} /></div></div>
          <div className="flex gap-2"><button type="button" onClick={() => setSalvo(true)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-[10px] font-bold sm:flex-none">{salvo ? <Check className="size-3.5 text-emerald-600" /> : <FileText className="size-3.5" />}{salvo ? "Rascunho salvo" : "Salvar rascunho"}</button><button type="button" onClick={() => aoEnviarAprovacao(kit)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[10px] font-bold text-white sm:flex-none"><Send className="size-3.5" /> Enviar para aprovação</button></div>
        </div>
      </div>
    </section>
  );
};
