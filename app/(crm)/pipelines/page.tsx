"use client";

import { useState } from "react";
import { useCrm } from "@/lib/store/crm-store";
import { PIPELINES, buscarPipeline } from "@/lib/mock/pipelines";
import { Coluna } from "@/components/pipeline/coluna";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PipelineId } from "@/lib/tipos";

const PipelinesPage = () => {
  const [ativo, setAtivo] = useState<PipelineId>("venda");
  const leads = useCrm((s) => s.dados.leads);
  const pipeline = buscarPipeline(ativo);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-background shadow-sm">
      <div className="flex shrink-0 items-end justify-between border-b px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            Gestão comercial
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight">CRM de oportunidades</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Acompanhe cada lead desde o primeiro contato até o fechamento.
          </p>
        </div>
        <Tabs value={ativo} onValueChange={(v) => setAtivo(v as PipelineId)}>
          <TabsList className="bg-muted/70">
            {PIPELINES.map((p) => (
              <TabsTrigger key={p.id} value={p.id}>
                {p.nome}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto bg-[#fafafa] p-4">
        {pipeline.etapas.map((etapa) => (
          <Coluna
            key={etapa.id}
            etapa={etapa}
            leads={leads.filter((lead) => lead.pipeline === ativo && lead.etapaId === etapa.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PipelinesPage;
