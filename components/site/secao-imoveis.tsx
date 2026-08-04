import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ImovelPerez } from "@/lib/perez360/tipos";
import { CardImovel } from "./card-imovel";

export const SecaoImoveis = ({ titulo, imoveis }: { titulo: string; imoveis: ImovelPerez[] }) => (
  <section className="bg-[#f7f4ef] py-16 sm:py-24">
    <div className="mx-auto max-w-[90rem] px-5 sm:px-6 lg:px-10">
      <div className="mb-9 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b52235]">Seleção Perez</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-zinc-950 sm:text-5xl">{titulo}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">Imóveis escolhidos pela localização, qualidade e potencial para o seu próximo momento.</p>
        </div>
        <Link href="/imoveis" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-800 transition hover:text-[#b52235]">Ver todos os imóveis <ArrowRight className="size-4" /></Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {imoveis.map((imovel) => <CardImovel key={imovel.id} imovel={imovel} />)}
      </div>
    </div>
  </section>
);
