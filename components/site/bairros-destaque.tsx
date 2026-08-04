import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const BAIRROS = [
  { nome: "Gleba Palhano", apoio: "Vista, conveniência e o Lago Igapó", classe: "bg-[#8d2433] text-white" },
  { nome: "Terra Bonita", apoio: "Condomínios e novos estilos de viver", classe: "bg-[#d8c7b1] text-zinc-900" },
  { nome: "Aurora", apoio: "Mobilidade e vida urbana tranquila", classe: "bg-zinc-900 text-white" },
  { nome: "Higienópolis", apoio: "Tradição no coração de Londrina", classe: "bg-[#ebe4d9] text-zinc-900" },
] as const;

export const BairrosDestaque = () => (
  <section className="bg-white py-16 sm:py-24">
    <div className="mx-auto max-w-[90rem] px-5 sm:px-6 lg:px-10">
      <div className="max-w-2xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b52235]">Londrina de perto</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-5xl">Encontre seu lugar na cidade</h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {BAIRROS.map((bairro, indice) => (
          <Link key={bairro.nome} href={`/imoveis?busca=${encodeURIComponent(bairro.nome)}`} className={`${bairro.classe} group min-h-52 rounded-[1.5rem] p-6 transition motion-safe:hover:-translate-y-1 sm:min-h-64 sm:p-8 ${indice === 0 ? "md:col-span-2" : ""}`}>
            <div className="flex h-full flex-col justify-between gap-10">
              <span className="grid size-10 place-items-center self-end rounded-full border border-current/15 bg-white/10"><ArrowUpRight className="size-4 transition group-hover:rotate-45" /></span>
              <div><h3 className="text-2xl font-black tracking-[-0.035em] sm:text-3xl">{bairro.nome}</h3><p className="mt-2 text-sm opacity-65">{bairro.apoio}</p></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
