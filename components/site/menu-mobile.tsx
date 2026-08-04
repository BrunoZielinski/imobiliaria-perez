"use client";

import Link from "next/link";
import { Building2, Heart, Menu, MonitorCog, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoPerez } from "./logo-perez";

const LINKS = [
  ["Imóveis", "/imoveis"],
  ["Anuncie seu imóvel", "/vender-alugar"],
  ["Sobre a Perez", "/sobre"],
  ["Contato", "/contato"],
] as const;

export const MenuMobile = () => (
  <Sheet>
    <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir menu" />}>
      <Menu className="size-5" />
    </SheetTrigger>
    <SheetContent className="w-[88%] bg-[#f8f6f2] p-0" side="right">
      <SheetHeader className="border-b bg-white px-5 py-5 text-left">
        <SheetTitle className="sr-only">Menu principal</SheetTitle>
        <SheetDescription className="sr-only">Navegação do site da Imobiliária Perez</SheetDescription>
        <LogoPerez />
      </SheetHeader>
      <nav className="flex flex-col px-5 py-5" aria-label="Navegação móvel">
        {LINKS.map(([rotulo, href]) => (
          <SheetClose key={href} render={<Link href={href} className="border-b border-zinc-200 py-4 text-base font-semibold text-zinc-800" />}>
            {rotulo}
          </SheetClose>
        ))}
      </nav>
      <div className="mt-auto grid gap-2 border-t bg-white p-5">
        <SheetClose render={<Link href="/imoveis" className="flex items-center gap-3 rounded-xl bg-[#b52235] px-4 py-3 font-bold text-white" />}>
          <Building2 className="size-4" /> Encontrar imóvel
        </SheetClose>
        <SheetClose render={<Link href="/portal" className="flex items-center gap-3 rounded-xl border px-4 py-3 font-semibold" />}>
          <UserRound className="size-4" /> Área do cliente
        </SheetClose>
        <SheetClose render={<Link href="/dashboard" className="flex items-center gap-3 rounded-xl border px-4 py-3 font-semibold" />}>
          <MonitorCog className="size-4" /> Plataforma Perez 360
        </SheetClose>
        <span className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
          <Heart className="size-3.5" /> Atendimento próximo há mais de 35 anos
        </span>
      </div>
    </SheetContent>
  </Sheet>
);
