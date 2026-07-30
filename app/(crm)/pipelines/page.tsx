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
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b p-3">
        <Tabs value={ativo} onValueChange={(v) => setAtivo(v as PipelineId)}>
          <TabsList>
            {PIPELINES.map((p) => (
              <TabsTrigger key={p.id} value={p.id}>
                {p.nome}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto p-3">
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
