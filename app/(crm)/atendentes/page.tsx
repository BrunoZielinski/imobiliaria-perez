"use client";

import { useCrm } from "@/lib/store/crm-store";
import { alternarDisponibilidade, cargaPorAtendente } from "@/lib/data";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEPARTAMENTOS, TETO_ATENDIMENTOS } from "@/lib/tipos";
import type { Departamento } from "@/lib/tipos";

const ROTULO_PAPEL = {
  atendente: "Atendente",
  supervisor: "Supervisor",
  administrador: "Administrador",
};

const AtendentesPage = () => {
  const dados = useCrm((s) => s.dados);
  const carga = cargaPorAtendente(dados);

  const filaPorDepartamento = (departamento: Departamento) =>
    dados.conversas.filter((c) => c.status === "fila" && c.departamento === departamento).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 p-3 sm:p-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          Distribuição inteligente
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Equipe</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Disponibilidade, capacidade e filas por departamento em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(Object.keys(DEPARTAMENTOS) as Departamento[]).map((departamento) => (
          <div key={departamento} className="rounded-2xl border bg-background p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground">{DEPARTAMENTOS[departamento]}</p>
            <p className="mt-2 text-2xl font-bold">{filaPorDepartamento(departamento)}</p>
            <p className="text-xs text-muted-foreground">aguardando na fila</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-background shadow-xs">
        <div className="border-b px-5 py-4">
          <p className="text-sm font-bold">Operação da equipe</p>
          <p className="text-[11px] text-muted-foreground">
            O rodízio respeita disponibilidade, departamento e limite de atendimentos.
          </p>
        </div>
        <div className="grid gap-2 p-3 md:hidden">{dados.atendentes.map((atendente) => <article key={atendente.id} className="rounded-xl border p-3"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{atendente.nome.split(" ").slice(0, 2).map((nome) => nome[0]).join("")}</span><span className="min-w-0 flex-1"><b className="block truncate text-xs">{atendente.nome}</b><span className="text-[10px] text-muted-foreground">{ROTULO_PAPEL[atendente.papel]} · {carga[atendente.id] ?? 0}/{TETO_ATENDIMENTOS} atendimentos</span></span><Switch checked={atendente.disponivel} onCheckedChange={() => alternarDisponibilidade(atendente.id)} aria-label={`Disponibilidade de ${atendente.nome}`} /></div><div className="mt-3 flex flex-wrap gap-1">{atendente.departamentos.map((departamento) => <Badge key={departamento} variant="outline" className="text-[9px]">{DEPARTAMENTOS[departamento]}</Badge>)}</div></article>)}</div>
        <div className="hidden overflow-x-auto md:block"><Table>
        <TableHeader>
          <TableRow>
            <TableHead>Atendente</TableHead>
            <TableHead>Departamentos</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Ordem no rodízio</TableHead>
            <TableHead>Em atendimento</TableHead>
            <TableHead className="text-right">Disponível</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.atendentes.map((atendente) => (
            <TableRow key={atendente.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {atendente.nome
                      .split(" ")
                      .slice(0, 2)
                      .map((nome) => nome[0])
                      .join("")}
                  </span>
                  <span className="font-semibold">{atendente.nome}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {atendente.departamentos.map((departamento) => (
                    <Badge key={departamento} variant="outline" className="text-[10px]">
                      {DEPARTAMENTOS[departamento]}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{ROTULO_PAPEL[atendente.papel]}</TableCell>
              <TableCell>{atendente.ordem + 1}º</TableCell>
              <TableCell>
                {carga[atendente.id] ?? 0} / {TETO_ATENDIMENTOS}
              </TableCell>
              <TableCell className="text-right">
                <Switch
                  checked={atendente.disponivel}
                  onCheckedChange={() => alternarDisponibilidade(atendente.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></div>
      </div>
      </div>
    </div>
  );
};

export default AtendentesPage;
