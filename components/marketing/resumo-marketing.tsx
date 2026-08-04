import {
  ArrowRight,
  Bot,
  CalendarClock,
  CircleDollarSign,
  Eye,
  Lightbulb,
  MousePointerClick,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { formatarMoeda } from "@/lib/perez360/seletores";
import {
  CAMPANHAS_MARKETING,
  CANAIS_MARKETING,
  CONTEUDOS_MARKETING,
  EVENTOS_MARKETING,
  calcularResumoMarketing,
  formatarPercentual,
  type AbaMarketing,
  type CanalMarketing,
} from "@/lib/perez360/marketing";
import { CanalMarketingBadge } from "./canal-marketing-badge";

const resumo = calcularResumoMarketing(CAMPANHAS_MARKETING, CONTEUDOS_MARKETING);

const porCanal = (Object.keys(CANAIS_MARKETING) as CanalMarketing[]).map((canal) => ({
  canal,
  total: CONTEUDOS_MARKETING.filter((item) => item.canais.includes(canal)).length,
}));

const maiorCanal = Math.max(...porCanal.map((item) => item.total));

const metricas = [
  { rotulo: "Conteúdos no mês", valor: String(resumo.planejados), apoio: "+18% vs. julho", icone: CalendarClock, tom: "bg-violet-50 text-violet-700" },
  { rotulo: "Aguardando aprovação", valor: String(resumo.aguardandoAprovacao), apoio: "2 pedem atenção", icone: Eye, tom: "bg-amber-50 text-amber-700" },
  { rotulo: "Campanhas ativas", valor: String(resumo.campanhasAtivas), apoio: "4 canais monitorados", icone: Target, tom: "bg-blue-50 text-blue-700" },
  { rotulo: "Investimento", valor: formatarMoeda(resumo.investimento), apoio: "valor demonstrativo", icone: CircleDollarSign, tom: "bg-emerald-50 text-emerald-700" },
  { rotulo: "Leads de marketing", valor: String(resumo.leads), apoio: "+32 nesta semana", icone: UsersRound, tom: "bg-rose-50 text-rose-700" },
  { rotulo: "Custo por lead", valor: formatarMoeda(resumo.cpl), apoio: "meta visual: R$ 95", icone: MousePointerClick, tom: "bg-cyan-50 text-cyan-700" },
];

export const ResumoMarketing = ({ irPara }: { irPara: (aba: AbaMarketing) => void }) => (
  <div className="grid gap-5">
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {metricas.map(({ rotulo, valor, apoio, icone: Icone, tom }) => (
        <article key={rotulo} className="rounded-2xl border bg-white p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <span className={`grid size-9 place-items-center rounded-xl ${tom}`}><Icone className="size-4" /></span>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">Atualizado</span>
          </div>
          <p className="mt-5 text-[10px] font-semibold text-zinc-500">{rotulo}</p>
          <strong className="mt-1 block text-xl tracking-tight text-zinc-950">{valor}</strong>
          <span className="mt-1 block text-[9px] text-zinc-400">{apoio}</span>
        </article>
      ))}
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
      <article className="overflow-hidden rounded-2xl bg-zinc-950 text-white shadow-sm">
        <div className="grid min-h-64 gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_18rem] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-white/75"><Sparkles className="size-3" /> Estúdio inteligente</span>
            <h2 className="mt-5 max-w-xl text-2xl font-black tracking-[-.04em] sm:text-3xl">Transforme cada imóvel em uma campanha completa.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">A IA demonstrativa prepara legendas, carrosséis, roteiros e anúncios para cinco canais, mantendo o tom da Perez.</p>
            <button type="button" onClick={() => irPara("estudio")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c52b3e] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#d63449]">Criar com a IA <ArrowRight className="size-4" /></button>
          </div>
          <div className="relative hidden h-44 lg:block">
            <div className="absolute inset-x-8 top-1 rotate-6 rounded-2xl border border-white/10 bg-white/5 p-4"><Bot className="size-5 text-rose-300" /><div className="mt-4 h-2 rounded-full bg-white/10" /><div className="mt-2 h-2 w-2/3 rounded-full bg-white/10" /></div>
            <div className="absolute inset-x-0 top-6 -rotate-3 rounded-2xl border border-white/15 bg-[#1d1d20] p-4 shadow-2xl"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-rose-500/15 text-rose-300"><Sparkles className="size-4" /></span><div><b className="block text-xs">Campanha Perez criada</b><span className="text-[9px] text-white/40">5 canais · 9 peças</span></div></div><div className="mt-4 grid grid-cols-3 gap-2"><span className="h-14 rounded-lg bg-white/5" /><span className="h-14 rounded-lg bg-white/5" /><span className="h-14 rounded-lg bg-white/5" /></div></div>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-xs sm:p-6">
        <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700"><Lightbulb className="size-5" /></span><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-amber-700">Oportunidade da semana</p><h2 className="mt-1 text-lg font-black text-zinc-950">Reforce o criativo da Gleba Palhano</h2></div></div>
        <p className="mt-4 text-xs leading-5 text-zinc-600">O carrossel do Maison Heritage tem CTR acima da média. Uma versão em vídeo curto pode ampliar o alcance sem aumentar o orçamento.</p>
        <div className="mt-5 flex items-center justify-between rounded-xl bg-white/70 p-3"><span className="text-[10px] font-semibold text-zinc-500">Potencial estimado</span><b className="flex items-center gap-1 text-sm text-emerald-700"><TrendingUp className="size-4" /> +24% alcance</b></div>
        <button type="button" onClick={() => irPara("trafego")} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-amber-800">Ver gestão de tráfego <ArrowRight className="size-3.5" /></button>
      </article>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <article className="rounded-2xl border bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-primary">Planejamento</p><h2 className="mt-1 text-lg font-black">Próximas publicações</h2></div><button type="button" onClick={() => irPara("calendario")} className="text-[10px] font-bold text-primary">Ver calendário</button></div>
        <div className="mt-5 divide-y">
          {EVENTOS_MARKETING.filter((item) => item.dia >= 6).slice(0, 4).map((evento) => (
            <div key={evento.id} className="flex items-center gap-3 py-3">
              <div className="w-10 shrink-0 text-center"><b className="block text-lg leading-none">{evento.dia}</b><span className="text-[9px] uppercase text-zinc-400">ago</span></div>
              <span className="h-8 w-px bg-zinc-100" />
              <div className="min-w-0 flex-1"><b className="block truncate text-xs">{evento.titulo}</b><span className="mt-1 block text-[9px] text-zinc-400">{evento.horario} · {evento.responsavel}</span></div>
              <CanalMarketingBadge canal={evento.canal} compacto />
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border bg-white p-5 shadow-xs sm:p-6">
        <div><p className="text-[10px] font-black uppercase tracking-[.14em] text-primary">Presença digital</p><h2 className="mt-1 text-lg font-black">Conteúdo por canal</h2></div>
        <div className="mt-5 grid gap-4">
          {porCanal.map(({ canal, total }) => (
            <div key={canal}>
              <div className="mb-1.5 flex items-center justify-between text-[10px]"><span className="font-semibold text-zinc-600">{CANAIS_MARKETING[canal]}</span><b>{total} peças</b></div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-gradient-to-r from-[#a71f32] to-[#df6677]" style={{ width: `${(total / maiorCanal) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </article>
    </section>

    <section className="rounded-2xl border bg-white p-5 shadow-xs sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-primary">Mídia paga</p><h2 className="mt-1 text-lg font-black">Campanhas em andamento</h2></div><button type="button" onClick={() => irPara("trafego")} className="text-[10px] font-bold text-primary">Abrir painel completo</button></div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {CAMPANHAS_MARKETING.filter((item) => item.status === "ativa").map((campanha) => {
          const ctr = campanha.cliques / campanha.impressoes;
          return <article key={campanha.id} className="rounded-xl border bg-[#faf9f7] p-4"><div className="flex items-start justify-between gap-3"><CanalMarketingBadge canal={campanha.canal} /><span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">Ativa</span></div><h3 className="mt-4 text-sm font-black">{campanha.nome}</h3><p className="mt-1 text-[9px] text-zinc-400">{campanha.periodo}</p><div className="mt-4 grid grid-cols-3 gap-2"><div><b className="block text-xs">{formatarPercentual(ctr)}</b><span className="text-[9px] text-zinc-400">CTR</span></div><div><b className="block text-xs">{campanha.leads}</b><span className="text-[9px] text-zinc-400">leads</span></div><div><b className="block text-xs">{formatarMoeda(campanha.investimento / campanha.leads)}</b><span className="text-[9px] text-zinc-400">CPL</span></div></div></article>;
        })}
      </div>
    </section>
  </div>
);
