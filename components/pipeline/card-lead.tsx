"use client";

import { differenceInDays } from "date-fns";
import { useCrm } from "@/lib/store/crm-store";
import { Card } from "@/components/ui/card";
import { BadgeCanal } from "@/components/crm/badge-canal";
import type { Lead } from "@/lib/tipos";

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const CardLead = ({ lead }: { lead: Lead }) => {
  const dados = useCrm((s) => s.dados);
  const contato = dados.contatos.find((c) => c.id === lead.contatoId);
  const imovel = dados.imoveis.find((i) => i.id === lead.imovelId);
  const responsavel = dados.atendentes.find((a) => a.id === lead.responsavelId);
  const conversa = dados.conversas.find((c) => c.id === lead.conversaId);
  const dias = differenceInDays(new Date(), new Date(lead.atualizadoEm));

  return (
    <Card
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", lead.id)}
      className="cursor-grab gap-2 rounded-xl border-0 p-3 shadow-sm ring-1 ring-foreground/8 transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">{contato?.nome}</p>
        {conversa && <BadgeCanal canal={conversa.canal} />}
      </div>
      {imovel && (
        <p className="text-xs text-muted-foreground">
          {imovel.codigo} · {imovel.bairro}
        </p>
      )}
      {lead.valor > 0 && <p className="text-sm font-semibold">{moeda(lead.valor)}</p>}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{responsavel?.nome ?? "Sem responsável"}</span>
        <span>{dias === 0 ? "hoje" : `${dias}d`}</span>
      </div>
    </Card>
  );
};
