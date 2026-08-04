import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ChartNoAxesCombined, Home, KeyRound, Quote, ShieldCheck, Sparkles } from "lucide-react";
import { BuscaHero } from "@/components/site/busca-hero";
import { BairrosDestaque } from "@/components/site/bairros-destaque";
import { SecaoImoveis } from "@/components/site/secao-imoveis";
import { IMOVEIS_PEREZ } from "@/lib/perez360/dados";
import { TourDemonstracao } from "@/components/crm/tour-demonstracao";

export const metadata: Metadata = {
  title: "Imóveis em Londrina",
};

const OBJETIVOS = [
  { titulo: "Comprar um imóvel", texto: "Uma curadoria para morar ou investir com segurança.", href: "/imoveis?finalidade=venda", icone: Home },
  { titulo: "Alugar um imóvel", texto: "Encontre praticidade e o espaço certo para agora.", href: "/imoveis?finalidade=locacao", icone: KeyRound },
  { titulo: "Anunciar meu imóvel", texto: "Apresentação, divulgação e negociação profissional.", href: "/vender-alugar", icone: Sparkles },
  { titulo: "Administrar meu patrimônio", texto: "Cuidado próximo para imóvel, contrato e locatário.", href: "/vender-alugar#administracao", icone: ChartNoAxesCombined },
] as const;

const DEPOIMENTOS = [
  ["Atendimento cuidadoso desde a primeira visita até a entrega das chaves.", "Marina A. — exemplo visual"],
  ["A Perez trouxe clareza e tranquilidade para administrar nosso imóvel.", "Roberto N. — exemplo visual"],
  ["Encontramos um apartamento que realmente combina com a nossa rotina.", "Lucas e Ana — exemplo visual"],
] as const;

const HomePage = () => {
  const destaques = IMOVEIS_PEREZ.filter((imovel) => imovel.destaque).slice(0, 6);

  return (
    <main>
      <BuscaHero imagem={IMOVEIS_PEREZ[0].imagens[0]} />

      <section className="border-b bg-zinc-950 text-white"><div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10"><div><p className="text-xs font-bold">Apresentação Perez 360</p><p className="mt-1 text-[11px] text-white/50">Conheça o site, atendimento, CRM, operação e portais em oito passos.</p></div><TourDemonstracao publico /></div></section>

      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-[90rem] divide-y px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-10">
          {[["35+", "anos de história em Londrina"], ["1.200+", "imóveis administrados"], ["4,9/5", "experiência de atendimento"]].map(([valor, rotulo]) => (
            <div key={rotulo} className="py-8 text-center sm:py-10"><strong className="text-3xl font-black tracking-[-0.05em] text-[#a51e30] sm:text-4xl">{valor}</strong><p className="mt-1 text-xs font-semibold text-zinc-500 sm:text-sm">{rotulo}</p></div>
          ))}
        </div>
      </section>

      <SecaoImoveis titulo="Imóveis em destaque" imoveis={destaques} />

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-6 lg:px-10">
          <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b52235]">Como podemos ajudar?</p><h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-5xl">Uma Perez para cada momento</h2></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {OBJETIVOS.map(({ titulo, texto, href, icone: Icone }) => (
              <Link key={titulo} href={href} className="group rounded-[1.35rem] border border-zinc-200 p-6 transition hover:border-[#b52235]/30 hover:bg-[#fff8f8] sm:p-7">
                <span className="grid size-11 place-items-center rounded-xl bg-[#f7e7e9] text-[#a51e30]"><Icone className="size-5" /></span>
                <h3 className="mt-8 text-lg font-extrabold tracking-[-0.025em]">{titulo}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{texto}</p><span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#a51e30]">Conhecer <ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BairrosDestaque />

      <section className="overflow-hidden bg-[#19191b] text-white">
        <div className="mx-auto grid max-w-[90rem] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-10 sm:py-24 lg:px-16">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#e98291]">Nossa história</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] sm:text-6xl">Mais de 35 anos cuidando de patrimônios e histórias.</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/60">A experiência de quem conhece Londrina encontra uma nova plataforma preparada para aproximar clientes, proprietários, locatários e equipe.</p>
            <div className="mt-8 flex flex-wrap gap-3"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold"><ShieldCheck className="size-4 text-[#e98291]" /> Segurança e transparência</span><span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold"><Building2 className="size-4 text-[#e98291]" /> Conhecimento local</span></div>
            <Link href="/sobre" className="mt-10 inline-flex items-center gap-2 self-start border-b border-white/30 pb-1 text-sm font-bold">Conheça a Perez <ArrowRight className="size-4" /></Link>
          </div>
          <div className="relative flex min-h-[26rem] items-end bg-[#9d2233] p-7 sm:p-12">
            <div className="absolute -right-16 -top-16 size-72 rounded-full border-[55px] border-white/5" /><div className="absolute bottom-16 right-20 size-28 rounded-full bg-white/5" />
            <p className="relative max-w-md text-2xl font-bold leading-snug tracking-[-0.035em] sm:text-4xl">Tradição para confiar. Tecnologia para avançar.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#eee7dc] py-16 sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-6 rounded-[1.75rem] bg-[#b52235] p-7 text-white sm:p-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/65">Seu imóvel com a Perez</p><h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-5xl">Vamos descobrir o potencial do seu patrimônio?</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">Apresentação, estratégia comercial e administração conectadas em uma única experiência.</p></div>
            <Link href="/vender-alugar" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#a51e30]">Quero anunciar <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-6 lg:px-10"><div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b52235]">Experiências</p><h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-5xl">Relações construídas com cuidado</h2></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{DEPOIMENTOS.map(([texto, autor]) => <blockquote key={autor} className="rounded-[1.35rem] border bg-[#faf9f7] p-7"><Quote className="size-7 text-[#b52235]" /><p className="mt-7 text-lg font-semibold leading-7 tracking-[-0.02em]">“{texto}”</p><footer className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-zinc-400">{autor}</footer></blockquote>)}</div></div>
      </section>
    </main>
  );
};

export default HomePage;
