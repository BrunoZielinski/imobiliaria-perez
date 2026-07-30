"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCrm } from "@/lib/store/crm-store";
import { conversasVisiveis } from "@/lib/data";
import { BadgeCanal } from "@/components/crm/badge-canal";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEPARTAMENTOS } from "@/lib/tipos";
import type { Departamento, StatusConversa } from "@/lib/tipos";

type Props = {
  selecionada: string | null;
  aoSelecionar: (id: string) => void;
  filtro: Departamento | "todos";
  aoFiltrar: (filtro: Departamento | "todos") => void;
};

const ROTULO_STATUS: Record<StatusConversa, string> = {
  ana: "Com a Ana",
  fila: "Na fila",
  atendimento: "Em atendimento",
  encerrada: "Encerrada",
};

export const ListaConversas = ({ selecionada, aoSelecionar, filtro, aoFiltrar }: Props) => {
  const dados = useCrm((s) => s.dados);
  const papel = useCrm((s) => s.papel);
  const usuarioId = useCrm((s) => s.usuarioId);

  const visiveis = conversasVisiveis(dados, papel, usuarioId)
    .filter((conversa) => filtro === "todos" || conversa.departamento === filtro)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));

  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-r">
      <div className="border-b p-2">
        <Tabs value={filtro} onValueChange={(v) => aoFiltrar(v as Departamento | "todos")}>
          <TabsList className="w-full">
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
        {visiveis.map((conversa) => {
          const contato = dados.contatos.find((c) => c.id === conversa.contatoId);
          const ultima = dados.mensagens.filter((m) => m.conversaId === conversa.id).at(-1);
          return (
            <button
              key={conversa.id}
              onClick={() => aoSelecionar(conversa.id)}
              className={cn(
                "flex w-full flex-col gap-1 border-b px-3 py-2.5 text-left transition-colors hover:bg-muted/60",
                selecionada === conversa.id && "bg-muted"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{contato?.nome}</span>
                {conversa.naoLidas > 0 && (
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {conversa.naoLidas}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">{ultima?.texto}</p>
              <div className="flex items-center gap-1.5">
                <BadgeCanal canal={conversa.canal} />
                <Badge variant="outline" className="text-[10px]">
                  {ROTULO_STATUS[conversa.status]}
                </Badge>
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(conversa.criadaEm), { locale: ptBR })}
                </span>
              </div>
              {conversa.departamento && (
                <span className="text-[10px] text-muted-foreground">
                  {DEPARTAMENTOS[conversa.departamento]}
                </span>
              )}
            </button>
          );
        })}
      </ScrollArea>
    </div>
  );
};
