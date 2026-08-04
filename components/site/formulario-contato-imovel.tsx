"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import type { ImovelPerez } from "@/lib/perez360/tipos";

export const FormularioContatoImovel = ({ imovel }: { imovel: ImovelPerez }) => {
  const [enviado, setEnviado] = useState(false);

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="rounded-[1.35rem] border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="mx-auto size-9 text-emerald-600" /><h2 className="mt-4 text-lg font-black">Interesse registrado nesta demonstração</h2><p className="mt-2 text-sm leading-6 text-emerald-800/70">Nenhum dado foi enviado. Agora você pode mostrar como este contato chega à Central Perez.</p><Link href="/inbox" className="mt-5 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white">Ver como chega ao atendimento <ArrowRight className="size-4" /></Link>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="rounded-[1.35rem] border bg-white p-6 shadow-[0_18px_50px_rgba(24,24,27,.09)]">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#b52235]">Fale com um especialista</p><h2 className="mt-2 text-xl font-black tracking-[-0.035em]">Gostou deste imóvel?</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Receba mais informações sobre o {imovel.codigo}.</p>
      <div className="mt-6 grid gap-3"><label className="grid gap-1.5 text-xs font-bold">Nome<input required name="nome" className="h-11 rounded-xl border px-3 text-sm font-medium outline-none focus:border-[#b52235]" placeholder="Seu nome" /></label><label className="grid gap-1.5 text-xs font-bold">WhatsApp<input required name="telefone" inputMode="tel" className="h-11 rounded-xl border px-3 text-sm font-medium outline-none focus:border-[#b52235]" placeholder="(43) 99999-9999" /></label><label className="grid gap-1.5 text-xs font-bold">Mensagem<textarea name="mensagem" defaultValue={`Olá, gostaria de saber mais sobre o imóvel ${imovel.codigo}.`} className="min-h-24 resize-none rounded-xl border p-3 text-sm leading-5 outline-none focus:border-[#b52235]" /></label></div>
      <button type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b52235] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#941c2c]"><MessageCircle className="size-4" /> Simular contato</button><a href="tel:+554333777000" className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-zinc-500"><Phone className="size-3.5" /> ou ligue (43) 3377-7000</a><p className="mt-5 border-t pt-4 text-center text-[0.65rem] leading-4 text-zinc-400">Formulário de demonstração. Nenhuma informação será transmitida.</p>
    </form>
  );
};
