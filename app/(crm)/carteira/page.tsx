"use client";

import { useState } from "react";
import { Building2, Home, KeyRound, MapPin, Search, Tag } from "lucide-react";
import { useCrm } from "@/lib/store/crm-store";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

const CarteiraPage = () => {
  const [busca, setBusca] = useState("");
  const dados = useCrm((s) => s.dados);
  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  const imoveis = dados.imoveis.filter(
    (imovel) =>
      !termo ||
      imovel.codigo.toLocaleLowerCase("pt-BR").includes(termo) ||
      imovel.bairro.toLocaleLowerCase("pt-BR").includes(termo),
  );
  const venda = dados.imoveis.filter((imovel) => imovel.finalidade === "venda").length;
  const locacao = dados.imoveis.length - venda;
  const oportunidades = dados.leads.filter((lead) => lead.imovelId).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              Portfólio integrado
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Carteira de imóveis</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Imóveis conectados às conversas e oportunidades comerciais.
            </p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Buscar código ou bairro"
              className="bg-background pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border bg-background p-4 shadow-xs">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </span>
            <p className="mt-3 text-2xl font-bold">{dados.imoveis.length}</p>
            <p className="text-xs text-muted-foreground">imóveis na carteira</p>
          </div>
          <div className="rounded-2xl border bg-background p-4 shadow-xs">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Home className="size-4" />
            </span>
            <p className="mt-3 text-2xl font-bold">
              {venda} <span className="text-sm font-medium text-muted-foreground">/ {locacao}</span>
            </p>
            <p className="text-xs text-muted-foreground">venda / locação</p>
          </div>
          <div className="rounded-2xl border bg-background p-4 shadow-xs">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Tag className="size-4" />
            </span>
            <p className="mt-3 text-2xl font-bold">{oportunidades}</p>
            <p className="text-xs text-muted-foreground">oportunidades vinculadas</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-background shadow-xs">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <p className="text-sm font-bold">Imóveis disponíveis</p>
              <p className="text-[11px] text-muted-foreground">
                Dados centrais para o atendimento comercial
              </p>
            </div>
            <Badge variant="outline">{imoveis.length} resultados</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Finalidade</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Oportunidades</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imoveis.map((imovel) => {
                const vinculadas = dados.leads.filter((lead) => lead.imovelId === imovel.id).length;
                return (
                  <TableRow key={imovel.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          {imovel.tipo === "casa" ? (
                            <Home className="size-4" />
                          ) : (
                            <Building2 className="size-4" />
                          )}
                        </span>
                        <div>
                          <p className="font-semibold">{imovel.codigo}</p>
                          <p className="text-[11px] capitalize text-muted-foreground">
                            {imovel.tipo}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        {imovel.bairro}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          imovel.finalidade === "locacao"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-primary/20 bg-primary/5 text-primary"
                        }
                      >
                        {imovel.finalidade === "locacao" ? (
                          <KeyRound className="size-3" />
                        ) : (
                          <Tag className="size-3" />
                        )}
                        {imovel.finalidade === "locacao" ? "Locação" : "Venda"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{moeda(imovel.valor)}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex min-w-7 justify-center rounded-full bg-muted px-2 py-1 text-xs font-semibold">
                        {vinculadas}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CarteiraPage;
