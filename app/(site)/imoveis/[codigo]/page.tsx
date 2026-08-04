import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";
import { GaleriaImovel } from "@/components/site/galeria-imovel";
import { FichaImovel } from "@/components/site/ficha-imovel";
import { FormularioContatoImovel } from "@/components/site/formulario-contato-imovel";
import { SecaoImoveis } from "@/components/site/secao-imoveis";
import { IMOVEIS_PEREZ } from "@/lib/perez360/dados";
import { imoveisRelacionados, obterImovel } from "@/lib/perez360/seletores";

type ImovelPageProps = { params: Promise<{ codigo: string }> };

export const generateStaticParams = () => IMOVEIS_PEREZ.map((imovel) => ({ codigo: imovel.codigo.toLowerCase() }));

export const generateMetadata = async ({ params }: ImovelPageProps): Promise<Metadata> => {
  const { codigo } = await params;
  const imovel = obterImovel(codigo);
  return imovel ? { title: imovel.titulo, description: `${imovel.tipo} em ${imovel.bairro}, Londrina. Código ${imovel.codigo}.` } : { title: "Imóvel não encontrado" };
};

const ImovelPage = async ({ params }: ImovelPageProps) => {
  const { codigo } = await params;
  const imovel = obterImovel(codigo);
  if (!imovel) notFound();
  const relacionados = imoveisRelacionados(imovel, 3);

  return <main><div className="mx-auto flex max-w-[90rem] items-center gap-2 px-5 pt-7 text-xs font-bold text-zinc-500 sm:px-6 lg:px-10"><Link href="/imoveis" className="flex items-center gap-1 hover:text-[#b52235]"><ChevronLeft className="size-3.5" /> Imóveis</Link><span>/</span><span className="flex items-center gap-1 text-zinc-800"><MapPin className="size-3" /> {imovel.bairro}</span></div><GaleriaImovel imovel={imovel} /><section className="mx-auto grid max-w-[90rem] gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_23rem] lg:px-10"><FichaImovel imovel={imovel} /><aside className="lg:sticky lg:top-32 lg:self-start"><FormularioContatoImovel imovel={imovel} /></aside></section><SecaoImoveis titulo="Imóveis semelhantes" imoveis={relacionados} /></main>;
};

export default ImovelPage;
