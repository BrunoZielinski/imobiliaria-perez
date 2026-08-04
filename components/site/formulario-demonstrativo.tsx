"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const FormularioDemonstrativo = ({ titulo, apoio, acao = "Simular envio" }: { titulo: string; apoio: string; acao?: string }) => {
  const [enviado, setEnviado] = useState(false);
  const enviar = (evento: FormEvent<HTMLFormElement>) => { evento.preventDefault(); setEnviado(true); };

  if (enviado) return <div className="rounded-[1.35rem] border border-emerald-200 bg-emerald-50 p-7 text-center"><CheckCircle2 className="mx-auto size-9 text-emerald-600" /><h2 className="mt-4 text-xl font-black">Solicitação simulada com sucesso</h2><p className="mt-2 text-sm text-emerald-800/70">Nenhuma informação foi transmitida. Este é um exemplo visual da experiência futura.</p><button type="button" onClick={() => setEnviado(false)} className="mt-5 text-xs font-bold text-emerald-800 underline underline-offset-4">Preencher novamente</button></div>;

  return <form onSubmit={enviar} className="rounded-[1.5rem] border bg-white p-6 shadow-[0_18px_55px_rgba(24,24,27,.08)] sm:p-8"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#b52235]">Demonstração</p><h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">{titulo}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{apoio}</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-xs font-bold">Nome<input required className="h-11 rounded-xl border px-3 text-sm outline-none focus:border-[#b52235]" /></label><label className="grid gap-1.5 text-xs font-bold">WhatsApp<input required inputMode="tel" className="h-11 rounded-xl border px-3 text-sm outline-none focus:border-[#b52235]" /></label><label className="grid gap-1.5 text-xs font-bold sm:col-span-2">E-mail<input required type="email" className="h-11 rounded-xl border px-3 text-sm outline-none focus:border-[#b52235]" /></label><label className="grid gap-1.5 text-xs font-bold sm:col-span-2">Como podemos ajudar?<textarea required className="min-h-28 resize-none rounded-xl border p-3 text-sm outline-none focus:border-[#b52235]" /></label></div><button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b52235] px-5 py-3 text-sm font-bold text-white">{acao} <ArrowRight className="size-4" /></button><p className="mt-4 text-center text-[0.65rem] text-zinc-400">Nenhum dado será enviado nesta apresentação.</p></form>;
};
