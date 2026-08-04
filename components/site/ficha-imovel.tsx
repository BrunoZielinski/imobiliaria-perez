import { Bath, BedDouble, CarFront, Check, MapPin, Ruler, ShieldCheck } from "lucide-react";
import { formatarMoeda } from "@/lib/perez360/seletores";
import type { ImovelPerez } from "@/lib/perez360/tipos";

const FINALIDADES = { venda: "À venda", locacao: "Para alugar", lancamento: "Lançamento" } as const;

export const FichaImovel = ({ imovel }: { imovel: ImovelPerez }) => (
  <div>
    <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b52235]"><span>{FINALIDADES[imovel.finalidade]}</span><span className="text-zinc-300">•</span><span>{imovel.codigo}</span><span className="rounded-full bg-[#f6e7e9] px-2.5 py-1 text-[0.6rem] tracking-[0.08em]">Dados demonstrativos</span></p>
    <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.05em] text-zinc-950 sm:text-5xl">{imovel.titulo}</h1>
    <p className="mt-4 flex items-center gap-2 text-sm font-medium text-zinc-500"><MapPin className="size-4 text-[#b52235]" /> {imovel.enderecoAproximado}, {imovel.cidade}</p>
    <p className="mt-7 text-3xl font-black tracking-[-0.045em] text-[#a51e30]">{formatarMoeda(imovel.preco)}{imovel.finalidade === "locacao" && <span className="ml-1 text-sm font-semibold text-zinc-400">/mês</span>}</p>
    {imovel.condominio && <p className="mt-1 text-xs font-medium text-zinc-400">Condomínio demonstrativo: {formatarMoeda(imovel.condominio)}</p>}

    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[[Ruler, `${imovel.area} m²`, "área privativa"], [BedDouble, `${imovel.quartos} quartos`, `${imovel.suites} suítes`], [Bath, `${imovel.banheiros} banheiros`, "conforto"], [CarFront, `${imovel.vagas} vagas`, "garagem"]].map(([Icone, valor, apoio]) => {
        const Icon = Icone as typeof Ruler;
        return <div key={String(valor)} className="rounded-2xl border bg-[#faf9f7] p-4"><Icon className="size-4 text-[#b52235]" /><strong className="mt-3 block text-sm">{String(valor)}</strong><span className="text-[0.68rem] text-zinc-400">{String(apoio)}</span></div>;
      })}
    </div>

    <section className="mt-10 border-t pt-9"><h2 className="text-xl font-black tracking-[-0.03em]">Sobre este imóvel</h2><p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">{imovel.descricao}</p></section>
    <section className="mt-9"><h2 className="text-xl font-black tracking-[-0.03em]">Comodidades</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{imovel.comodidades.map((item) => <span key={item} className="flex items-center gap-3 text-sm font-medium text-zinc-600"><span className="grid size-7 place-items-center rounded-full bg-[#f6e7e9] text-[#a51e30]"><Check className="size-3.5" /></span>{item}</span>)}</div></section>
    <section className="mt-10 rounded-[1.35rem] bg-zinc-950 p-6 text-white"><div className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10"><ShieldCheck className="size-5 text-[#e98291]" /></span><div><h2 className="font-bold">Curadoria e atendimento Perez</h2><p className="mt-1 text-xs leading-5 text-white/55">Informações, valores e disponibilidade são fictícios para esta apresentação visual.</p></div></div></section>
  </div>
);
