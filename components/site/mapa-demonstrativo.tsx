import Link from "next/link";
import { MapPin } from "lucide-react";
import type { ImovelPerez } from "@/lib/perez360/tipos";
import { formatarMoeda } from "@/lib/perez360/seletores";

const POSICOES = [
  [18, 24], [63, 18], [40, 44], [78, 54], [24, 70], [55, 76], [83, 82], [12, 48], [68, 38], [36, 18], [48, 61], [87, 31],
] as const;

export const MapaDemonstrativo = ({ imoveis }: { imoveis: ImovelPerez[] }) => (
  <div className="relative min-h-[42rem] overflow-hidden rounded-[1.5rem] border bg-[#e8e3da] shadow-sm">
    <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(28deg,transparent_46%,white_47%,white_52%,transparent_53%),linear-gradient(112deg,transparent_45%,white_46%,white_51%,transparent_52%)] [background-size:170px_140px]" />
    <div className="absolute left-[8%] top-[14%] h-[72%] w-3 rotate-12 rounded-full bg-white/80" />
    <div className="absolute left-[52%] top-[-10%] h-[120%] w-4 -rotate-[28deg] rounded-full bg-white/75" />
    <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3 rounded-xl bg-white/90 px-4 py-3 text-xs shadow-sm backdrop-blur">
      <span className="font-bold">Londrina — visão aproximada</span><span className="text-zinc-500">Mapa demonstrativo — sem geolocalização real</span>
    </div>
    {imoveis.map((imovel, indice) => {
      const [x, y] = POSICOES[indice % POSICOES.length];
      return (
        <Link key={imovel.id} href={`/imoveis/${imovel.codigo.toLowerCase()}`} style={{ left: `${x}%`, top: `${y}%` }} className="group absolute z-10 -translate-x-1/2 -translate-y-1/2">
          <span className="flex items-center gap-1 rounded-full bg-zinc-950 px-3 py-2 text-[0.68rem] font-extrabold text-white shadow-lg transition hover:scale-105 hover:bg-[#b52235]"><MapPin className="size-3" /> {formatarMoeda(imovel.preco)}</span>
        </Link>
      );
    })}
  </div>
);
