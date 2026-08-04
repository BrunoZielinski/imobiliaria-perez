"use client";

import { useState } from "react";
import Image from "next/image";
import { Bot, Check, ChevronDown, LoaderCircle, Sparkles, WandSparkles } from "lucide-react";
import { IMOVEIS_PEREZ } from "@/lib/perez360/dados";
import {
  CANAIS_MARKETING,
  gerarKitConteudo,
  type CanalMarketing,
  type ConfiguracaoGeracao,
  type FormatoMarketing,
  type KitConteudoIA,
  type ObjetivoMarketing,
  type TomMarketing,
} from "@/lib/perez360/marketing";
import { formatarMoeda } from "@/lib/perez360/seletores";
import { cn } from "@/lib/utils";
import { PreviewConteudo } from "./preview-conteudo";

const canais = Object.keys(CANAIS_MARKETING) as CanalMarketing[];

const configuracaoInicial: ConfiguracaoGeracao = {
  imovelId: "imovel-01",
  objetivo: "vender",
  publico: "Famílias que buscam alto padrão em Londrina",
  canais,
  formato: "carrossel",
  tom: "sofisticado",
  cta: "Agende sua visita",
};

export const EstudioIA = ({ aoEnviarAprovacao }: { aoEnviarAprovacao: (kit: KitConteudoIA) => void }) => {
  const [configuracao, setConfiguracao] = useState(configuracaoInicial);
  const [kit, setKit] = useState<KitConteudoIA | null>(() => gerarKitConteudo(configuracaoInicial));
  const [gerando, setGerando] = useState(false);
  const imovel = IMOVEIS_PEREZ.find((item) => item.id === configuracao.imovelId)!;

  const alternarCanal = (canal: CanalMarketing) => {
    setConfiguracao((atual) => {
      const selecionado = atual.canais.includes(canal);
      if (selecionado && atual.canais.length === 1) return atual;
      return { ...atual, canais: selecionado ? atual.canais.filter((item) => item !== canal) : [...atual.canais, canal] };
    });
  };

  const gerar = () => {
    setGerando(true);
    window.setTimeout(() => {
      setKit(gerarKitConteudo(configuracao));
      setGerando(false);
    }, 650);
  };

  return (
    <div className="grid gap-5 2xl:grid-cols-[25rem_1fr]">
      <section className="self-start rounded-2xl border bg-white p-4 shadow-xs sm:p-5 2xl:sticky 2xl:top-0">
        <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700"><WandSparkles className="size-5" /></span><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-violet-700">Briefing inteligente</p><h2 className="mt-1 text-lg font-black">Configure a campanha</h2><p className="mt-1 text-[10px] leading-4 text-zinc-400">A IA combina o imóvel, público e canal em um kit completo.</p></div></div>

        <div className="mt-6 grid gap-5">
          <label><span className="mb-2 block text-[10px] font-black uppercase tracking-[.1em] text-zinc-500">Imóvel</span><div className="relative"><select value={configuracao.imovelId} onChange={(evento) => setConfiguracao((atual) => ({ ...atual, imovelId: evento.target.value }))} className="w-full appearance-none rounded-xl border bg-white px-3 py-3 pr-9 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20">{IMOVEIS_PEREZ.map((item) => <option key={item.id} value={item.id}>{item.codigo} · {item.bairro}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 size-4 text-zinc-400" /></div></label>

          <div className="overflow-hidden rounded-xl border"><div className="relative aspect-[2.2/1]"><Image src={imovel.imagens[0]} alt={imovel.titulo} fill sizes="400px" className="object-cover" /></div><div className="p-3"><b className="line-clamp-1 text-xs">{imovel.titulo}</b><div className="mt-1 flex items-center justify-between text-[9px] text-zinc-400"><span>{imovel.area}m² · {imovel.quartos} dorm.</span><span className="font-bold text-primary">{formatarMoeda(imovel.preco)}</span></div></div></div>

          <label><span className="mb-2 block text-[10px] font-black uppercase tracking-[.1em] text-zinc-500">Objetivo</span><select value={configuracao.objetivo} onChange={(evento) => setConfiguracao((atual) => ({ ...atual, objetivo: evento.target.value as ObjetivoMarketing }))} className="w-full rounded-xl border bg-white px-3 py-3 text-xs font-semibold outline-none"><option value="vender">Vender imóvel</option><option value="alugar">Alugar imóvel</option><option value="captar">Captar proprietário</option><option value="marca">Fortalecer a marca</option><option value="visitas">Gerar visitas</option></select></label>

          <label><span className="mb-2 block text-[10px] font-black uppercase tracking-[.1em] text-zinc-500">Público</span><textarea value={configuracao.publico} onChange={(evento) => setConfiguracao((atual) => ({ ...atual, publico: evento.target.value }))} rows={3} className="w-full resize-none rounded-xl border px-3 py-3 text-xs leading-5 outline-none focus:ring-2 focus:ring-primary/20" /></label>

          <div><span className="mb-2 block text-[10px] font-black uppercase tracking-[.1em] text-zinc-500">Canais</span><div className="grid grid-cols-2 gap-2">{canais.map((canal) => { const ativo = configuracao.canais.includes(canal); return <button key={canal} type="button" aria-pressed={ativo} onClick={() => alternarCanal(canal)} className={cn("flex items-center justify-between rounded-xl border px-3 py-2.5 text-[10px] font-bold transition", ativo ? "border-primary/30 bg-primary/5 text-primary" : "text-zinc-400")}><span>{CANAIS_MARKETING[canal]}</span>{ativo && <Check className="size-3.5" />}</button>; })}</div></div>

          <div className="grid grid-cols-2 gap-3"><label><span className="mb-2 block text-[10px] font-black uppercase tracking-[.1em] text-zinc-500">Formato</span><select value={configuracao.formato} onChange={(evento) => setConfiguracao((atual) => ({ ...atual, formato: evento.target.value as FormatoMarketing }))} className="w-full rounded-xl border bg-white px-3 py-3 text-xs outline-none"><option value="post">Post</option><option value="carrossel">Carrossel</option><option value="stories">Stories</option><option value="video_curto">Vídeo curto</option><option value="busca">Busca</option><option value="video">Vídeo</option></select></label><label><span className="mb-2 block text-[10px] font-black uppercase tracking-[.1em] text-zinc-500">Tom</span><select value={configuracao.tom} onChange={(evento) => setConfiguracao((atual) => ({ ...atual, tom: evento.target.value as TomMarketing }))} className="w-full rounded-xl border bg-white px-3 py-3 text-xs outline-none"><option value="sofisticado">Sofisticado</option><option value="proximo">Próximo</option><option value="direto">Direto</option><option value="institucional">Institucional</option></select></label></div>

          <label><span className="mb-2 block text-[10px] font-black uppercase tracking-[.1em] text-zinc-500">Chamada para ação</span><input value={configuracao.cta} onChange={(evento) => setConfiguracao((atual) => ({ ...atual, cta: evento.target.value }))} className="w-full rounded-xl border px-3 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20" /></label>

          <button type="button" disabled={gerando || !configuracao.imovelId} onClick={gerar} className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3.5 text-xs font-bold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60">{gerando ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}{gerando ? "Criando variações para cada canal..." : "Gerar campanha com IA"}</button>
          <p className="text-center text-[9px] leading-4 text-zinc-400"><Bot className="mr-1 inline size-3" /> Geração simulada. Nenhum serviço externo é utilizado.</p>
        </div>
      </section>

      <div className="min-w-0">{kit ? <PreviewConteudo kit={kit} aoEnviarAprovacao={aoEnviarAprovacao} /> : <div className="grid min-h-[30rem] place-items-center rounded-2xl border border-dashed bg-white p-8 text-center"><div><Sparkles className="mx-auto size-8 text-violet-500" /><h2 className="mt-4 text-lg font-black">Seu kit aparecerá aqui</h2><p className="mt-2 text-xs text-zinc-400">Configure a campanha e deixe a IA preparar as variações.</p></div></div>}</div>
    </div>
  );
};
