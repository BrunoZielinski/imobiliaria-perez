import type { Metadata } from "next";
import { CatalogoImoveis } from "@/components/site/catalogo-imoveis";

export const metadata: Metadata = { title: "Imóveis em Londrina" };

type ImoveisPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const valorUnico = (valor: string | string[] | undefined) => Array.isArray(valor) ? valor[0] : valor;

const ImoveisPage = async ({ searchParams }: ImoveisPageProps) => {
  const parametros = await searchParams;
  return <CatalogoImoveis finalidadeInicial={valorUnico(parametros.finalidade)} buscaInicial={valorUnico(parametros.busca)} />;
};

export default ImoveisPage;
