import { AlertTriangle, ArrowUpRight, BrainCircuit, CircleDollarSign, Gauge, Lightbulb, MousePointerClick, Target, UsersRound } from "lucide-react";
import { IMOVEIS_PEREZ } from "@/lib/perez360/dados";
import { formatarMoeda } from "@/lib/perez360/seletores";
import { CAMPANHAS_MARKETING, calcularMetricasCampanha, formatarPercentual, type StatusCampanha } from "@/lib/perez360/marketing";
import { CanalMarketingBadge } from "./canal-marketing-badge";

const STATUS: Record<StatusCampanha, { rotulo: string; classe: string }> = {
  rascunho: { rotulo: "Rascunho", classe: "bg-zinc-100 text-zinc-600" },
  ativa: { rotulo: "Ativa", classe: "bg-emerald-50 text-emerald-700" },
  pausada: { rotulo: "Pausada", classe: "bg-amber-50 text-amber-700" },
  concluida: { rotulo: "Concluída", classe: "bg-blue-50 text-blue-700" },
};

const recomendacoes = [
  { titulo: "Escalar o Maison Heritage", texto: "CTR 31% acima da média das campanhas residenciais. Teste mais R$ 60/dia por cinco dias.", impacto: "+12 leads", icone: ArrowUpRight },
  { titulo: "Atualizar o criativo no TikTok", texto: "A frequência aumentou e o alcance incremental desacelerou. Use o roteiro gerado no Estúdio IA.", impacto: "+18% alcance", icone: Lightbulb },
  { titulo: "Expandir palavras-chave", texto: "Inclua buscas por condomínio fechado em Londrina na campanha Terra Bonita.", impacto: "+9 leads", icone: Target },
  { titulo: "Retargeting de proprietários", texto: "Crie público de visitantes da página Anuncie seu imóvel nos últimos 30 dias.", impacto: "CPL -14%", icone: BrainCircuit },
];

export const GestaoTrafego = () => {
  const investimento = CAMPANHAS_MARKETING.reduce((soma, item) => soma + item.investimento, 0);
  const leads = CAMPANHAS_MARKETING.reduce((soma, item) => soma + item.leads, 0);
  const impressoes = CAMPANHAS_MARKETING.reduce((soma, item) => soma + item.impressoes, 0);
  const cliques = CAMPANHAS_MARKETING.reduce((soma, item) => soma + item.cliques, 0);

  return (
    <div className="grid gap-5">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          [CircleDollarSign, formatarMoeda(investimento), "Investimento", "demonstrativo"],
          [Gauge, formatarPercentual(cliques / impressoes), "CTR médio", `${cliques.toLocaleString("pt-BR")} cliques`],
          [UsersRound, String(leads), "Leads gerados", "+32 nesta semana"],
          [MousePointerClick, formatarMoeda(investimento / leads), "CPL médio", "meta visual: R$ 95"],
        ].map(([Icone, valor, rotulo, apoio]) => { const Icon = Icone as typeof Target; return <article key={String(rotulo)} className="rounded-2xl border bg-white p-4 shadow-xs sm:p-5"><Icon className="size-4 text-primary" /><b className="mt-4 block text-lg tracking-tight sm:text-2xl">{String(valor)}</b><span className="mt-1 block text-[10px] font-bold text-zinc-500">{String(rotulo)}</span><span className="mt-1 block text-[9px] text-zinc-400">{String(apoio)}</span></article>; })}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {CAMPANHAS_MARKETING.map((campanha) => {
          const metricas = calcularMetricasCampanha(campanha);
          const imovel = IMOVEIS_PEREZ.find((item) => item.id === campanha.imovelId);
          const status = STATUS[campanha.status];
          return (
            <article key={campanha.id} className="rounded-2xl border bg-white p-4 shadow-xs sm:p-5">
              <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><CanalMarketingBadge canal={campanha.canal} /><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${status.classe}`}>{status.rotulo}</span></div><button type="button" aria-label={`Detalhes de ${campanha.nome}`} className="grid size-8 place-items-center rounded-lg border text-zinc-400"><ArrowUpRight className="size-3.5" /></button></div>
              <h2 className="mt-4 text-base font-black tracking-tight">{campanha.nome}</h2><p className="mt-1 text-[10px] text-zinc-400">{campanha.objetivo} · {campanha.periodo}</p>
              <div className="mt-4 rounded-xl bg-[#faf9f7] p-3"><p className="text-[9px] font-black uppercase tracking-[.1em] text-zinc-400">Público</p><p className="mt-1 text-[10px] leading-4 text-zinc-600">{campanha.publico}</p>{imovel && <span className="mt-2 inline-block text-[9px] font-bold text-primary">{imovel.codigo} · {imovel.bairro}</span>}</div>
              <div className="mt-5"><div className="flex items-center justify-between text-[10px]"><span className="font-semibold text-zinc-500">Orçamento utilizado</span><b>{formatarMoeda(campanha.investimento)} de {formatarMoeda(campanha.orcamento)}</b></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(metricas.progressoOrcamento * 100, 100)}%` }} /></div></div>
              <div className="mt-5 grid grid-cols-4 gap-2 border-t pt-4"><div><b className="block text-xs">{formatarPercentual(metricas.ctr)}</b><span className="text-[8px] text-zinc-400">CTR</span></div><div><b className="block text-xs">{formatarMoeda(metricas.cpc)}</b><span className="text-[8px] text-zinc-400">CPC</span></div><div><b className="block text-xs">{campanha.leads}</b><span className="text-[8px] text-zinc-400">Leads</span></div><div><b className="block text-xs">{formatarMoeda(metricas.cpl)}</b><span className="text-[8px] text-zinc-400">CPL</span></div></div>
            </article>
          );
        })}
      </section>

      <section className="rounded-2xl border border-violet-200 bg-violet-50 p-4 shadow-xs sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700"><BrainCircuit className="size-5" /></span><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-violet-700">Sugestões da IA · demonstração</p><h2 className="mt-1 text-lg font-black">Oportunidades de otimização</h2><p className="mt-1 text-[10px] text-violet-700/60">Recomendações baseadas nos dados fictícios desta apresentação.</p></div></div><span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white px-3 py-1.5 text-[9px] font-bold text-violet-700"><AlertTriangle className="size-3" /> Não altera campanhas reais</span></div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">{recomendacoes.map(({ titulo, texto, impacto, icone: Icone }) => <article key={titulo} className="rounded-xl border border-violet-100 bg-white p-4"><div className="flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-700"><Icone className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><b className="text-xs">{titulo}</b><span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-700">{impacto}</span></div><p className="mt-2 text-[9px] leading-4 text-zinc-500">{texto}</p></div></div></article>)}</div>
      </section>
    </div>
  );
};
