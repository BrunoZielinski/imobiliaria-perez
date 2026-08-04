"use client";

import { useMemo, useState } from "react";
import { Building2, Mail, Phone, Search, UserRound } from "lucide-react";
import { PESSOAS_PEREZ } from "@/lib/perez360/dados";
import type { PapelPessoa } from "@/lib/perez360/tipos";

const ROTULOS: Record<PapelPessoa, string> = { lead: "Lead", cliente: "Cliente", proprietario: "Proprietário", locatario: "Locatário" };

export const ListaContatos = () => {
  const [busca, setBusca] = useState("");
  const [papel, setPapel] = useState<PapelPessoa | "todos">("todos");
  const contatos = useMemo(() => PESSOAS_PEREZ.filter((pessoa) => (papel === "todos" || pessoa.papeis.includes(papel)) && (!busca.trim() || `${pessoa.nome} ${pessoa.email} ${pessoa.telefone}`.toLocaleLowerCase("pt-BR").includes(busca.toLocaleLowerCase("pt-BR")))), [busca, papel]);

  return <div><div className="flex flex-col gap-3 rounded-2xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-muted px-3 py-2.5"><Search className="size-4 text-muted-foreground" /><span className="sr-only">Buscar pessoas</span><input value={busca} onChange={(evento) => setBusca(evento.target.value)} placeholder="Buscar nome, telefone ou e-mail" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label><div className="scrollbar-hide flex gap-1 overflow-x-auto">{(["todos", "lead", "cliente", "proprietario", "locatario"] as const).map((item) => <button key={item} type="button" onClick={() => setPapel(item)} className={papel === item ? "shrink-0 rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground" : "shrink-0 rounded-full px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"}>{item === "todos" ? "Todos" : ROTULOS[item]}</button>)}</div></div><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{contatos.map((pessoa) => <article key={pessoa.id} className="rounded-2xl border bg-background p-5 shadow-xs"><div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><UserRound className="size-5" /></span><div className="min-w-0"><h2 className="truncate font-bold">{pessoa.nome}</h2><div className="mt-2 flex flex-wrap gap-1">{pessoa.papeis.map((item) => <span key={item} className="rounded-full bg-muted px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{ROTULOS[item]}</span>)}</div></div></div><div className="mt-5 grid gap-2 text-xs text-muted-foreground"><span className="flex items-center gap-2"><Phone className="size-3.5" /> {pessoa.telefone}</span><span className="flex items-center gap-2 truncate"><Mail className="size-3.5" /> {pessoa.email}</span><span className="flex items-center gap-2"><Building2 className="size-3.5" /> {pessoa.imoveisIds.length} imóveis vinculados</span></div></article>)}</div></div>;
};
