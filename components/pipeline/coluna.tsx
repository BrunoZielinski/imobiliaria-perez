"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { moverLead } from "@/lib/data";
import { CardLead } from "./card-lead";
import type { Etapa, Lead } from "@/lib/tipos";

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const Coluna = ({ etapa, leads }: { etapa: Etapa; leads: Lead[] }) => {
  const [sobre, setSobre] = useState(false);
  const total = leads.reduce((soma, lead) => soma + lead.valor, 0);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setSobre(true);
      }}
      onDragLeave={() => setSobre(false)}
      onDrop={(e) => {
        e.preventDefault();
        setSobre(false);
        const leadId = e.dataTransfer.getData("text/plain");
        if (leadId) moverLead(leadId, etapa.id, new Date());
      }}
      className={cn(
        "flex w-[18rem] shrink-0 flex-col rounded-xl border bg-background shadow-xs transition-colors",
        sobre && "border-primary bg-primary/5"
      )}
    >
      <div className="border-b px-3.5 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{etapa.nome}</p>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {leads.length}
          </span>
        </div>
        {total > 0 && <p className="text-[11px] text-muted-foreground">{moeda(total)}</p>}
      </div>
      <div className="flex min-h-24 flex-col gap-2 overflow-y-auto p-2">
        {leads.map((lead) => (
          <CardLead key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
};
