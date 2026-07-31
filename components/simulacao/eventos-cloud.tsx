"use client";

import { format } from "date-fns";
import { Check, CheckCheck, Cloud, Eye, Radio, Send } from "lucide-react";
import type { EventoCloud, TipoEventoCloud } from "@/lib/simulador/cloud-api";
import { ScrollArea } from "@/components/ui/scroll-area";

const ICONES: Record<TipoEventoCloud, typeof Cloud> = {
  "webhook.received": Radio,
  "webhook.acknowledged": Check,
  "message.accepted": Cloud,
  "message.sent": Send,
  "message.delivered": CheckCheck,
  "message.read": Eye,
};

const METODO: Record<TipoEventoCloud, string> = {
  "webhook.received": "WEBHOOK",
  "webhook.acknowledged": "200 OK",
  "message.accepted": "POST /messages",
  "message.sent": "sent",
  "message.delivered": "delivered",
  "message.read": "read",
};

export const EventosCloud = ({ eventos }: { eventos: EventoCloud[] }) => (
  <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-[#111827] text-white shadow-sm">
    <div className="border-b border-white/10 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
            WhatsApp Cloud API
          </p>
          <h2 className="mt-1 text-sm font-bold">Eventos em tempo real</h2>
        </div>
        <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-1 text-[8px] font-bold tracking-[0.12em] text-amber-300">
          SIMULAÇÃO
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2">
        <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" />
        <div>
          <p className="text-[9px] font-semibold">Webhook conectado</p>
          <p className="text-[8px] text-white/45">Janela do cliente aberta · 24h</p>
        </div>
      </div>
    </div>

    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-0 p-4">
        {eventos.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/15 p-4 text-center">
            <Cloud className="mx-auto size-5 text-white/30" />
            <p className="mt-2 text-[10px] font-semibold text-white/70">Aguardando mensagem</p>
            <p className="mt-1 text-[9px] leading-relaxed text-white/40">
              Webhooks e confirmações aparecerão aqui quando o cliente enviar.
            </p>
          </div>
        )}

        {eventos.map((evento, indice) => {
          const Icone = ICONES[evento.tipo];
          return (
            <div key={evento.id} className="relative flex gap-3 pb-4 last:pb-0">
              {indice < eventos.length - 1 && (
                <span className="absolute bottom-0 left-[13px] top-7 w-px bg-white/10" />
              )}
              <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
                <Icone className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[8px] font-bold text-emerald-300">
                    {METODO[evento.tipo]}
                  </span>
                  <span className="text-[8px] text-white/35">
                    {format(new Date(evento.em), "HH:mm:ss")}
                  </span>
                </div>
                <p className="mt-1.5 text-[10px] font-semibold">{evento.rotulo}</p>
                <p className="mt-0.5 line-clamp-3 font-mono text-[8px] leading-relaxed text-white/45">
                  {evento.detalhe}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  </section>
);
