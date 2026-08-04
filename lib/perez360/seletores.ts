import { IMOVEIS_PEREZ } from "./dados";
import type { FiltrosImoveis, ImovelPerez } from "./tipos";

const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();

export const buscarImoveis = (filtros: FiltrosImoveis = {}) => {
  const busca = normalizar(filtros.busca ?? "");

  return IMOVEIS_PEREZ.filter((imovel) => {
    if (imovel.statusPublicacao !== "publicado") return false;
    if (
      filtros.finalidade &&
      filtros.finalidade !== "todos" &&
      imovel.finalidade !== filtros.finalidade
    )
      return false;
    if (filtros.tipo && filtros.tipo !== "todos" && imovel.tipo !== filtros.tipo) return false;
    if (filtros.bairro && filtros.bairro !== "todos" && imovel.bairro !== filtros.bairro)
      return false;
    if (filtros.precoMinimo !== undefined && imovel.preco < filtros.precoMinimo) return false;
    if (filtros.precoMaximo !== undefined && imovel.preco > filtros.precoMaximo) return false;
    if (filtros.quartos !== undefined && imovel.quartos < filtros.quartos) return false;
    if (filtros.vagas !== undefined && imovel.vagas < filtros.vagas) return false;

    if (busca) {
      const texto = normalizar(
        [imovel.codigo, imovel.titulo, imovel.bairro, imovel.cidade, imovel.tipo].join(" "),
      );
      if (!texto.includes(busca)) return false;
    }

    return true;
  });
};

export const obterImovel = (codigo: string) =>
  IMOVEIS_PEREZ.find((imovel) => normalizar(imovel.codigo) === normalizar(codigo));

export const imoveisRelacionados = (imovel: ImovelPerez, limite = 3) =>
  IMOVEIS_PEREZ.filter(
    (candidato) => candidato.id !== imovel.id && candidato.statusPublicacao === "publicado",
  )
    .sort((a, b) => {
      const pontos = (item: ImovelPerez) =>
        Number(item.bairro === imovel.bairro) * 2 + Number(item.finalidade === imovel.finalidade);
      return pontos(b) - pontos(a);
    })
    .slice(0, limite);

export const formatarMoeda = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
