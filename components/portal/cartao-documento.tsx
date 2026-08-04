"use client";

import { useState } from "react";
import { Check, Download, FileText } from "lucide-react";

export const CartaoDocumento = ({ nome, detalhe }: { nome: string; detalhe: string }) => { const [simulado, setSimulado] = useState(false); return <button type="button" onClick={() => setSimulado(true)} className="flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left transition hover:border-[#b52235]/30"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f6e7e9] text-[#b52235]"><FileText className="size-4" /></span><span className="min-w-0 flex-1"><b className="block truncate text-xs">{nome}</b><span className="text-[10px] text-zinc-400">{simulado ? "Documento demonstrativo" : detalhe}</span></span>{simulado ? <Check className="size-4 text-emerald-600" /> : <Download className="size-4 text-zinc-400" />}</button>; };
