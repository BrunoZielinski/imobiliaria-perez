"use client";

import { format } from "date-fns";
import { CheckCheck, ChevronLeft, MoreVertical, Paperclip, Send, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mensagem } from "@/lib/tipos";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const SUGESTOES = [
  "Olá",
  "Tivemos um imprevisto de saúde na família e não conseguimos pagar o aluguel no vencimento. Gostaria de solicitar a revisão da multa, se possível.",
];

type Props = {
  mensagens: Mensagem[];
  rascunho: string;
  iniciada: boolean;
  enviando: boolean;
  aoAlterarRascunho: (texto: string) => void;
  aoEnviar: () => void;
};

export const CelularCliente = ({
  mensagens,
  rascunho,
  iniciada,
  enviando,
  aoAlterarRascunho,
  aoEnviar,
}: Props) => (
  <section className="flex min-h-0 flex-col">
    <div className="mb-3 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
          Visão do cliente
        </p>
        <h2 className="text-lg font-bold">WhatsApp no celular</h2>
      </div>
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
        Cliente real-time
      </span>
    </div>

    <div className="mx-auto flex min-h-0 w-full max-w-[390px] flex-1 flex-col overflow-hidden rounded-[2.25rem] border-[7px] border-[#202124] bg-[#111] shadow-2xl shadow-black/20">
      <div className="relative flex h-7 shrink-0 items-center justify-between bg-[#f6f6f6] px-5 text-[9px] font-bold text-[#111]">
        <span>10:00</span>
        <span className="absolute left-1/2 top-1 h-4 w-24 -translate-x-1/2 rounded-full bg-[#111]" />
        <span>5G · 100%</span>
      </div>

      <header className="flex h-16 shrink-0 items-center gap-2 bg-[#075e54] px-3 text-white">
        <ChevronLeft className="size-5" />
        <span className="flex size-9 items-center justify-center rounded-full bg-white text-sm font-black text-primary">
          P
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold">Imobiliária Perez</p>
          <p className="text-[9px] text-white/75">conta comercial</p>
        </div>
        <Video className="size-4" />
        <MoreVertical className="size-4" />
      </header>

      <div
        className="min-h-0 flex-1 bg-[#efeae2]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(17, 94, 89, 0.035) 0 1.5px, transparent 1.5px), radial-gradient(circle at 80% 55%, rgba(17, 94, 89, 0.03) 0 1px, transparent 1px)",
          backgroundSize: "34px 34px, 28px 28px",
        }}
      >
        <ScrollArea className="h-full">
          <div className="flex min-h-full flex-col justify-end gap-2 px-3 py-4">
            {!iniciada && (
              <div className="m-auto max-w-60 rounded-xl bg-[#fff5c4] px-3 py-2 text-center text-[10px] leading-relaxed text-[#5f5b45] shadow-sm">
                Clique em “Iniciar simulação” para abrir uma conversa como cliente.
              </div>
            )}

            {iniciada && (
              <div className="mx-auto mb-1 rounded-lg bg-[#fff5c4] px-3 py-1.5 text-center text-[9px] leading-relaxed text-[#5f5b45] shadow-sm">
                Esta é uma demonstração. Nenhuma mensagem real será enviada.
              </div>
            )}

            {mensagens.map((mensagem) => {
              const doCliente = mensagem.autor === "contato";
              return (
                <div
                  key={mensagem.id}
                  className={cn("flex", doCliente ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "relative max-w-[86%] rounded-lg px-2.5 pb-1.5 pt-2 text-[11px] leading-relaxed shadow-sm",
                      doCliente
                        ? "rounded-tr-sm bg-[#d9fdd3] pr-2"
                        : "rounded-tl-sm bg-white",
                    )}
                  >
                    {mensagem.autor === "ana" && (
                      <p className="mb-0.5 text-[9px] font-bold text-primary">Ana · Assistente</p>
                    )}
                    <span className="whitespace-pre-wrap">{mensagem.texto}</span>
                    <span className="ml-2 inline-flex translate-y-0.5 items-center gap-0.5 text-[8px] text-[#667781]">
                      {format(new Date(mensagem.em), "HH:mm")}
                      {doCliente && <CheckCheck className="size-3 text-[#53bdeb]" />}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="shrink-0 bg-[#f0f2f5] px-2 pb-3 pt-2">
        {iniciada && mensagens.length < 3 && (
          <div className="mb-2 flex gap-1.5 overflow-x-auto">
            {SUGESTOES.map((sugestao) => (
              <button
                key={sugestao}
                type="button"
                onClick={() => aoAlterarRascunho(sugestao)}
                className="max-w-44 shrink-0 truncate rounded-full border border-[#cbd6d2] bg-white px-2.5 py-1 text-[9px] text-[#075e54]"
              >
                {sugestao}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-1.5">
          <div className="flex min-h-10 flex-1 items-end rounded-2xl bg-white px-2">
            <Paperclip className="mb-3 size-3.5 shrink-0 rotate-[-35deg] text-[#667781]" />
            <Textarea
              value={rascunho}
              disabled={!iniciada || enviando}
              onChange={(evento) => aoAlterarRascunho(evento.target.value)}
              onKeyDown={(evento) => {
                if (evento.key === "Enter" && !evento.shiftKey) {
                  evento.preventDefault();
                  aoEnviar();
                }
              }}
              placeholder="Mensagem"
              className="max-h-24 min-h-10 resize-none border-0 bg-transparent px-2 py-2.5 text-[11px] shadow-none focus-visible:ring-0"
            />
          </div>
          <Button
            type="button"
            disabled={!iniciada || !rascunho.trim() || enviando}
            onClick={aoEnviar}
            aria-label="Enviar como cliente"
            className="size-10 rounded-full bg-[#00a884] p-0 hover:bg-[#008f70]"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);
