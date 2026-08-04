import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Radio, Send } from "lucide-react";
import { EVENTOS_MARKETING, STATUS_CONTEUDO, type StatusConteudo } from "@/lib/perez360/marketing";
import { CanalMarketingBadge } from "./canal-marketing-badge";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const ESTILO_STATUS: Record<StatusConteudo, string> = {
  rascunho: "bg-zinc-100 text-zinc-600",
  revisao: "bg-amber-50 text-amber-700",
  aprovado: "bg-blue-50 text-blue-700",
  agendado: "bg-violet-50 text-violet-700",
  publicado: "bg-emerald-50 text-emerald-700",
};

export const CalendarioEditorial = () => (
  <div className="grid gap-5">
    <section className="overflow-hidden rounded-2xl border bg-white shadow-xs">
      <header className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><CalendarDays className="size-5" /></span><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-primary">Planejamento editorial</p><h2 className="mt-1 text-lg font-black">Agosto de 2026</h2></div></div>
        <div className="flex items-center gap-2"><button type="button" aria-label="Mês anterior" className="grid size-9 place-items-center rounded-xl border text-zinc-400"><ChevronLeft className="size-4" /></button><button type="button" className="rounded-xl border px-4 py-2 text-[10px] font-bold">Hoje</button><button type="button" aria-label="Próximo mês" className="grid size-9 place-items-center rounded-xl border text-zinc-400"><ChevronRight className="size-4" /></button></div>
      </header>

      <div className="overflow-x-auto">
        <div className="min-w-[58rem] p-4 sm:p-5">
          <div className="grid grid-cols-7 border-b">{DIAS_SEMANA.map((dia) => <div key={dia} className="px-2 pb-3 text-center text-[9px] font-black uppercase tracking-[.12em] text-zinc-400">{dia}</div>)}</div>
          <div className="grid grid-cols-7 border-l border-t">
            {Array.from({ length: 6 }, (_, indice) => <div key={`vazio-${indice}`} className="min-h-28 border-b border-r bg-zinc-50/70" />)}
            {Array.from({ length: 31 }, (_, indice) => {
              const dia = indice + 1;
              const eventos = EVENTOS_MARKETING.filter((item) => item.dia === dia);
              return <div key={dia} className="min-h-28 border-b border-r p-2"><span className="text-[10px] font-black text-zinc-500">{dia}</span><div className="mt-2 grid gap-1.5">{eventos.slice(0, 2).map((evento) => <div key={evento.id} className="rounded-lg border bg-[#faf9f7] p-2"><div className="flex items-center justify-between gap-1"><CanalMarketingBadge canal={evento.canal} compacto /><span className="text-[8px] font-bold text-zinc-400">{evento.horario}</span></div><p className="mt-1.5 line-clamp-2 text-[8px] font-bold leading-3">{evento.titulo}</p><span className="mt-1 block text-[7px] uppercase text-zinc-400">{evento.tipo === "pago" ? "Mídia paga" : "Orgânico"}</span></div>)}{eventos.length > 2 && <span className="text-[8px] font-bold text-primary">+{eventos.length - 2} itens</span>}</div></div>;
            })}
          </div>
        </div>
      </div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[1fr_20rem]">
      <article className="rounded-2xl border bg-white p-4 shadow-xs sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-primary">Fila de publicação</p><h2 className="mt-1 text-lg font-black">Próximos agendamentos</h2></div><Send className="size-5 text-zinc-300" /></div><div className="mt-5 divide-y">{EVENTOS_MARKETING.filter((item) => item.dia >= 6).slice(0, 5).map((evento) => <div key={evento.id} className="flex items-center gap-3 py-3"><div className="w-10 shrink-0 rounded-xl bg-zinc-50 py-2 text-center"><b className="block text-sm">{evento.dia}</b><span className="text-[8px] uppercase text-zinc-400">ago</span></div><div className="min-w-0 flex-1"><b className="block truncate text-xs">{evento.titulo}</b><span className="mt-1 flex items-center gap-1 text-[9px] text-zinc-400"><Clock3 className="size-3" /> {evento.horario} · {evento.responsavel}</span></div><span className={`hidden rounded-full px-2 py-1 text-[8px] font-bold sm:block ${ESTILO_STATUS[evento.status]}`}>{STATUS_CONTEUDO[evento.status]}</span><CanalMarketingBadge canal={evento.canal} compacto /></div>)}</div></article>

      <article className="rounded-2xl border bg-zinc-950 p-5 text-white shadow-xs"><Radio className="size-5 text-rose-300" /><p className="mt-5 text-[10px] font-black uppercase tracking-[.14em] text-rose-300">Legenda</p><h2 className="mt-1 text-lg font-black">Tipos e etapas</h2><div className="mt-5 grid gap-3"><div className="flex items-center gap-2 text-[10px] text-white/60"><span className="size-2 rounded-full bg-[#df6677]" /> Conteúdo orgânico</div><div className="flex items-center gap-2 text-[10px] text-white/60"><span className="size-2 rounded-full bg-amber-400" /> Mídia paga</div><div className="my-1 h-px bg-white/10" />{Object.entries(STATUS_CONTEUDO).map(([id, rotulo]) => <div key={id} className="flex items-center justify-between text-[10px]"><span className="text-white/55">{rotulo}</span><span className={`size-2 rounded-full ${id === "publicado" ? "bg-emerald-400" : id === "agendado" ? "bg-violet-400" : id === "revisao" ? "bg-amber-400" : "bg-zinc-500"}`} /></div>)}</div><p className="mt-6 text-[9px] leading-4 text-white/35">Agenda demonstrativa. Nenhuma publicação externa é programada.</p></article>
    </section>
  </div>
);
