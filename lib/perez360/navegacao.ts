export type IconeNavegacao =
  | "dashboard"
  | "radio"
  | "mensagens"
  | "pipeline"
  | "contatos"
  | "imoveis"
  | "captacoes"
  | "contratos"
  | "manutencoes"
  | "cobrancas"
  | "financeiro"
  | "equipe"
  | "configuracoes";

export type ItemNavegacao = {
  href: string;
  rotulo: string;
  icone: IconeNavegacao;
  adicional?: boolean;
};

export type GrupoNavegacao = {
  rotulo: string;
  itens: ItemNavegacao[];
};

export const GRUPOS_NAVEGACAO: GrupoNavegacao[] = [
  {
    rotulo: "Visão geral",
    itens: [{ href: "/dashboard", rotulo: "Visão executiva", icone: "dashboard" }],
  },
  {
    rotulo: "Relacionamento",
    itens: [
      { href: "/simulacao", rotulo: "Simulação ao vivo", icone: "radio" },
      { href: "/inbox", rotulo: "Conversas", icone: "mensagens" },
      { href: "/pipelines", rotulo: "CRM comercial", icone: "pipeline" },
      { href: "/contatos", rotulo: "Pessoas", icone: "contatos" },
    ],
  },
  {
    rotulo: "Imóveis e locação",
    itens: [
      { href: "/carteira", rotulo: "Carteira", icone: "imoveis" },
      { href: "/captacoes", rotulo: "Captações", icone: "captacoes" },
      { href: "/locacoes", rotulo: "Locações", icone: "contratos" },
      { href: "/manutencoes", rotulo: "Manutenções", icone: "manutencoes" },
    ],
  },
  {
    rotulo: "Administração",
    itens: [
      { href: "/cobrancas", rotulo: "Cobranças", icone: "cobrancas", adicional: true },
      { href: "/financeiro", rotulo: "Financeiro", icone: "financeiro", adicional: true },
      { href: "/atendentes", rotulo: "Equipe", icone: "equipe" },
      { href: "/configuracoes", rotulo: "Configurações", icone: "configuracoes" },
    ],
  },
];

export const ITENS_NAVEGACAO = GRUPOS_NAVEGACAO.flatMap((grupo) => grupo.itens);
