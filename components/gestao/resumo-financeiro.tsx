import { ArrowDownToLine, ArrowUpFromLine, CircleAlert, CircleCheckBig } from "lucide-react";
import { formatarMoeda } from "@/lib/perez360/seletores";
import type { calcularResumoFinanceiro } from "@/lib/perez360/indicadores";

type Resumo = ReturnType<typeof calcularResumoFinanceiro>;

export const ResumoFinanceiro = ({ resumo }: { resumo: Resumo }) => {
  const itens = [{ rotulo: "Recebimentos previstos", valor: resumo.recebimentosPrevistos, icone: ArrowDownToLine, cor: "text-blue-600 bg-blue-50" }, { rotulo: "Repasses previstos", valor: resumo.repassesPrevistos, icone: ArrowUpFromLine, cor: "text-violet-600 bg-violet-50" }, { rotulo: "Pendências visuais", valor: resumo.pendencias, icone: CircleAlert, cor: "text-amber-600 bg-amber-50" }, { rotulo: "Recebido no exemplo", valor: resumo.realizado, icone: CircleCheckBig, cor: "text-emerald-600 bg-emerald-50" }];
  return <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{itens.map(({ rotulo, valor, icone: Icone, cor }) => <article key={rotulo} className="rounded-2xl border bg-background p-4 shadow-xs sm:p-5"><span className={`grid size-9 place-items-center rounded-xl ${cor}`}><Icone className="size-4" /></span><p className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">{formatarMoeda(valor)}</p><p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">{rotulo}</p></article>)}</div>;
};
