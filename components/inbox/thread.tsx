"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCrm } from "@/lib/store/crm-store";
import { enviarMensagem, assumirConversa } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export const Thread = ({ conversaId }: { conversaId: string | null }) => {
  const [rascunho, setRascunho] = useState("");
  const dados = useCrm((s) => s.dados);
  const usuarioId = useCrm((s) => s.usuarioId);

  const conversa = dados.conversas.find((c) => c.id === conversaId);
  const contato = dados.contatos.find((c) => c.id === conversa?.contatoId);
  const mensagens = dados.mensagens.filter((m) => m.conversaId === conversaId);

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

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div>
          <p className="text-sm font-semibold">{contato?.nome}</p>
          <p className="text-xs text-muted-foreground">{contato?.telefone}</p>
        </div>
        {conversa.status === "fila" && (
          <Button size="sm" onClick={() => assumirConversa(conversa.id, usuarioId, new Date())}>
            Assumir atendimento
          </Button>
        )}
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 p-4">
          {mensagens.map((mensagem) => {
            const doContato = mensagem.autor === "contato";
            const daAna = mensagem.autor === "ana";
            return (
              <div key={mensagem.id} className={cn("flex flex-col gap-1", !doContato && "items-end")}>
                {daAna && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                    <Sparkles className="size-3" /> Ana
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap",
                    doContato && "bg-muted",
                    daAna && "border border-dashed bg-muted/40 text-muted-foreground",
                    mensagem.autor === "atendente" && "bg-primary text-primary-foreground"
                  )}
                >
                  {mensagem.texto}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(mensagem.em), "dd/MM HH:mm")}
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex shrink-0 items-end gap-2 border-t p-3">
        <Textarea
          value={rascunho}
          onChange={(e) => setRascunho(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submeter();
            }
          }}
          placeholder="Escreva uma mensagem..."
          className="max-h-32 min-h-10 resize-none"
        />
        <Button size="icon" onClick={submeter}>
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};
