"use client";

import { Sparkles } from "lucide-react";
import { useCrm } from "@/lib/store/crm-store";
import { moverLead, posicaoNaFila } from "@/lib/data";
import { buscarPipeline } from "@/lib/mock/pipelines";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DEPARTAMENTOS } from "@/lib/tipos";

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const FichaLead = ({ conversaId }: { conversaId: string | null }) => {
  const dados = useCrm((s) => s.dados);
  const conversa = dados.conversas.find((c) => c.id === conversaId);
  const lead = dados.leads.find((l) => l.conversaId === conversaId);
  const imovel = dados.imoveis.find((i) => i.id === lead?.imovelId);
  const responsavel = dados.atendentes.find((a) => a.id === conversa?.atendenteId);

  if (!conversa) return null;

  const pipeline = lead ? buscarPipeline(lead.pipeline) : null;
  const posicao = posicaoNaFila(dados, conversa.id);

  return (
    <div className="flex flex-col gap-5 overflow-y-auto px-5 pb-6">
      <div>
        <p className="text-xs font-medium text-muted-foreground">Departamento</p>
        <p className="text-sm">
          {conversa.departamento ? DEPARTAMENTOS[conversa.departamento] : "Em triagem"}
        </p>
      </div>

      {conversa.status === "fila" && <Badge variant="outline">Posição {posicao} na fila</Badge>}

      {responsavel && (
        <div>
          <p className="text-xs font-medium text-muted-foreground">Responsável</p>
          <p className="text-sm">{responsavel.nome}</p>
        </div>
      )}

      {conversa.contextoAna && (
        <div className="rounded-md border border-dashed bg-muted/40 p-2">
          <p className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
            <Sparkles className="size-3" /> Captado pela Ana
          </p>
          <p className="mt-1 text-xs">{conversa.contextoAna}</p>
        </div>
      )}

      <Separator />

      {lead && pipeline ? (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Pipeline</p>
            <p className="text-sm">{pipeline.nome}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Etapa</p>
            <Select
              items={Object.fromEntries(pipeline.etapas.map((e) => [e.id, e.nome]))}
              value={lead.etapaId}
              onValueChange={(v) => moverLead(lead.id, v as string, new Date())}
            >
              <SelectTrigger size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pipeline.etapas.map((etapa) => (
                  <SelectItem key={etapa.id} value={etapa.id}>
                    {etapa.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {lead.valor > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Valor</p>
              <p className="text-sm font-semibold">{moeda(lead.valor)}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Sem negociação vinculada.</p>
      )}

      {imovel && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Imóvel</p>
            <p className="text-sm font-medium">{imovel.codigo}</p>
            <p className="text-xs text-muted-foreground">
              {imovel.tipo === "casa" ? "Casa" : "Apartamento"} · {imovel.bairro}
            </p>
            <p className="text-xs">{moeda(imovel.valor)}</p>
          </div>
        </>
      )}
    </div>
  );
};
