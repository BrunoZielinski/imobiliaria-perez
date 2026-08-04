import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, CarFront, MapPin, Ruler } from "lucide-react";
import { formatarMoeda } from "@/lib/perez360/seletores";
import type { ImovelPerez } from "@/lib/perez360/tipos";
import { cn } from "@/lib/utils";

const finalidade = {
  venda: "Venda",
  locacao: "Aluguel",
  lancamento: "Lançamento",
} as const;

export const CardImovel = ({ imovel, compacto = false }: { imovel: ImovelPerez; compacto?: boolean }) => (
  <article className="group overflow-hidden rounded-[1.35rem] border border-zinc-200 bg-white shadow-[0_14px_45px_rgba(24,24,27,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(24,24,27,0.12)]">
    <Link href={`/imoveis/${imovel.codigo.toLowerCase()}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-[#b52235] focus-visible:ring-inset">
      <div className={cn("relative overflow-hidden", compacto ? "aspect-[4/3]" : "aspect-[1.28/1]")}>
        <Image src={imovel.imagens[0]} alt={`${imovel.titulo}, ${imovel.bairro}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.035]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#9d1d2e] shadow-sm backdrop-blur">
            {finalidade[imovel.finalidade]}
          </span>
          <span className="grid size-9 place-items-center rounded-full bg-zinc-950/75 text-white backdrop-blur transition group-hover:bg-[#b52235]">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-zinc-400">
          <span>{imovel.codigo}</span>
          <span className="flex items-center gap-1 normal-case tracking-normal"><MapPin className="size-3" /> {imovel.bairro}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 text-lg font-extrabold leading-6 tracking-[-0.025em] text-zinc-900">{imovel.titulo}</h3>
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
      </div>
    </Link>
  </article>
);
