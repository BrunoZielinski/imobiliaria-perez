"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import type { FinalidadeImovel } from "@/lib/perez360/tipos";

const OPCOES: { valor: FinalidadeImovel; rotulo: string }[] = [
  { valor: "venda", rotulo: "Comprar" },
  { valor: "locacao", rotulo: "Alugar" },
  { valor: "lancamento", rotulo: "Lançamentos" },
];

export const BuscaHero = ({ imagem }: { imagem: string }) => {
  const [finalidade, setFinalidade] = useState<FinalidadeImovel>("venda");

  return (
    <section className="relative min-h-[44rem] overflow-hidden bg-zinc-950 text-white lg:min-h-[48rem]">
      <Image src={imagem} alt="Apartamento contemporâneo com vista para Londrina" fill priority sizes="100vw" className="object-cover opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,15,17,.9)_0%,rgba(15,15,17,.58)_48%,rgba(15,15,17,.16)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(15,15,17,.55)_0%,transparent_45%)]" />

      <div className="relative mx-auto flex min-h-[44rem] max-w-[90rem] items-center px-5 py-16 sm:px-6 lg:min-h-[48rem] lg:px-10">
        <div className="w-full max-w-4xl">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            <MapPin className="size-4 text-[#ee8a98]" /> Londrina, Paraná
          </p>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.03] tracking-[-0.055em] sm:text-6xl lg:text-[5.2rem]">
            Encontre o imóvel que combina com o seu momento
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            Uma seleção cuidadosa para morar, investir e construir os próximos capítulos da sua história.
          </p>

          <form action="/imoveis" method="get" className="mt-10 max-w-3xl rounded-2xl bg-white p-2 text-zinc-900 shadow-2xl shadow-black/30 sm:rounded-[1.35rem] sm:p-3">
            <input type="hidden" name="finalidade" value={finalidade} />
            <div className="scrollbar-hide flex gap-1 overflow-x-auto px-1 pb-2 sm:gap-2">
              {OPCOES.map((opcao) => (
                <button
                  key={opcao.valor}
                  type="button"
                  onClick={() => setFinalidade(opcao.valor)}
                  className={
                    finalidade === opcao.valor
                      ? "shrink-0 rounded-full bg-zinc-950 px-4 py-2 text-xs font-bold text-white sm:px-5 sm:text-sm"
                      : "shrink-0 rounded-full px-4 py-2 text-xs font-bold text-zinc-500 transition hover:bg-zinc-100 sm:px-5 sm:text-sm"
                  }
                  aria-pressed={finalidade === opcao.valor}
                >
                  {opcao.rotulo}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#f5f3ef] px-4 py-3.5 sm:rounded-2xl sm:px-5">
                <Search className="size-5 shrink-0 text-[#b52235]" />
                <span className="sr-only">Bairro, tipo ou código do imóvel</span>
                <input
                  type="search"
                  name="busca"
                  placeholder="Bairro, tipo ou código do imóvel"
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-zinc-400 sm:text-base"
                />
              </label>
              <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#b52235] px-6 text-sm font-bold text-white transition hover:bg-[#941c2c] sm:rounded-2xl sm:px-7">
                Buscar imóveis <ArrowRight className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
