"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { GRUPOS_NAVEGACAO } from "@/lib/perez360/navegacao";
import { LogoPerez } from "@/components/site/logo-perez";
import { ICONES_NAVEGACAO } from "./navegacao";

export const NavegacaoMobile = () => (
  <Sheet>
    <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir módulos" />}><Menu className="size-5" /></SheetTrigger>
    <SheetContent side="left" className="w-[88%] overflow-y-auto bg-[#f7f7f8] p-0">
      <SheetHeader className="border-b bg-white p-5 text-left"><SheetTitle className="sr-only">Módulos Perez 360</SheetTitle><SheetDescription className="sr-only">Navegação da plataforma interna</SheetDescription><LogoPerez /></SheetHeader>
      <nav className="grid gap-6 p-4">
        {GRUPOS_NAVEGACAO.map((grupo) => <div key={grupo.rotulo}><p className="mb-2 px-3 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-zinc-400">{grupo.rotulo}</p><div className="grid gap-1">{grupo.itens.map((item) => { const Icone = ICONES_NAVEGACAO[item.icone]; return <SheetClose key={item.href} render={<Link href={item.href} className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-semibold shadow-xs" />}><Icone className="size-4 text-[#b52235]" /><span className="flex-1">{item.rotulo}</span>{item.adicional && <span className="size-1.5 rounded-full bg-amber-400" />}</SheetClose>; })}</div></div>)}
      </nav>
      <div className="border-t bg-white p-4"><SheetClose render={<Link href="/" className="block rounded-xl border px-4 py-3 text-center text-sm font-bold" />}>Voltar ao site público</SheetClose></div>
    </SheetContent>
  </Sheet>
);
