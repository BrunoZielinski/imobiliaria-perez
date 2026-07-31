"use client";

import { format } from "date-fns";
import { Bot, CheckCircle2, Send, Sparkles, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Atendente, Conversa, Mensagem } from "@/lib/tipos";
import { DEPARTAMENTOS } from "@/lib/tipos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const ROTULO_STATUS = {
  ana: "Em triagem com a Ana",
  fila: "Aguardando distribuição",
  atendimento: "Atendimento humano",
  encerrada: "Encerrada",
};

type Props = {
  conversa?: Conversa;
  responsavel?: Atendente;
  mensagens: Mensagem[];
  resposta: string;
  enviando: boolean;
  aoAlterarResposta: (texto: string) => void;
  aoResponder: () => void;
};

export const CentralAoVivo = ({
  conversa,
  responsavel,
  mensagens,
  resposta,
  enviando,
  aoAlterarResposta,
  aoResponder,
}: Props) => (
  <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-background shadow-sm">
    <div className="border-b px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            Visão da empresa
          </p>
          <h2 className="mt-1 text-lg font-bold">Central Perez ao vivo</h2>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5",
            conversa?.status === "atendimento" &&
              "border-emerald-200 bg-emerald-50 text-emerald-700",
          )}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {conversa ? ROTULO_STATUS[conversa.status] : "Aguardando cliente"}
        </Badge>
      </div>
    </div>

    {!conversa ? (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Bot className="size-5" />
        </span>
        <p className="mt-4 text-sm font-bold">A central está pronta</p>
        <p className="mt-1 max-w-64 text-xs leading-relaxed text-muted-foreground">
          A primeira mensagem enviada no celular abrirá automaticamente um atendimento.
        </p>
      </div>
    ) : (
      <>
        <div className="grid grid-cols-2 gap-2 border-b p-4">
          <div className="rounded-xl bg-muted/45 p-3">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
              Departamento
            </p>
            <p className="mt-1 text-xs font-bold">
              {conversa.departamento ? DEPARTAMENTOS[conversa.departamento] : "Em identificação"}
            </p>
          </div>
          <div className="rounded-xl bg-muted/45 p-3">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
              Responsável
            </p>
            <p className="mt-1 text-xs font-bold">{responsavel?.nome ?? "Ainda não atribuído"}</p>
          </div>
        </div>

        {conversa.contextoAna && (
          <div className="border-b p-4">
            <div className="rounded-xl border border-primary/15 bg-primary/[0.035] p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                <Sparkles className="size-3.5" />
                Contexto organizado pela Ana
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/70">
                {conversa.contextoAna}
              </p>
            </div>
          </div>
        )}

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-3 p-4">
            {mensagens.map((mensagem) => (
              <div key={mensagem.id} className="flex gap-2.5">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg",
                    mensagem.autor === "contato" && "bg-emerald-50 text-emerald-700",
                    mensagem.autor === "ana" && "bg-primary/10 text-primary",
                    mensagem.autor === "atendente" && "bg-slate-100 text-slate-700",
                  )}
                >
                  {mensagem.autor === "contato" ? (
                    <UserRound className="size-3.5" />
                  ) : mensagem.autor === "ana" ? (
                    <Bot className="size-3.5" />
                  ) : (
                    <CheckCircle2 className="size-3.5" />
                  )}
                </span>
                <div className="min-w-0 flex-1 rounded-xl bg-muted/40 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[9px] font-bold">
                      {mensagem.autor === "contato"
                        ? "Cliente"
                        : mensagem.autor === "ana"
                          ? "Ana"
                          : responsavel?.nome ?? "Atendente"}
                    </p>
                    <span className="text-[8px] text-muted-foreground">
                      {format(new Date(mensagem.em), "HH:mm")}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-[10px] leading-relaxed text-foreground/70">
                    {mensagem.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-3">
          <p className="mb-2 text-[9px] font-semibold text-muted-foreground">
            {responsavel
              ? `Responder como ${responsavel.nome}`
              : "A resposta humana será liberada após a distribuição"}
          </p>
          <div className="flex items-end gap-2 rounded-xl border bg-muted/25 p-1.5">
            <Textarea
              value={resposta}
              disabled={!responsavel || enviando}
              onChange={(evento) => aoAlterarResposta(evento.target.value)}
              onKeyDown={(evento) => {
                if (evento.key === "Enter" && !evento.shiftKey) {
                  evento.preventDefault();
                  aoResponder();
                }
              }}
              placeholder="Digite a resposta do atendente..."
              className="max-h-24 min-h-9 resize-none border-0 bg-transparent px-2 py-2 text-[11px] shadow-none focus-visible:ring-0"
            />
            <Button
              type="button"
              size="icon-sm"
              disabled={!responsavel || !resposta.trim() || enviando}
              onClick={aoResponder}
              aria-label="Responder como atendente"
            >
              <Send className="size-3.5" />
            </Button>
          </div>
        </div>
      </>
    )}
  </section>
);
