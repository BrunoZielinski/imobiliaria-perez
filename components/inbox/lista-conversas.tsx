"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ListChecks, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCrm } from "@/lib/store/crm-store";
import { conversasVisiveis } from "@/lib/data";
import { BadgeCanal } from "@/components/crm/badge-canal";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DEPARTAMENTOS } from "@/lib/tipos";
import type { Conversa, Departamento, StatusConversa } from "@/lib/tipos";
import {
  rotuloModoTriagem,
  separarExemplosTriagem,
} from "@/lib/inbox/apresentacao";

type Props = {
  selecionada: string | null;
  aoSelecionar: (id: string) => void;
  filtro: Departamento | "todos";
  aoFiltrar: (filtro: Departamento | "todos") => void;
  className?: string;
};

const ROTULO_STATUS: Record<StatusConversa, string> = {
  ana: "Com a Ana",
  fila: "Na fila",
  atendimento: "Em atendimento",
  encerrada: "Encerrada",
};

export const ListaConversas = ({ selecionada, aoSelecionar, filtro, aoFiltrar, className }: Props) => {
  const [busca, setBusca] = useState("");
  const dados = useCrm((s) => s.dados);
  const papel = useCrm((s) => s.papel);
  const usuarioId = useCrm((s) => s.usuarioId);

  const visiveis = conversasVisiveis(dados, papel, usuarioId)
    .filter((conversa) => filtro === "todos" || conversa.departamento === filtro)
    .filter((conversa) => {
      const contato = dados.contatos.find((c) => c.id === conversa.contatoId);
      const termo = busca.trim().toLocaleLowerCase("pt-BR");
      return !termo || contato?.nome.toLocaleLowerCase("pt-BR").includes(termo);
    });

  const { exemplos, operacionais } = separarExemplosTriagem(visiveis);
  operacionais.sort((a, b) => {
      if (a.naoLidas !== b.naoLidas) return b.naoLidas - a.naoLidas;
      if (a.status === "fila" && b.status !== "fila") return -1;
      if (b.status === "fila" && a.status !== "fila") return 1;
      return b.criadaEm.localeCompare(a.criadaEm);
    });

  const aguardando = conversasVisiveis(dados, papel, usuarioId).filter(
    (conversa) => conversa.status === "fila" || conversa.status === "ana",
  ).length;

  const renderizarConversa = (conversa: Conversa) => {
    const contato = dados.contatos.find((c) => c.id === conversa.contatoId);
    const ultima = dados.mensagens.filter((m) => m.conversaId === conversa.id).at(-1);
    const iniciais = contato?.nome
      .split(" ")
      .slice(0, 2)
      .map((nome) => nome[0])
      .join("");
    const rotuloModo = rotuloModoTriagem(conversa.modoTriagem);

    return (
      <button
        key={conversa.id}
        onClick={() => aoSelecionar(conversa.id)}
        className={cn(
          "relative flex w-full gap-3 border-b px-4 py-3.5 text-left transition-colors hover:bg-muted/50",
          selecionada === conversa.id && "bg-primary/[0.045]",
          selecionada === conversa.id &&
            "after:absolute after:inset-y-3 after:left-0 after:w-0.5 after:rounded-full after:bg-primary",
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
          {iniciais}
        </span>
        <span className="min-w-0 flex-1 space-y-1.5">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold">{contato?.nome}</span>
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(conversa.criadaEm), {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
          </span>
          <span className="block truncate text-xs text-muted-foreground">{ultima?.texto}</span>
          <span className="flex flex-wrap items-center gap-1.5">
            <BadgeCanal canal={conversa.canal} />
            {rotuloModo && (
              <Badge
                variant="outline"
                className={cn(
                  "h-5 gap-1 text-[9px]",
                  conversa.modoTriagem === "ana"
                    ? "border-violet-200 bg-violet-50 text-violet-700"
                    : "border-sky-200 bg-sky-50 text-sky-700",
                )}
              >
                {conversa.modoTriagem === "ana" ? (
                  <Sparkles className="size-2.5" />
                ) : (
                  <ListChecks className="size-2.5" />
                )}
                {rotuloModo}
              </Badge>
            )}
            <Badge
              variant={conversa.status === "fila" ? "default" : "outline"}
              className="h-5 text-[9px]"
            >
              {ROTULO_STATUS[conversa.status]}
            </Badge>
            {conversa.departamento && (
              <span className="truncate text-[9px] text-muted-foreground">
                {DEPARTAMENTOS[conversa.departamento]}
              </span>
            )}
            {conversa.naoLidas > 0 && (
              <span className="ml-auto flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {conversa.naoLidas}
              </span>
            )}
          </span>
        </span>
      </button>
    );
  };

  return (
    <div className={cn("h-full w-full shrink-0 flex-col border-r md:flex md:w-72 xl:w-[22rem]", className)}>
      <div className="space-y-4 border-b px-4 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Conversas</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {aguardando} aguardando direcionamento
            </p>
          </div>
          <Button variant="outline" size="icon-sm" aria-label="Filtros">
            <SlidersHorizontal className="size-3.5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar cliente"
            className="h-9 bg-muted/45 pl-9 text-xs"
          />
        </div>
        <Tabs value={filtro} onValueChange={(v) => aoFiltrar(v as Departamento | "todos")} className="overflow-x-auto">
          <TabsList className="h-8 min-w-max bg-muted/70">
            <TabsTrigger value="todos" className="text-xs">
              Todos
            </TabsTrigger>
            <TabsTrigger value="comercial" className="text-xs">
              Comercial
            </TabsTrigger>
            <TabsTrigger value="administrativo" className="text-xs">
              Admin
            </TabsTrigger>
            <TabsTrigger value="recepcao" className="text-xs">
              Recepção
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        {exemplos.length > 0 && (
          <>
            <div className="flex items-center gap-2 bg-violet-50/60 px-4 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700">
              <Sparkles className="size-3" />
              Exemplos de triagem
            </div>
            {exemplos.map(renderizarConversa)}
          </>
        )}
        <div className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Prioridade de atendimento
        </div>
        {operacionais.map(renderizarConversa)}
      </ScrollArea>
    </div>
  );
};
