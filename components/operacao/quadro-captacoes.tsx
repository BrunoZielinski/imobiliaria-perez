"use client";

import { useState } from "react";
import { ArrowRight, Building2, UserRound } from "lucide-react";
import { CAPTACOES_PEREZ, IMOVEIS_PEREZ, PESSOAS_PEREZ } from "@/lib/perez360/dados";
import { agruparCaptacoes } from "@/lib/perez360/operacao";
import type { CaptacaoPerez } from "@/lib/perez360/tipos";

const ETAPAS: CaptacaoPerez["etapa"][] = ["avaliacao", "documentacao", "fotografia", "publicacao"];
const TITULOS: Record<CaptacaoPerez["etapa"], string> = { avaliacao: "Avaliação", documentacao: "Documentação", fotografia: "Fotografia", publicacao: "Publicação" };

export const QuadroCaptacoes = () => {
  const [captacoes, setCaptacoes] = useState(CAPTACOES_PEREZ);
  const grupos = agruparCaptacoes(captacoes);
  const avancar = (id: string) => setCaptacoes((atuais) => atuais.map((item) => { if (item.id !== id) return item; const indice = ETAPAS.indexOf(item.etapa); return { ...item, etapa: ETAPAS[Math.min(indice + 1, ETAPAS.length - 1)] }; }));

  return <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">{ETAPAS.map((etapa) => <section key={etapa} className="w-[18rem] shrink-0 rounded-2xl bg-muted/60 p-3"><div className="flex items-center justify-between px-1 pb-3"><h2 className="text-xs font-bold">{TITULOS[etapa]}</h2><span className="rounded-full bg-background px-2 py-1 text-[10px] font-bold text-muted-foreground">{grupos[etapa].length}</span></div><div className="grid gap-2">{grupos[etapa].map((captacao) => { const imovel = IMOVEIS_PEREZ.find((item) => item.id === captacao.imovelId)!; const proprietario = PESSOAS_PEREZ.find((item) => item.id === captacao.proprietarioId)!; return <article key={captacao.id} className="rounded-xl border bg-background p-4 shadow-xs"><p className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary">{imovel.codigo}</p><h3 className="mt-2 text-sm font-bold leading-5">{imovel.titulo}</h3><div className="mt-4 grid gap-2 text-[11px] text-muted-foreground"><span className="flex items-center gap-2"><UserRound className="size-3" /> {proprietario.nome}</span><span className="flex items-center gap-2"><Building2 className="size-3" /> {imovel.bairro}</span></div><div className="mt-4 rounded-lg bg-muted px-3 py-2"><p className="text-[9px] font-bold uppercase text-muted-foreground">Próxima ação</p><p className="mt-1 text-[11px] leading-4">{captacao.proximaAcao}</p></div><div className="mt-3 flex items-center justify-between text-[10px]"><span className="font-semibold text-muted-foreground">{captacao.responsavel}</span>{etapa !== "publicacao" && <button type="button" onClick={() => avancar(captacao.id)} className="inline-flex items-center gap-1 font-bold text-primary">Avançar <ArrowRight className="size-3" /></button>}</div></article>; })}</div></section>)}</div>;
};
