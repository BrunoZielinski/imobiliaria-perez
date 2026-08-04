"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera, Maximize2 } from "lucide-react";
import type { ImovelPerez } from "@/lib/perez360/tipos";

export const GaleriaImovel = ({ imovel }: { imovel: ImovelPerez }) => {
  const [selecionada, setSelecionada] = useState(0);
  const imagens = [...imovel.imagens, imovel.imagens[0], imovel.imagens[1]];

  return (
    <section className="mx-auto max-w-[90rem] px-4 pt-5 sm:px-6 sm:pt-8 lg:px-10">
      <div className="grid gap-2 overflow-hidden rounded-[1.35rem] bg-zinc-100 lg:grid-cols-[2fr_1fr] lg:grid-rows-2">
        <button type="button" onClick={() => setSelecionada(0)} className="relative aspect-[4/3] overflow-hidden text-left lg:row-span-2 lg:aspect-auto lg:min-h-[36rem]" aria-label="Ver foto principal">
          <Image src={imagens[selecionada]} alt={`${imovel.titulo} — foto ${selecionada + 1}`} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-zinc-950/75 px-3 py-2 text-xs font-bold text-white backdrop-blur"><Camera className="size-3.5" /> {selecionada + 1} de {imagens.length}</span>
          <span className="absolute bottom-4 right-4 grid size-9 place-items-center rounded-full bg-white/90 text-zinc-800"><Maximize2 className="size-4" /></span>
        </button>
        {imagens.slice(1, 3).map((imagem, indice) => (
          <button key={`${imagem}-${indice}`} type="button" onClick={() => setSelecionada(indice + 1)} className="relative hidden overflow-hidden lg:block" aria-label={`Ver foto ${indice + 2}`}>
            <Image src={imagem} alt={`${imovel.titulo} — foto ${indice + 2}`} fill sizes="33vw" className="object-cover transition duration-500 hover:scale-[1.03]" />
          </button>
        ))}
      </div>
      <div className="scrollbar-hide mt-2 flex snap-x gap-2 overflow-x-auto lg:hidden">
        {imagens.map((imagem, indice) => (
          <button key={`${imagem}-${indice}`} type="button" onClick={() => setSelecionada(indice)} aria-label={`Selecionar foto ${indice + 1}`} className={`relative h-20 w-28 shrink-0 snap-start overflow-hidden rounded-xl border-2 ${selecionada === indice ? "border-[#b52235]" : "border-transparent"}`}>
            <Image src={imagem} alt="" fill sizes="112px" className="object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
};
