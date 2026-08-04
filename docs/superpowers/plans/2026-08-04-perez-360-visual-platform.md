# Perez 360 Visual Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir uma apresentação front-end navegável que conecte o novo site público e seu catálogo de imóveis aos módulos visuais de atendimento, CRM, locação, portais, financeiro e gestão da Imobiliária Perez.

**Architecture:** O projeto permanece no App Router do Next.js, separado em três route groups: site público, CRM interno e portais. Um domínio estático e tipado em `lib/perez360` fornece os mesmos imóveis, pessoas, contratos e indicadores para todas as experiências; estados de demonstração ficam locais no navegador e nunca representam operações reais.

**Tech Stack:** Next.js 16.2.12, React 19.2.4, TypeScript 5, Tailwind CSS 4, shadcn/ui, Zustand, Lucide React, Recharts e Vitest.

## Global Constraints

- Entrega exclusivamente front-end com dados fictícios plausíveis para Londrina.
- Sem banco de dados, API de produção, autenticação real, WhatsApp oficial, ERP, emissão financeira ou upload real.
- Identificar áreas internas, portais e ações sensíveis como demonstração.
- Preservar os fluxos existentes de inbox, simulação, pipelines, carteira, cobranças, atendentes e dashboard.
- Usar somente dependências já instaladas.
- Aplicar a identidade Perez em vermelho profundo, branco, grafite e tons quentes neutros.
- Todo o texto de interface deve estar em português brasileiro.
- As jornadas principais devem funcionar em notebook e celular.
- Não alterar nem incluir em commits `.superpowers/`, `pnpm-lock.yaml` ou `pnpm-workspace.yaml`.
- Seguir as convenções do Next.js 16: `params` assíncronos em páginas dinâmicas e layouts por route group.

---

### Task 1: Criar o domínio compartilhado Perez 360

**Files:**
- Create: `lib/perez360/tipos.ts`
- Create: `lib/perez360/dados.ts`
- Create: `lib/perez360/seletores.ts`
- Create: `lib/perez360/seletores.test.ts`

**Interfaces:**
- Produces: `ImovelPerez`, `PessoaPerez`, `ContratoPerez`, `ManutencaoPerez`, `LancamentoPerez`, `CaptacaoPerez` e `FiltrosImoveis`.
- Produces: `IMOVEIS_PEREZ`, `PESSOAS_PEREZ`, `CONTRATOS_PEREZ`, `MANUTENCOES_PEREZ`, `LANCAMENTOS_PEREZ` e `CAPTACOES_PEREZ`.
- Produces: `buscarImoveis(filtros: FiltrosImoveis): ImovelPerez[]`, `obterImovel(codigo: string): ImovelPerez | undefined`, `imoveisRelacionados(imovel: ImovelPerez, limite?: number): ImovelPerez[]` e `formatarMoeda(valor: number): string`.

- [ ] **Step 1: Escrever os testes dos filtros e vínculos**

Criar `lib/perez360/seletores.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { IMOVEIS_PEREZ } from "./dados";
import { buscarImoveis, imoveisRelacionados, obterImovel } from "./seletores";

describe("catálogo Perez 360", () => {
  it("filtra finalidade, bairro, dormitórios e preço", () => {
    const resultado = buscarImoveis({
      finalidade: "venda",
      bairro: "Gleba Palhano",
      quartos: 3,
      precoMaximo: 1_500_000,
    });
    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.every((item) =>
      item.finalidade === "venda" &&
      item.bairro === "Gleba Palhano" &&
      item.quartos >= 3 &&
      item.preco <= 1_500_000
    )).toBe(true);
  });

  it("encontra imóvel pelo código independentemente de caixa", () => {
    expect(obterImovel("pz-1001")?.codigo).toBe("PZ-1001");
  });

  it("não repete o imóvel entre os relacionados", () => {
    const base = IMOVEIS_PEREZ[0];
    expect(imoveisRelacionados(base, 3)).not.toContainEqual(base);
  });
});
```

- [ ] **Step 2: Executar o teste e confirmar RED**

Run: `pnpm exec vitest run lib/perez360/seletores.test.ts`

Expected: FAIL porque os módulos ainda não existem.

- [ ] **Step 3: Definir os tipos do domínio**

Criar `lib/perez360/tipos.ts` com os contratos exatos:

```ts
export type FinalidadeImovel = "venda" | "locacao" | "lancamento";
export type StatusPublicacao = "publicado" | "rascunho" | "em_preparacao";

export type ImovelPerez = {
  id: string;
  codigo: string;
  titulo: string;
  finalidade: FinalidadeImovel;
  tipo: "apartamento" | "casa" | "terreno" | "comercial";
  bairro: string;
  cidade: "Londrina";
  enderecoAproximado: string;
  preco: number;
  condominio: number | null;
  area: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  descricao: string;
  comodidades: string[];
  imagens: string[];
  destaque: boolean;
  statusPublicacao: StatusPublicacao;
  proprietarioId: string;
  corretor: string;
};

export type FiltrosImoveis = {
  finalidade?: FinalidadeImovel | "todos";
  busca?: string;
  tipo?: ImovelPerez["tipo"] | "todos";
  bairro?: string | "todos";
  precoMinimo?: number;
  precoMaximo?: number;
  quartos?: number;
  vagas?: number;
};

export type PapelPessoa = "lead" | "cliente" | "proprietario" | "locatario";
export type PessoaPerez = {
  id: string;
  nome: string;
  papeis: PapelPessoa[];
  telefone: string;
  email: string;
  imoveisIds: string[];
};

export type ContratoPerez = {
  id: string;
  imovelId: string;
  proprietarioId: string;
  locatarioId: string;
  inicio: string;
  fim: string;
  proximoReajuste: string;
  valor: number;
  status: "ativo" | "atencao" | "encerrado";
};

export type ManutencaoPerez = {
  id: string;
  imovelId: string;
  solicitanteId: string;
  titulo: string;
  descricao: string;
  prioridade: "urgente" | "alta" | "normal";
  status: "aberta" | "em_andamento" | "concluida";
  prestador: string | null;
  prazo: string;
};

export type LancamentoPerez = {
  id: string;
  contratoId: string;
  tipo: "recebimento" | "repasse";
  descricao: string;
  valor: number;
  vencimento: string;
  status: "previsto" | "realizado" | "pendente";
};

export type CaptacaoPerez = {
  id: string;
  imovelId: string;
  proprietarioId: string;
  responsavel: string;
  etapa: "avaliacao" | "documentacao" | "fotografia" | "publicacao";
  proximaAcao: string;
};
```

- [ ] **Step 4: Criar os dados coerentes da demonstração**

Em `lib/perez360/dados.ts`, exportar:

- 12 imóveis, com pelo menos 5 de venda, 5 de locação e 2 lançamentos;
- bairros Gleba Palhano, Aurora, Centro, Jardim Quebec, Higienópolis e Terra Bonita;
- imagens remotas estáveis em `images.unsplash.com`, sempre com parâmetros `auto=format&fit=crop&w=1600&q=82`;
- 8 pessoas cobrindo lead, cliente, proprietário e locatário;
- 4 contratos ligados a imóveis e pessoas existentes;
- 5 manutenções e 8 lançamentos financeiros fictícios.

Todos os relacionamentos devem apontar para IDs existentes. Usar `PZ-1001` no imóvel principal da jornada demonstrativa.

Usar esta matriz como fonte dos 12 imóveis; títulos podem acrescentar o nome do empreendimento, mas código, finalidade, bairro, tipo, preço e quartos não devem variar:

| Código | Finalidade | Bairro | Tipo | Preço | Quartos |
| --- | --- | --- | --- | ---: | ---: |
| PZ-1001 | venda | Gleba Palhano | apartamento | 1.280.000 | 3 |
| PZ-1002 | locacao | Gleba Palhano | apartamento | 4.800 | 3 |
| PZ-1003 | venda | Terra Bonita | casa | 1.490.000 | 4 |
| PZ-1004 | locacao | Centro | comercial | 3.200 | 0 |
| PZ-1005 | venda | Jardim Quebec | casa | 980.000 | 3 |
| PZ-1006 | locacao | Higienópolis | apartamento | 2.650 | 2 |
| PZ-1007 | venda | Aurora | apartamento | 720.000 | 2 |
| PZ-1008 | locacao | Terra Bonita | casa | 6.900 | 4 |
| PZ-1009 | venda | Centro | comercial | 640.000 | 0 |
| PZ-1010 | locacao | Jardim Quebec | casa | 3.900 | 3 |
| PZ-1011 | lancamento | Gleba Palhano | apartamento | 1.650.000 | 4 |
| PZ-1012 | lancamento | Aurora | apartamento | 590.000 | 2 |

Exportar também `CAPTACOES_PEREZ` com quatro itens, um para cada etapa. Usar os IDs `pessoa-01` a `pessoa-08`, `contrato-01` a `contrato-04`, `manutencao-01` a `manutencao-05` e `lancamento-01` a `lancamento-08` para facilitar auditoria dos vínculos.

- [ ] **Step 5: Implementar os seletores puros**

Em `lib/perez360/seletores.ts`, normalizar textos com `normalize("NFD")`, remover diacríticos e aplicar todos os filtros por interseção. `buscarImoveis` deve retornar somente imóveis publicados no site. `imoveisRelacionados` deve priorizar mesmo bairro, depois mesma finalidade, sem repetir o imóvel base.

- [ ] **Step 6: Executar testes e verificação de tipos**

Run:

```bash
pnpm exec vitest run lib/perez360/seletores.test.ts
pnpm exec tsc --noEmit
```

Expected: ambos encerram com código `0`.

- [ ] **Step 7: Commit**

```bash
git add lib/perez360/tipos.ts lib/perez360/dados.ts lib/perez360/seletores.ts lib/perez360/seletores.test.ts
git commit -m "feat: add shared Perez 360 demo domain"
```

---

### Task 2: Construir o shell responsivo do site público

**Files:**
- Create: `app/(site)/layout.tsx`
- Create: `components/site/logo-perez.tsx`
- Create: `components/site/cabecalho-site.tsx`
- Create: `components/site/rodape-site.tsx`
- Create: `components/site/menu-mobile.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `next.config.ts`
- Delete: `app/page.tsx`

**Interfaces:**
- Consumes: links públicos e `/portal`.
- Produces: `LogoPerez`, `CabecalhoSite`, `RodapeSite` e layout do route group `(site)`.

- [ ] **Step 1: Configurar imagens remotas e metadados**

Em `next.config.ts`, permitir somente o host utilizado pelo conjunto demonstrativo:

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
  },
};
```

Atualizar `app/layout.tsx` para `title.template = "%s | Imobiliária Perez"`, título padrão `Imobiliária Perez — Imóveis em Londrina` e descrição institucional.

- [ ] **Step 2: Criar a assinatura visual Perez**

`LogoPerez` deve renderizar um monograma `P` branco dentro de um quadrado vermelho e o texto `Imobiliária Perez`, sem depender de imagem externa. Em `app/globals.css`, adicionar tokens:

```css
:root {
  --perez-red: #b52235;
  --perez-red-dark: #861928;
  --perez-ink: #19191b;
  --perez-paper: #f7f4ef;
  --perez-cream: #eee7dc;
}
```

Adicionar classes utilitárias próprias somente quando Tailwind não expressar o comportamento, incluindo `scrollbar-hide` e respeito a `prefers-reduced-motion`.

- [ ] **Step 3: Criar cabeçalho desktop e menu móvel**

O cabeçalho deve conter links para `/imoveis`, `/vender-alugar`, `/sobre`, `/contato`, `/portal` e `/dashboard`. No celular, `MenuMobile` abre um `Sheet` com os mesmos links. O botão principal será “Encontrar imóvel”.

- [ ] **Step 4: Criar rodapé completo**

O rodapé deve mostrar endereço demonstrativo em Londrina, telefone, WhatsApp, horários, links institucionais, áreas do cliente e aviso “Apresentação visual — dados demonstrativos”.

- [ ] **Step 5: Criar o layout do site e remover o redirecionamento**

`app/(site)/layout.tsx` deve envolver `children` com `CabecalhoSite` e `RodapeSite`. Remover `app/page.tsx` para que a futura `app/(site)/page.tsx` assuma `/` sem conflito.

- [ ] **Step 6: Verificar lint e tipos**

Run: `pnpm lint -- app/layout.tsx 'app/(site)/layout.tsx' components/site next.config.ts && pnpm exec tsc --noEmit`

Expected: código `0`.

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx app/globals.css next.config.ts 'app/(site)/layout.tsx' components/site app/page.tsx
git commit -m "feat: add Perez public site shell"
```

---

### Task 3: Criar a nova home Busca Direta

**Files:**
- Create: `app/(site)/page.tsx`
- Create: `components/site/busca-hero.tsx`
- Create: `components/site/card-imovel.tsx`
- Create: `components/site/secao-imoveis.tsx`
- Create: `components/site/bairros-destaque.tsx`
- Create: `lib/perez360/home.test.ts`

**Interfaces:**
- Consumes: `IMOVEIS_PEREZ`, `formatarMoeda` e query params aceitos por `/imoveis`.
- Produces: home pública em `/`, `CardImovel({ imovel, compacto? })` e `BuscaHero`.

- [ ] **Step 1: Escrever teste estático da home**

Em `lib/perez360/home.test.ts`, usar `renderToStaticMarkup`:

```ts
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "@/app/(site)/page";

it("apresenta busca, imóveis e confiança institucional", () => {
  const html = renderToStaticMarkup(createElement(HomePage));
  expect(html).toContain("Encontre o imóvel que combina com o seu momento");
  expect(html).toContain("Imóveis em destaque");
  expect(html).toContain("Mais de 35 anos");
  expect(html).toContain("PZ-1001");
});
```

- [ ] **Step 2: Executar e confirmar RED**

Run: `pnpm exec vitest run lib/perez360/home.test.ts`

Expected: FAIL porque a página e os componentes não existem.

- [ ] **Step 3: Criar o hero de busca**

`BuscaHero` será client component com abas Comprar, Alugar e Lançamentos, campo de bairro/código e submit para:

```ts
router.push(`/imoveis?finalidade=${finalidade}&busca=${encodeURIComponent(busca)}`);
```

O hero exibirá a imagem do `PZ-1001`, overlay escuro, selo “Londrina, Paraná” e o título definido no teste.

- [ ] **Step 4: Criar cards reutilizáveis de imóveis**

`CardImovel` deve usar `next/image`, exibir finalidade, código, bairro, preço, área, quartos e vagas, e ligar para `/imoveis/${imovel.codigo.toLowerCase()}`. O card deve ter foco visível e efeito de imagem limitado a hover em dispositivos que suportam hover.

- [ ] **Step 5: Montar todas as seções da home**

Ordem exata:

1. hero Busca Direta;
2. indicadores `35+ anos`, `1.200+ imóveis administrados`, `4,9/5 atendimento`;
3. seis imóveis em destaque;
4. quatro objetivos: comprar, alugar, anunciar, administrar;
5. bairros em destaque;
6. história Perez;
7. chamada de captação;
8. três depoimentos fictícios identificados como demonstração.

- [ ] **Step 6: Executar teste, lint e tipos**

Run: `pnpm exec vitest run lib/perez360/home.test.ts && pnpm lint -- 'app/(site)/page.tsx' components/site && pnpm exec tsc --noEmit`

Expected: código `0`.

- [ ] **Step 7: Commit**

```bash
git add 'app/(site)/page.tsx' components/site/busca-hero.tsx components/site/card-imovel.tsx components/site/secao-imoveis.tsx components/site/bairros-destaque.tsx lib/perez360/home.test.ts
git commit -m "feat: build Perez direct-search homepage"
```

---

### Task 4: Implementar o catálogo interativo de imóveis

**Files:**
- Create: `app/(site)/imoveis/page.tsx`
- Create: `components/site/catalogo-imoveis.tsx`
- Create: `components/site/filtros-imoveis.tsx`
- Create: `components/site/mapa-demonstrativo.tsx`
- Create: `components/site/favorito-imovel.tsx`
- Create: `lib/perez360/favoritos.ts`
- Create: `lib/perez360/favoritos.test.ts`

**Interfaces:**
- Consumes: `buscarImoveis`, `FiltrosImoveis`, `CardImovel`.
- Produces: `CatalogoImoveis`, `FiltrosImoveisForm`, `MapaDemonstrativo`, `lerFavoritos`, `alternarFavorito`.

- [ ] **Step 1: Testar favoritos locais como função pura**

```ts
import { expect, it } from "vitest";
import { alternarFavorito } from "./favoritos";

it("adiciona e remove um código favorito sem duplicar", () => {
  expect(alternarFavorito([], "PZ-1001")).toEqual(["PZ-1001"]);
  expect(alternarFavorito(["PZ-1001"], "PZ-1001")).toEqual([]);
  expect(alternarFavorito(["PZ-1001"], "PZ-1002")).toEqual(["PZ-1001", "PZ-1002"]);
});
```

- [ ] **Step 2: Executar e confirmar RED**

Run: `pnpm exec vitest run lib/perez360/favoritos.test.ts`

Expected: FAIL porque o módulo não existe.

- [ ] **Step 3: Implementar favoritos e botão acessível**

`alternarFavorito` será pura. `FavoritoImovel` sincroniza a lista em `localStorage` sob a chave `perez360:favoritos`, usa `aria-pressed` e texto acessível “Adicionar PZ-1001 aos favoritos”.

- [ ] **Step 4: Criar filtros desktop e mobile**

Os filtros serão controlados no client e incluirão finalidade, busca, tipo, bairro, preço máximo, quartos e vagas. Desktop usa uma coluna lateral; mobile usa `Sheet`. O botão “Limpar filtros” restaura:

```ts
const FILTROS_INICIAIS: FiltrosImoveis = { finalidade: "todos", tipo: "todos", bairro: "todos" };
```

- [ ] **Step 5: Criar catálogo e mapa visual**

`CatalogoImoveis` deve:

- ler `finalidade` e `busca` iniciais dos `searchParams` recebidos pela página server;
- alternar entre grade e `MapaDemonstrativo`;
- ordenar por relevância, menor preço, maior preço e maior área;
- mostrar contagem e estado vazio com ação para limpar filtros;
- renderizar 1, 2 ou 3 colunas conforme a largura.

O mapa deve ser um painel ilustrado com ruas em CSS e marcadores posicionados por um mapa estático `{ [codigo]: { x, y } }`, acompanhado de “Mapa demonstrativo — sem geolocalização real”.

- [ ] **Step 6: Validar catálogo**

Run: `pnpm exec vitest run lib/perez360/favoritos.test.ts lib/perez360/seletores.test.ts && pnpm lint -- 'app/(site)/imoveis/page.tsx' components/site && pnpm exec tsc --noEmit`

Expected: código `0`.

- [ ] **Step 7: Commit**

```bash
git add 'app/(site)/imoveis/page.tsx' components/site/catalogo-imoveis.tsx components/site/filtros-imoveis.tsx components/site/mapa-demonstrativo.tsx components/site/favorito-imovel.tsx lib/perez360/favoritos.ts lib/perez360/favoritos.test.ts
git commit -m "feat: add interactive property catalog"
```

---

### Task 5: Criar detalhe do imóvel e páginas institucionais

**Files:**
- Create: `app/(site)/imoveis/[codigo]/page.tsx`
- Create: `app/(site)/vender-alugar/page.tsx`
- Create: `app/(site)/sobre/page.tsx`
- Create: `app/(site)/contato/page.tsx`
- Create: `components/site/galeria-imovel.tsx`
- Create: `components/site/ficha-imovel.tsx`
- Create: `components/site/formulario-contato-imovel.tsx`
- Create: `components/site/formulario-demonstrativo.tsx`
- Create: `lib/perez360/detalhe.test.ts`

**Interfaces:**
- Consumes: `obterImovel`, `imoveisRelacionados`, `CardImovel`.
- Produces: rota dinâmica `/imoveis/[codigo]` e formulários que somente confirmam ações locais.

- [ ] **Step 1: Testar o lookup e a renderização da ficha**

Em `lib/perez360/detalhe.test.ts`, renderizar `FichaImovel` com `IMOVEIS_PEREZ[0]` e verificar título, código, preço, área, quartos, vagas e “Dados demonstrativos”.

- [ ] **Step 2: Executar e confirmar RED**

Run: `pnpm exec vitest run lib/perez360/detalhe.test.ts`

Expected: FAIL porque `FichaImovel` não existe.

- [ ] **Step 3: Implementar galeria e ficha**

`GaleriaImovel` terá uma imagem principal e quatro miniaturas em desktop; no celular, carrossel horizontal com snap. `FichaImovel` exibirá todas as características, comodidades, descrição, localização aproximada e selo de demonstração.

- [ ] **Step 4: Implementar a página dinâmica com params assíncronos**

Usar a assinatura exigida pelo Next.js 16:

```tsx
export default async function ImovelPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const imovel = obterImovel(codigo);
  if (!imovel) notFound();
  const relacionados = imoveisRelacionados(imovel, 3);
  return (
    <main>
      <GaleriaImovel imovel={imovel} />
      <FichaImovel imovel={imovel} />
      <FormularioContatoImovel imovel={imovel} />
      <SecaoImoveis titulo="Imóveis semelhantes" imoveis={relacionados} />
    </main>
  );
}
```

Implementar `generateStaticParams` com os 12 códigos e `generateMetadata` com título e descrição do imóvel.

- [ ] **Step 5: Criar contato demonstrativo**

O formulário solicita nome, telefone e mensagem. No submit, não envia rede; muda para um estado de sucesso “Interesse registrado nesta demonstração” e oferece link “Ver como chega ao atendimento” para `/inbox`.

- [ ] **Step 6: Criar páginas institucionais completas**

- `/vender-alugar`: benefícios, quatro etapas, serviços de administração e formulário demonstrativo;
- `/sobre`: história de 35+ anos, linha do tempo, valores, equipe fictícia e Londrina;
- `/contato`: Comercial, Administrativo, Recepção, endereço, horários, mapa ilustrado e atalhos.

Cada formulário reutiliza `FormularioDemonstrativo` e termina em confirmação local.

- [ ] **Step 7: Validar páginas públicas**

Run: `pnpm exec vitest run lib/perez360/detalhe.test.ts && pnpm lint -- 'app/(site)' components/site && pnpm exec tsc --noEmit`

Expected: código `0`.

- [ ] **Step 8: Commit**

```bash
git add 'app/(site)/imoveis/[codigo]/page.tsx' 'app/(site)/vender-alugar/page.tsx' 'app/(site)/sobre/page.tsx' 'app/(site)/contato/page.tsx' components/site lib/perez360/detalhe.test.ts
git commit -m "feat: complete public property journeys"
```

---

### Task 6: Expandir e tornar responsivo o shell do CRM

**Files:**
- Modify: `app/(crm)/layout.tsx`
- Modify: `components/crm/navegacao.tsx`
- Create: `components/crm/navegacao-mobile.tsx`
- Create: `components/crm/seletor-modulo.tsx`
- Create: `lib/perez360/navegacao.ts`
- Create: `lib/perez360/navegacao.test.ts`

**Interfaces:**
- Produces: `GRUPOS_NAVEGACAO`, `Navegacao`, `NavegacaoMobile` e `SeletorModulo`.
- Consumes: todas as rotas internas definidas nas Tasks 7 e 8.

- [ ] **Step 1: Testar cobertura e unicidade das rotas do menu**

```ts
import { expect, it } from "vitest";
import { GRUPOS_NAVEGACAO } from "./navegacao";

it("expõe cada rota interna uma única vez", () => {
  const rotas = GRUPOS_NAVEGACAO.flatMap((grupo) => grupo.itens.map((item) => item.href));
  expect(new Set(rotas).size).toBe(rotas.length);
  expect(rotas).toEqual(expect.arrayContaining([
    "/dashboard", "/inbox", "/pipelines", "/contatos", "/carteira",
    "/captacoes", "/locacoes", "/manutencoes", "/cobrancas", "/financeiro",
    "/atendentes", "/configuracoes"
  ]));
});
```

- [ ] **Step 2: Executar e confirmar RED**

Run: `pnpm exec vitest run lib/perez360/navegacao.test.ts`

Expected: FAIL porque o modelo de navegação não existe.

- [ ] **Step 3: Modelar navegação agrupada**

Criar grupos `Visão geral`, `Relacionamento`, `Imóveis e locação` e `Administração`. Cada item terá `href`, `rotulo`, `icone` como string e `adicional?: boolean`. Cobranças e Financeiro recebem `adicional: true` e tooltip “Módulo demonstrativo”.

- [ ] **Step 4: Atualizar sidebar desktop**

A sidebar passa para `w-60`, rolagem interna, grupos com títulos discretos e link de retorno ao site. Manter “Ambiente de demonstração” no rodapé. `Navegacao` converte a chave de ícone para componentes Lucide por um mapa explícito.

- [ ] **Step 5: Criar navegação móvel**

Em larguras menores que `md`, esconder a sidebar e mostrar header com `LogoPerez`, `SeletorModulo` e `NavegacaoMobile` em `Sheet`. O conteúdo deve usar `min-h-0`, rolar por página e nunca depender de largura fixa.

- [ ] **Step 6: Validar shell**

Run: `pnpm exec vitest run lib/perez360/navegacao.test.ts && pnpm lint -- 'app/(crm)/layout.tsx' components/crm lib/perez360/navegacao.ts && pnpm exec tsc --noEmit`

Expected: código `0`.

- [ ] **Step 7: Commit**

```bash
git add 'app/(crm)/layout.tsx' components/crm/navegacao.tsx components/crm/navegacao-mobile.tsx components/crm/seletor-modulo.tsx lib/perez360/navegacao.ts lib/perez360/navegacao.test.ts
git commit -m "feat: expand responsive Perez 360 navigation"
```

---

### Task 7: Criar contatos, captações, locações e manutenções

**Files:**
- Create: `app/(crm)/contatos/page.tsx`
- Create: `app/(crm)/captacoes/page.tsx`
- Create: `app/(crm)/locacoes/page.tsx`
- Create: `app/(crm)/manutencoes/page.tsx`
- Modify: `app/(crm)/carteira/page.tsx`
- Create: `components/operacao/cabecalho-modulo.tsx`
- Create: `components/operacao/lista-contatos.tsx`
- Create: `components/operacao/quadro-captacoes.tsx`
- Create: `components/operacao/tabela-contratos.tsx`
- Create: `components/operacao/quadro-manutencoes.tsx`
- Create: `lib/perez360/operacao.ts`
- Create: `lib/perez360/operacao.test.ts`

**Interfaces:**
- Consumes: dados compartilhados de `lib/perez360/dados.ts`.
- Produces: `resumoContratos`, `agruparCaptacoes`, `agruparManutencoes` e quatro módulos internos.

- [ ] **Step 1: Testar resumos operacionais**

Criar casos que garantam:

```ts
expect(resumoContratos(CONTRATOS_PEREZ)).toEqual({
  ativos: 3,
  reajustesProximos: 1,
  vencimentosProximos: 1,
  atencao: 1,
});
expect(agruparManutencoes(MANUTENCOES_PEREZ).urgente.length).toBeGreaterThan(0);
```

- [ ] **Step 2: Executar e confirmar RED**

Run: `pnpm exec vitest run lib/perez360/operacao.test.ts`

Expected: FAIL porque `operacao.ts` não existe.

- [ ] **Step 3: Implementar seletores operacionais**

As funções devem ser puras e retornar novos arrays. Captações agrupam `avaliacao`, `documentacao`, `fotografia` e `publicacao`. Manutenções agrupam `urgente`, `alta`, `normal` e `concluida`. Contratos classificam atenção por datas fixas do conjunto de demonstração, não por data corrente do navegador.

- [ ] **Step 4: Construir Pessoas e Captações**

`/contatos` exibe busca, chips de papel e cartões responsivos com telefone, e-mail e vínculos. `/captacoes` exibe quadro horizontal com cards ligados a proprietário, imóvel, responsável e próxima ação. Mudanças de coluna são locais e restauradas ao recarregar.

- [ ] **Step 5: Construir Locações e Manutenções**

`/locacoes` exibe quatro KPIs, tabela desktop e cards mobile. `/manutencoes` exibe quadro por prioridade/status, com imóvel, locatário, descrição, prestador fictício e prazo. Um diálogo permite simular a abertura de chamado sem persistência externa.

- [ ] **Step 6: Integrar a carteira existente ao novo domínio**

Modificar `app/(crm)/carteira/page.tsx` para usar `IMOVEIS_PEREZ`, incluir imagem, status de publicação, proprietário e desempenho demonstrativo. Preservar busca e cards de resumo; no celular, substituir tabela por cards.

- [ ] **Step 7: Validar módulos operacionais**

Run: `pnpm exec vitest run lib/perez360/operacao.test.ts && pnpm lint -- 'app/(crm)' components/operacao lib/perez360/operacao.ts && pnpm exec tsc --noEmit`

Expected: código `0`.

- [ ] **Step 8: Commit**

```bash
git add 'app/(crm)/contatos/page.tsx' 'app/(crm)/captacoes/page.tsx' 'app/(crm)/locacoes/page.tsx' 'app/(crm)/manutencoes/page.tsx' 'app/(crm)/carteira/page.tsx' components/operacao lib/perez360/operacao.ts lib/perez360/operacao.test.ts
git commit -m "feat: add Perez property operation modules"
```

---

### Task 8: Completar financeiro, configurações e dashboard executivo

**Files:**
- Create: `app/(crm)/financeiro/page.tsx`
- Create: `app/(crm)/configuracoes/page.tsx`
- Modify: `app/(crm)/dashboard/page.tsx`
- Modify: `app/(crm)/cobrancas/page.tsx`
- Create: `components/gestao/resumo-financeiro.tsx`
- Create: `components/gestao/alertas-executivos.tsx`
- Create: `components/gestao/aviso-demonstracao.tsx`
- Create: `lib/perez360/indicadores.ts`
- Create: `lib/perez360/indicadores.test.ts`

**Interfaces:**
- Consumes: lançamentos, contratos, imóveis e dados existentes do CRM.
- Produces: `calcularResumoFinanceiro`, `calcularIndicadoresExecutivos`, páginas `/financeiro` e `/configuracoes`.

- [ ] **Step 1: Testar indicadores determinísticos**

```ts
const resumo = calcularResumoFinanceiro(LANCAMENTOS_PEREZ);
expect(resumo).toMatchObject({ recebimentosPrevistos: expect.any(Number), repassesPrevistos: expect.any(Number) });
expect(resumo.recebimentosPrevistos).toBeGreaterThan(resumo.repassesPrevistos);
expect(calcularIndicadoresExecutivos()).toMatchObject({ imoveisAtivos: 12, ocupacao: expect.any(Number) });
```

- [ ] **Step 2: Executar e confirmar RED**

Run: `pnpm exec vitest run lib/perez360/indicadores.test.ts`

Expected: FAIL porque as funções não existem.

- [ ] **Step 3: Implementar indicadores puros**

Calcular recebimentos, repasses, pendências, ocupação, contratos com atenção e imóveis por finalidade. Não usar `new Date()` sem argumento; toda referência temporal deve vir de `DATA_DEMO = new Date("2026-08-04T10:00:00-03:00")`.

- [ ] **Step 4: Criar financeiro e reforçar avisos de demonstração**

`/financeiro` terá KPIs, gráfico de barras, tabela de lançamentos e aviso fixo “Visão demonstrativa — não movimenta valores”. Botões usam “Visualizar exemplo” e “Simular relatório”. `/cobrancas` mantém o escopo atual e recebe `AvisoDemonstracao` no topo.

- [ ] **Step 5: Criar configurações visuais**

`/configuracoes` apresenta setores, filas, horários e preferências com switches locais. Cada seção informa “Alterações somente nesta demonstração” e oferece “Restaurar exemplo”.

- [ ] **Step 6: Evoluir dashboard executivo**

Adicionar imóveis ativos, ocupação, visitas agendadas e contratos com atenção aos KPIs existentes. Criar uma linha de funil comercial, gráfico de origem dos leads, alertas executivos e atalhos para os principais módulos. Em mobile, todos os grids devem cair para uma coluna.

- [ ] **Step 7: Validar gestão**

Run: `pnpm exec vitest run lib/perez360/indicadores.test.ts && pnpm lint -- 'app/(crm)/financeiro/page.tsx' 'app/(crm)/configuracoes/page.tsx' 'app/(crm)/dashboard/page.tsx' 'app/(crm)/cobrancas/page.tsx' components/gestao && pnpm exec tsc --noEmit`

Expected: código `0`.

- [ ] **Step 8: Commit**

```bash
git add 'app/(crm)/financeiro/page.tsx' 'app/(crm)/configuracoes/page.tsx' 'app/(crm)/dashboard/page.tsx' 'app/(crm)/cobrancas/page.tsx' components/gestao lib/perez360/indicadores.ts lib/perez360/indicadores.test.ts
git commit -m "feat: complete Perez executive demo modules"
```

---

### Task 9: Criar os portais do proprietário e locatário

**Files:**
- Create: `app/(portal)/portal/layout.tsx`
- Create: `app/(portal)/portal/page.tsx`
- Create: `app/(portal)/portal/proprietario/page.tsx`
- Create: `app/(portal)/portal/locatario/page.tsx`
- Create: `components/portal/cabecalho-portal.tsx`
- Create: `components/portal/seletor-perfil.tsx`
- Create: `components/portal/cartao-documento.tsx`
- Create: `components/portal/resumo-proprietario.tsx`
- Create: `components/portal/resumo-locatario.tsx`
- Create: `components/portal/novo-chamado.tsx`
- Create: `lib/perez360/portal.test.ts`

**Interfaces:**
- Consumes: pessoas, imóveis, contratos, lançamentos e manutenções compartilhados.
- Produces: `/portal`, `/portal/proprietario`, `/portal/locatario` e componentes de resumo.

- [ ] **Step 1: Escrever testes estáticos dos dois perfis**

Usar `renderToStaticMarkup` para confirmar que o proprietário exibe “Minha carteira”, “Repasses demonstrativos” e o código `PZ-1001`; o locatário exibe “Meu contrato”, “Próximo vencimento” e “Solicitar manutenção”.

- [ ] **Step 2: Executar e confirmar RED**

Run: `pnpm exec vitest run lib/perez360/portal.test.ts`

Expected: FAIL porque os componentes não existem.

- [ ] **Step 3: Criar shell e seletor de perfil**

O portal terá cabeçalho simplificado, botão de retorno ao site, selo “Portal demonstrativo” e navegação mobile-first. `/portal` apresenta duas opções claras com links para os perfis, sem formulário de senha.

- [ ] **Step 4: Construir portal do proprietário**

Mostrar saudação, carteira com ocupação, repasses fictícios, documentos, contratos e manutenções. Os dados devem referenciar as mesmas entidades vistas no CRM. Ações de download exibem toast “Documento demonstrativo”.

- [ ] **Step 5: Construir portal do locatário**

Mostrar imóvel, contrato, próximo vencimento, boletos fictícios, documentos, vistoria e manutenções. `NovoChamado` abre diálogo, valida assunto e descrição e adiciona um cartão apenas ao estado local.

- [ ] **Step 6: Validar portais**

Run: `pnpm exec vitest run lib/perez360/portal.test.ts && pnpm lint -- 'app/(portal)' components/portal && pnpm exec tsc --noEmit`

Expected: código `0`.

- [ ] **Step 7: Commit**

```bash
git add 'app/(portal)' components/portal lib/perez360/portal.test.ts
git commit -m "feat: add owner and tenant demo portals"
```

---

### Task 10: Integrar a narrativa e concluir a qualidade da apresentação

**Files:**
- Create: `components/crm/tour-demonstracao.tsx`
- Create: `components/crm/restaurar-demonstracao.tsx`
- Modify: `app/(site)/page.tsx`
- Modify: `app/(crm)/layout.tsx`
- Modify: `components/inbox/lista-conversas.tsx`
- Modify: `components/inbox/thread.tsx`
- Modify: `app/(crm)/pipelines/page.tsx`
- Modify: `README.md`
- Create: `docs/perez-360-roteiro-apresentacao.md`

**Interfaces:**
- Consumes: rotas públicas, internas e portais já implementadas.
- Produces: tour de oito passos, restauração de estado e roteiro de apresentação de 10–15 minutos.

- [ ] **Step 1: Criar o tour visual por módulos**

`TourDemonstracao` será um `Dialog` com oito links numerados:

```ts
const PASSOS_TOUR = [
  ["Novo site", "/"],
  ["Catálogo e imóvel PZ-1001", "/imoveis/pz-1001"],
  ["Atendimento", "/inbox"],
  ["CRM comercial", "/pipelines"],
  ["Carteira e locação", "/carteira"],
  ["Manutenção e financeiro", "/manutencoes"],
  ["Portais", "/portal"],
  ["Gestão", "/dashboard"],
] as const;
```

Exibir o acesso no header interno e na home, com o rótulo “Iniciar apresentação”.

- [ ] **Step 2: Conectar visualmente a jornada principal**

- Home e PZ-1001 usam o mesmo imóvel da carteira;
- o formulário do imóvel oferece link ao inbox;
- a inbox contém conversa de interesse no PZ-1001;
- o pipeline contém oportunidade da mesma pessoa e imóvel;
- o portal do proprietário referencia o mesmo imóvel;
- o dashboard inclui a oportunidade e o contrato nos resumos.

Não criar API entre as telas; alinhar IDs nos dados mockados.

- [ ] **Step 3: Adicionar restauração de demonstração**

`RestaurarDemonstracao` remove somente chaves prefixadas por `perez360:` e recarrega a rota atual após confirmação:

```ts
Object.keys(localStorage)
  .filter((chave) => chave.startsWith("perez360:"))
  .forEach((chave) => localStorage.removeItem(chave));
window.location.reload();
```

- [ ] **Step 4: Corrigir responsividade das telas CRM existentes**

- Inbox: no mobile, lista e conversa ocupam a tela alternadamente com botão voltar;
- Pipelines: colunas com `min-w-[18rem]` e rolagem horizontal contida;
- Cobranças e atendentes: tabelas tornam-se cartões abaixo de `md`;
- Simulação: celular e central empilham sem cortar o conteúdo;
- todos os headers aceitam quebra e ações em segunda linha.

- [ ] **Step 5: Fazer auditoria manual de acessibilidade e overflow**

Verificar por teclado e em larguras `390`, `768`, `1280` e `1440`:

- foco visível;
- menu móvel;
- filtros do catálogo;
- formulário do imóvel;
- inbox;
- pipelines;
- portais;
- ausência de overflow horizontal acidental;
- imagens com alt descritivo;
- controles com `aria-label` quando não houver texto visível.

- [ ] **Step 6: Documentar uso e roteiro**

Atualizar `README.md` com scripts, rotas, natureza demonstrativa e como restaurar dados. Criar `docs/perez-360-roteiro-apresentacao.md` com duração prevista:

- 0–3 min: site e imóvel;
- 3–6 min: atendimento e CRM;
- 6–9 min: carteira, locação e manutenção;
- 9–12 min: portais e financeiro;
- 12–15 min: dashboard e encerramento.

- [ ] **Step 7: Executar verificação completa**

Run:

```bash
pnpm test
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Expected: todos encerram com código `0`.

- [ ] **Step 8: Fazer smoke test das rotas**

Com `pnpm dev`, abrir e verificar sem erros:

```text
/
/imoveis
/imoveis/pz-1001
/vender-alugar
/sobre
/contato
/dashboard
/inbox
/simulacao
/pipelines
/contatos
/carteira
/captacoes
/locacoes
/manutencoes
/cobrancas
/financeiro
/atendentes
/configuracoes
/portal
/portal/proprietario
/portal/locatario
```

- [ ] **Step 9: Commit**

```bash
git add components/crm/tour-demonstracao.tsx components/crm/restaurar-demonstracao.tsx 'app/(crm)/layout.tsx' components/inbox/lista-conversas.tsx components/inbox/thread.tsx 'app/(crm)/pipelines/page.tsx' README.md docs/perez-360-roteiro-apresentacao.md
git commit -m "feat: finalize Perez 360 visual presentation"
```
