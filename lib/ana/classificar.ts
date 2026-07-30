import type { Departamento } from "@/lib/tipos";

export type Classificacao = {
  departamento: Departamento | null;
  confianca: number;
  contexto: string | null;
};

const OPCOES_MENU: Record<string, Departamento> = {
  "1": "comercial",
  "2": "administrativo",
  "3": "recepcao",
};

const PALAVRAS: Record<Departamento, string[]> = {
  comercial: [
    "comprar", "compra", "vender", "venda", "alugar", "aluguel", "locacao", "locação",
    "apartamento", "casa", "terreno", "lancamento", "lançamento",
    "visita", "visitar", "financiamento", "proposta", "corretor",
  ],
  administrativo: [
    "boleto", "segunda via", "2a via", "pagamento", "pagar", "repasse", "contrato",
    "rescisao", "rescisão", "vistoria", "iptu", "condominio", "condomínio", "reparo",
    "manutencao", "manutenção", "reajuste", "multa", "financeiro", "vencimento",
    "venceu", "atraso", "atrasado",
  ],
  recepcao: [
    "falar com", "recepcao", "recepção", "telefone", "endereco", "endereço",
    "horario", "horário",
  ],
};

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const pontuar = (texto: string, palavras: string[]) =>
  palavras.filter((palavra) => texto.includes(normalizar(palavra))).length;

export const classificar = (texto: string): Classificacao => {
  const limpo = texto.trim();
  const soNumero = limpo.replace(/[^\d]/g, "");
  if (limpo.length <= 4 && soNumero.length === 1) {
    const departamento = OPCOES_MENU[soNumero] ?? null;
    return { departamento, confianca: departamento ? 1 : 0, contexto: null };
  }

  const normalizado = normalizar(limpo);
  const placar = (Object.keys(PALAVRAS) as Departamento[]).map((departamento) => ({
    departamento,
    pontos: pontuar(normalizado, PALAVRAS[departamento]),
  }));

  const vencedor = placar.reduce((a, b) => (b.pontos > a.pontos ? b : a));
  if (vencedor.pontos === 0) return { departamento: null, confianca: 0, contexto: limpo };

  const totalPontos = placar.reduce((soma, p) => soma + p.pontos, 0);
  return {
    departamento: vencedor.departamento,
    confianca: Number((vencedor.pontos / totalPontos).toFixed(2)),
    contexto: limpo,
  };
};
