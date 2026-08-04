import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, CarFront, MapPin, Ruler } from "lucide-react";
import { formatarMoeda } from "@/lib/perez360/seletores";
import type { ImovelPerez } from "@/lib/perez360/tipos";
import { cn } from "@/lib/utils";
import { FavoritoImovel } from "./favorito-imovel";

const finalidade = {
  venda: "Venda",
  locacao: "Aluguel",
  lancamento: "Lançamento",
} as const;

export const CardImovel = ({ imovel, compacto = false, imagemPrioritaria = false }: { imovel: ImovelPerez; compacto?: boolean; imagemPrioritaria?: boolean }) => (
  <article className="group overflow-hidden rounded-[1.35rem] border border-zinc-200 bg-white shadow-[0_14px_45px_rgba(24,24,27,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(24,24,27,0.12)]">
    <div className={cn("relative overflow-hidden", compacto ? "aspect-[4/3]" : "aspect-[1.28/1]")}>
      <Link href={`/imoveis/${imovel.codigo.toLowerCase()}`} aria-label={`Abrir ${imovel.titulo}`} className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-[#b52235] focus-visible:ring-inset">
        <Image src={imovel.imagens[0]} alt={`${imovel.titulo}, ${imovel.bairro}`} fill loading={imagemPrioritaria ? "eager" : "lazy"} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.035]" />
      </Link>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#9d1d2e] shadow-sm backdrop-blur">
            {finalidade[imovel.finalidade]}
          </span>
          <FavoritoImovel codigo={imovel.codigo} className="pointer-events-auto" />
      </div>
    </div>
    <Link href={`/imoveis/${imovel.codigo.toLowerCase()}`} className="block p-5 outline-none focus-visible:ring-2 focus-visible:ring-[#b52235] focus-visible:ring-inset sm:p-6">
        <div className="flex items-center justify-between gap-3 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-zinc-400">
          <span>{imovel.codigo}</span>
          <span className="flex items-center gap-1 normal-case tracking-normal"><MapPin className="size-3" /> {imovel.bairro}</span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-3"><h3 className="line-clamp-2 text-lg font-extrabold leading-6 tracking-[-0.025em] text-zinc-900">{imovel.titulo}</h3><ArrowUpRight className="mt-0.5 size-4 shrink-0 text-zinc-400 transition group-hover:text-[#b52235]" /></div>
        <p className="mt-4 text-xl font-black tracking-[-0.035em] text-[#a31f30]">
          {formatarMoeda(imovel.preco)}
          {imovel.finalidade === "locacao" && <span className="ml-1 text-xs font-medium text-zinc-400">/mês</span>}
        </p>
        <div className="mt-5 grid grid-cols-4 gap-2 border-t pt-4 text-xs font-semibold text-zinc-500">
          <span className="flex items-center gap-1"><Ruler className="size-3.5" /> {imovel.area}m²</span>
          <span className="flex items-center gap-1"><BedDouble className="size-3.5" /> {imovel.quartos}</span>
          <span className="flex items-center gap-1"><Bath className="size-3.5" /> {imovel.banheiros}</span>
          <span className="flex items-center gap-1"><CarFront className="size-3.5" /> {imovel.vagas}</span>
        </div>
    </Link>
  </article>
);
