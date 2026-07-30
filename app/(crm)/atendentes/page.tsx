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
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(DEPARTAMENTOS) as Departamento[]).map((departamento) => (
          <div key={departamento} className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">{DEPARTAMENTOS[departamento]}</p>
            <p className="text-2xl font-semibold">{filaPorDepartamento(departamento)}</p>
            <p className="text-xs text-muted-foreground">aguardando na fila</p>
          </div>
        ))}
      </div>

      <Table>
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
              <TableCell className="font-medium">{atendente.nome}</TableCell>
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
      </Table>
    </div>
  );
};

export default AtendentesPage;
