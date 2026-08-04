import Link from "next/link";
import { ArrowUpRight, Heart, UserRound } from "lucide-react";
import { LogoPerez } from "./logo-perez";
import { MenuMobile } from "./menu-mobile";

const LINKS = [
  ["Imóveis", "/imoveis"],
  ["Anuncie seu imóvel", "/vender-alugar"],
  ["Sobre", "/sobre"],
  ["Contato", "/contato"],
] as const;

export const CabecalhoSite = () => (
  <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl">
    <div className="border-b border-zinc-100 bg-zinc-950 text-white">
      <div className="mx-auto flex h-8 max-w-[90rem] items-center justify-between px-4 text-[0.68rem] font-medium tracking-wide sm:px-6 lg:px-10">
        <span>Há mais de 35 anos conectando Londrina ao lugar certo.</span>
        <Link href="/dashboard" className="hidden items-center gap-1 text-white/70 transition hover:text-white sm:flex">
          Conheça a plataforma Perez 360 <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </div>
    <div className="mx-auto flex h-[4.75rem] max-w-[90rem] items-center justify-between gap-5 px-4 sm:px-6 lg:px-10">
      <LogoPerez />
      <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
        {LINKS.map(([rotulo, href]) => (
          <Link key={href} href={href} className="text-sm font-semibold text-zinc-600 transition hover:text-[#b52235]">
            {rotulo}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/imoveis" aria-label="Ver imóveis favoritos" className="hidden size-10 items-center justify-center rounded-full border text-zinc-600 transition hover:border-[#b52235]/30 hover:text-[#b52235] sm:flex">
          <Heart className="size-4" />
        </Link>
        <Link href="/portal" className="hidden items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold text-zinc-700 transition hover:border-[#b52235]/30 hover:text-[#b52235] lg:flex">
          <UserRound className="size-4" /> Área do cliente
        </Link>
        <Link href="/imoveis" className="hidden rounded-full bg-[#b52235] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#941c2c] sm:inline-flex">
          Encontrar imóvel
        </Link>
        <MenuMobile />
      </div>
    </div>
  </header>
);
