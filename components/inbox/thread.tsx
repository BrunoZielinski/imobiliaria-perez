"use client";

import { useState } from "react";
import { ChevronRight, ListChecks, Paperclip, Phone, Send, Sparkles } from "lucide-react";
import { useCrm } from "@/lib/store/crm-store";
import { enviarMensagem, assumirConversa } from "@/lib/data";
import { FichaLead } from "@/components/inbox/ficha-lead";
import { BadgeCanal } from "@/components/crm/badge-canal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DEPARTAMENTOS } from "@/lib/tipos";
import { rotuloModoTriagem } from "@/lib/inbox/apresentacao";
import { MensagemHistorica } from "@/components/inbox/mensagem-historica";
import { Badge } from "@/components/ui/badge";

export const Thread = ({ conversaId }: { conversaId: string | null }) => {
  const [rascunho, setRascunho] = useState("");
  const dados = useCrm((s) => s.dados);
  const usuarioId = useCrm((s) => s.usuarioId);

  const conversa = dados.conversas.find((c) => c.id === conversaId);
  const contato = dados.contatos.find((c) => c.id === conversa?.contatoId);
  const mensagens = dados.mensagens.filter((m) => m.conversaId === conversaId);
  const responsavel = dados.atendentes.find((a) => a.id === conversa?.atendenteId);

  if (!conversa) {
    return (
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Nenhuma conversa selecionada</EmptyTitle>
            <EmptyDescription>Escolha uma conversa na lista ao lado.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const submeter = async () => {
    if (!rascunho.trim()) return;
    await enviarMensagem(conversa.id, rascunho.trim(), new Date());
    setRascunho("");
  };

  const rotuloModo = rotuloModoTriagem(conversa.modoTriagem);
  const contexto = {
    ana: {
      titulo: "Contexto organizado pela Ana",
      Icone: Sparkles,
      classe: "border-violet-200 bg-violet-50/60 text-violet-700",
    },
    manual: {
      titulo: "Contexto informado pelo cliente",
      Icone: ListChecks,
      classe: "border-sky-200 bg-sky-50/60 text-sky-700",
    },
    direto: {
      titulo: "Contexto do atendimento",
      Icone: ListChecks,
      classe: "border-slate-200 bg-slate-50 text-slate-700",
    },
  }[conversa.modoTriagem];

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#fafafa]">
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b bg-background px-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {contato?.nome
              .split(" ")
              .slice(0, 2)
              .map((nome) => nome[0])
              .join("")}
          </span>
          <div>
            <p className="text-sm font-bold">{contato?.nome}</p>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
              <BadgeCanal canal={conversa.canal} />
              {rotuloModo && (
                <Badge
                  variant="outline"
                  className={
                    conversa.modoTriagem === "ana"
                      ? "h-5 border-violet-200 bg-violet-50 text-[9px] text-violet-700"
                      : "h-5 border-sky-200 bg-sky-50 text-[9px] text-sky-700"
                  }
                >
                  {rotuloModo}
                </Badge>
              )}
              <span>{contato?.telefone}</span>
              {conversa.departamento && (
                <>
                  <span>•</span>
                  <span>{DEPARTAMENTOS[conversa.departamento]}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {responsavel && (
            <div className="mr-2 hidden text-right lg:block">
              <p className="text-[10px] text-muted-foreground">Responsável</p>
              <p className="text-xs font-semibold">{responsavel.nome}</p>
            </div>
          )}
          <Button variant="outline" size="icon-sm" aria-label="Ligar para o cliente">
            <Phone className="size-3.5" />
          </Button>
          {conversa.status === "fila" && (
            <Button size="sm" onClick={() => assumirConversa(conversa.id, usuarioId, new Date())}>
              Assumir atendimento
            </Button>
          )}
          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="sm" />}>
              Ver cliente
              <ChevronRight className="size-3.5" />
            </SheetTrigger>
            <SheetContent className="w-[26rem] sm:max-w-[26rem]">
              <SheetHeader className="border-b px-5 py-5">
                <SheetTitle>{contato?.nome}</SheetTitle>
                <SheetDescription>
                  Contexto do atendimento, negociação e imóvel relacionado.
                </SheetDescription>
              </SheetHeader>
              <FichaLead conversaId={conversa.id} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-6">
          {conversa.contextoAna && (
            <div className={`mb-2 rounded-2xl border p-4 ${contexto.classe}`}>
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <span className="flex size-6 items-center justify-center rounded-full bg-white/70">
                  <contexto.Icone className="size-3.5" />
                </span>
                {contexto.titulo}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-foreground/75">
                {conversa.contextoAna}
              </p>
            </div>
          )}
          {mensagens.map((mensagem) => (
            <MensagemHistorica key={mensagem.id} mensagem={mensagem} />
          ))}
        </div>
      </ScrollArea>

      <div className="shrink-0 border-t bg-background p-3">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border bg-muted/25 p-1.5">
          <Button variant="ghost" size="icon-sm" aria-label="Anexar arquivo">
            <Paperclip className="size-4" />
          </Button>
          <Textarea
            value={rascunho}
            onChange={(e) => setRascunho(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submeter();
              }
            }}
            placeholder="Escreva uma mensagem para o cliente..."
            className="max-h-28 min-h-9 resize-none border-0 bg-transparent px-1 py-2 shadow-none focus-visible:ring-0"
          />
          <Button size="icon-sm" onClick={submeter} aria-label="Enviar mensagem">
            <Send className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
