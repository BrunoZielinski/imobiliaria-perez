import { ArrowRight, CheckCheck, CircleCheck, Clock3, MessageSquareText } from "lucide-react";
import {
  STATUS_CONTEUDO,
  agruparConteudosPorStatus,
  proximoStatusConteudo,
  type ConteudoMarketing,
  type StatusConteudo,
} from "@/lib/perez360/marketing";
import { CanalMarketingBadge } from "./canal-marketing-badge";

const ETAPAS = Object.keys(STATUS_CONTEUDO) as StatusConteudo[];

const COR_ETAPA: Record<StatusConteudo, string> = {
  rascunho: "bg-zinc-400",
  revisao: "bg-amber-400",
  aprovado: "bg-blue-500",
  agendado: "bg-violet-500",
  publicado: "bg-emerald-500",
};

export const FluxoAprovacoes = ({
  conteudos,
  aoAvancar,
}: {
  conteudos: ConteudoMarketing[];
  aoAvancar: (id: string) => void;
}) => {
  const grupos = agruparConteudosPorStatus(conteudos);

  return (
    <div className="grid gap-5">
      <section className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-5"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><CheckCheck className="size-5" /></span><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-primary">Governança de conteúdo</p><h2 className="mt-1 text-xl font-black">Fluxo de aprovações</h2><p className="mt-1 text-[10px] text-zinc-400">Da ideia à publicação, com responsáveis e observações internas.</p></div></div><span className="self-start rounded-full bg-violet-50 px-3 py-2 text-[9px] font-bold text-violet-700">Fluxo demonstrativo · nenhuma publicação real</span></section>
      <div className="overflow-x-auto pb-2"><div className="grid min-w-[76rem] grid-cols-5 gap-3">{ETAPAS.map((etapa) => <section key={etapa} className="rounded-2xl border bg-[#f8f7f5] p-3"><header className="flex items-center justify-between gap-3 px-1 py-2"><div className="flex items-center gap-2"><span className={`size-2 rounded-full ${COR_ETAPA[etapa]}`} /><h3 className="text-[10px] font-black uppercase tracking-[.1em]">{STATUS_CONTEUDO[etapa]}</h3></div><span className="grid size-6 place-items-center rounded-full bg-white text-[9px] font-black text-zinc-500">{grupos[etapa].length}</span></header><div className="mt-2 grid gap-3">{grupos[etapa].map((conteudo) => { const proximo = proximoStatusConteudo(conteudo.status); return <article key={conteudo.id} className="rounded-xl border bg-white p-3 shadow-xs"><div className="flex flex-wrap gap-1">{conteudo.canais.slice(0, 3).map((canal) => <CanalMarketingBadge key={canal} canal={canal} compacto />)}</div><h4 className="mt-3 text-xs font-black leading-4">{conteudo.titulo}</h4><p className="mt-2 text-[9px] leading-4 text-zinc-400">{conteudo.responsavel}</p>{conteudo.observacao && <div className="mt-3 rounded-lg bg-amber-50 p-2.5"><p className="flex items-center gap-1 text-[8px] font-black uppercase text-amber-700"><MessageSquareText className="size-3" /> Observação</p><p className="mt-1 text-[8px] leading-3 text-amber-800/70">{conteudo.observacao}</p></div>}{conteudo.status === "publicado" ? <span className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-2 text-[9px] font-bold text-emerald-700"><CircleCheck className="size-3.5" /> Fluxo concluído</span> : <button type="button" onClick={() => aoAvancar(conteudo.id)} className="mt-3 flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-[9px] font-bold text-zinc-600 transition hover:border-primary/30 hover:text-primary"><span>Enviar para {STATUS_CONTEUDO[proximo].toLowerCase()}</span><ArrowRight className="size-3" /></button>}</article>; })}{grupos[etapa].length === 0 && <div className="grid min-h-28 place-items-center rounded-xl border border-dashed bg-white/60 text-center"><span className="text-[9px] text-zinc-400"><Clock3 className="mx-auto mb-2 size-4" /> Nenhum item</span></div>}</div></section>)}</div></div>
    </div>
  );
};
