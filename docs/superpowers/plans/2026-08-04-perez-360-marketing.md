# Perez 360 Marketing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir uma Central de Marketing responsiva para o social media interno e o gestor de tráfego, com IA simulada, calendário, campanhas, biblioteca e aprovações integradas aos imóveis Perez 360.

**Architecture:** Um domínio puro em `lib/perez360/marketing.ts` concentra tipos, dados fictícios, métricas, filtros, progressão de status e geração determinística do kit de conteúdo. A rota cliente `/marketing` usa um controlador de abas e componentes focados por área, consumindo o mesmo catálogo `IMOVEIS_PEREZ` do site e da carteira. Todo estado mutável permanece local à página e nenhuma ação transmite dados ou chama serviços externos.

**Tech Stack:** Next.js 16.2.12, React 19.2.4, TypeScript 5, Tailwind CSS 4, Lucide React, shadcn/ui e Vitest 4.1.10.

## Global Constraints

- Entrega exclusivamente front-end e demonstrativa.
- Canais cobertos: Instagram, Facebook, Google, TikTok e YouTube.
- Nenhuma IA, publicação, compra de mídia, cobrança ou integração externa real.
- Consumir os imóveis existentes de `IMOVEIS_PEREZ`; não duplicar códigos, preços ou imagens.
- Manter a identidade Perez em vermelho profundo, branco, grafite e tons neutros.
- Interface em português brasileiro, responsiva e sem overflow horizontal.
- Usar apenas dependências já instaladas.
- Não alterar nem incluir em commits `.superpowers/`, `pnpm-lock.yaml` ou `pnpm-workspace.yaml`.
- Ler a documentação relevante em `node_modules/next/dist/docs/` antes de criar a rota ou modificar componentes Next.js.

---

### Task 1: Criar o domínio e as regras de marketing

**Files:**
- Create: `lib/perez360/marketing.ts`
- Create: `lib/perez360/marketing.test.ts`

**Interfaces:**
- Consumes: `IMOVEIS_PEREZ` de `lib/perez360/dados.ts`.
- Produces: `CanalMarketing`, `StatusConteudo`, `CampanhaMarketing`, `ConteudoMarketing`, `EventoMarketing`, `ConfiguracaoGeracao`, `KitConteudoIA`, `CAMPANHAS_MARKETING`, `CONTEUDOS_MARKETING`, `EVENTOS_MARKETING`, `calcularResumoMarketing()`, `filtrarConteudos()`, `gerarKitConteudo()`, `proximoStatusConteudo()` e `formatarPercentual()`.

- [ ] **Step 1: Escrever os testes que descrevem métricas, filtros, vínculos e geração**

Criar `lib/perez360/marketing.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { IMOVEIS_PEREZ } from "./dados";
import {
  CAMPANHAS_MARKETING,
  CONTEUDOS_MARKETING,
  calcularResumoMarketing,
  filtrarConteudos,
  gerarKitConteudo,
  proximoStatusConteudo,
} from "./marketing";

describe("marketing Perez 360", () => {
  it("mantém campanhas vinculadas a imóveis existentes", () => {
    const ids = new Set(IMOVEIS_PEREZ.map((item) => item.id));
    expect(CAMPANHAS_MARKETING.filter((item) => item.imovelId).every((item) => ids.has(item.imovelId!))).toBe(true);
  });

  it("deriva investimento, leads e CPL das campanhas", () => {
    const resumo = calcularResumoMarketing(CAMPANHAS_MARKETING, CONTEUDOS_MARKETING);
    expect(resumo.investimento).toBeGreaterThan(0);
    expect(resumo.leads).toBeGreaterThan(0);
    expect(resumo.cpl).toBeCloseTo(resumo.investimento / resumo.leads, 2);
  });

  it("filtra conteúdos por canal, status e imóvel", () => {
    const base = CONTEUDOS_MARKETING[0];
    expect(filtrarConteudos(CONTEUDOS_MARKETING, { canal: base.canais[0], status: base.status, imovelId: base.imovelId }))
      .toEqual(expect.arrayContaining([base]));
  });

  it("gera um kit determinístico para o imóvel principal", () => {
    const kit = gerarKitConteudo({
      imovelId: "imovel-01",
      objetivo: "vender",
      publico: "Famílias que buscam alto padrão em Londrina",
      canais: ["instagram", "facebook", "google", "tiktok", "youtube"],
      formato: "carrossel",
      tom: "sofisticado",
      cta: "Agende sua visita",
    });
    expect(kit.codigoImovel).toBe("PZ-1001");
    expect(kit.legenda).toContain("PZ-1001");
    expect(kit.titulosGoogle).toHaveLength(3);
    expect(kit.roteiroVideo.length).toBeGreaterThan(3);
  });

  it("avança somente pela sequência de aprovação", () => {
    expect(proximoStatusConteudo("rascunho")).toBe("revisao");
    expect(proximoStatusConteudo("publicado")).toBe("publicado");
  });
});
```

- [ ] **Step 2: Executar o teste e confirmar RED**

Run: `pnpm exec vitest run lib/perez360/marketing.test.ts`

Expected: FAIL porque `./marketing` ainda não existe.

- [ ] **Step 3: Implementar tipos, dados e funções puras**

Criar `lib/perez360/marketing.ts` com os contratos:

```ts
export type CanalMarketing = "instagram" | "facebook" | "google" | "tiktok" | "youtube";
export type StatusConteudo = "rascunho" | "revisao" | "aprovado" | "agendado" | "publicado";
export type StatusCampanha = "rascunho" | "ativa" | "pausada" | "concluida";
export type ObjetivoMarketing = "vender" | "alugar" | "captar" | "marca" | "visitas";
export type FormatoMarketing = "post" | "carrossel" | "stories" | "video_curto" | "busca" | "video";
export type TomMarketing = "sofisticado" | "proximo" | "direto" | "institucional";

export type CampanhaMarketing = {
  id: string;
  nome: string;
  canal: CanalMarketing;
  objetivo: string;
  imovelId?: string;
  periodo: string;
  publico: string;
  orcamento: number;
  investimento: number;
  alcance: number;
  impressoes: number;
  cliques: number;
  leads: number;
  conversoes: number;
  status: StatusCampanha;
};

export type ConteudoMarketing = {
  id: string;
  titulo: string;
  descricao: string;
  canais: CanalMarketing[];
  formato: FormatoMarketing;
  status: StatusConteudo;
  responsavel: string;
  data: string;
  imovelId?: string;
  observacao?: string;
};

export type EventoMarketing = {
  id: string;
  dia: number;
  horario: string;
  titulo: string;
  canal: CanalMarketing;
  tipo: "organico" | "pago";
  status: StatusConteudo;
  responsavel: string;
  imovelId?: string;
};

export type ConfiguracaoGeracao = {
  imovelId: string;
  objetivo: ObjetivoMarketing;
  publico: string;
  canais: CanalMarketing[];
  formato: FormatoMarketing;
  tom: TomMarketing;
  cta: string;
};

export type KitConteudoIA = {
  codigoImovel: string;
  conceito: string;
  legenda: string;
  carrossel: string[];
  roteiroVideo: string[];
  titulosGoogle: string[];
  descricaoGoogle: string;
  textoTikTok: string;
  textoYoutube: string;
  hashtags: string[];
  cta: string;
  aderenciaMarca: number;
  imagens: string[];
};
```

Adicionar seis campanhas, oito conteúdos e dez eventos cobrindo todos os canais e status. Implementar cálculos seguros:

```ts
const dividir = (numerador: number, denominador: number) => denominador > 0 ? numerador / denominador : 0;

export const calcularResumoMarketing = (campanhas: CampanhaMarketing[], conteudos: ConteudoMarketing[]) => {
  const investimento = campanhas.reduce((soma, item) => soma + item.investimento, 0);
  const leads = campanhas.reduce((soma, item) => soma + item.leads, 0);
  return {
    investimento,
    leads,
    cpl: dividir(investimento, leads),
    campanhasAtivas: campanhas.filter((item) => item.status === "ativa").length,
    aguardandoAprovacao: conteudos.filter((item) => item.status === "revisao").length,
    planejados: conteudos.length,
  };
};
```

`gerarKitConteudo()` deve buscar o imóvel por `imovelId`, lançar `Error("Imóvel não encontrado")` quando ausente e construir todas as strings apenas com dados da configuração e do imóvel.

- [ ] **Step 4: Executar teste e TypeScript**

Run:

```bash
pnpm exec vitest run lib/perez360/marketing.test.ts
pnpm exec tsc --noEmit
```

Expected: ambos encerram com código `0`.

- [ ] **Step 5: Commit**

```bash
git add lib/perez360/marketing.ts lib/perez360/marketing.test.ts
git commit -m "feat: add Perez marketing demo domain"
```

---

### Task 2: Integrar Marketing à navegação do CRM

**Files:**
- Modify: `lib/perez360/navegacao.ts`
- Modify: `lib/perez360/navegacao.test.ts`
- Modify: `components/crm/navegacao.tsx`

**Interfaces:**
- Consumes: `GRUPOS_NAVEGACAO`, `IconeNavegacao` e `ICONES_NAVEGACAO` existentes.
- Produces: item `{ href: "/marketing", rotulo: "Marketing", icone: "marketing" }` acessível no menu lateral, menu móvel e seletor de módulo.

- [ ] **Step 1: Ampliar o teste de navegação**

Adicionar ao primeiro teste de `lib/perez360/navegacao.test.ts`:

```ts
expect(rotas).toContain("/marketing");
const marketing = GRUPOS_NAVEGACAO.flatMap((grupo) => grupo.itens).find((item) => item.href === "/marketing");
expect(marketing).toEqual({ href: "/marketing", rotulo: "Marketing", icone: "marketing" });
```

- [ ] **Step 2: Executar o teste e confirmar RED**

Run: `pnpm exec vitest run lib/perez360/navegacao.test.ts`

Expected: FAIL porque `/marketing` ainda não está em `GRUPOS_NAVEGACAO`.

- [ ] **Step 3: Adicionar o item e o ícone**

Em `lib/perez360/navegacao.ts`, incluir `"marketing"` em `IconeNavegacao` e adicionar um grupo entre `Relacionamento` e `Imóveis e locação`:

```ts
{
  rotulo: "Comunicação",
  itens: [{ href: "/marketing", rotulo: "Marketing", icone: "marketing" }],
},
```

Em `components/crm/navegacao.tsx`, importar `Megaphone` e mapear:

```ts
marketing: Megaphone,
```

- [ ] **Step 4: Executar o teste e TypeScript**

Run:

```bash
pnpm exec vitest run lib/perez360/navegacao.test.ts
pnpm exec tsc --noEmit
```

Expected: ambos encerram com código `0`.

- [ ] **Step 5: Commit**

```bash
git add lib/perez360/navegacao.ts lib/perez360/navegacao.test.ts components/crm/navegacao.tsx
git commit -m "feat: add marketing to Perez CRM navigation"
```

---

### Task 3: Construir o shell, as abas e a visão geral

**Files:**
- Create: `app/(crm)/marketing/page.tsx`
- Create: `components/marketing/central-marketing.tsx`
- Create: `components/marketing/navegacao-marketing.tsx`
- Create: `components/marketing/resumo-marketing.tsx`

**Interfaces:**
- Consumes: `CAMPANHAS_MARKETING`, `CONTEUDOS_MARKETING`, `EVENTOS_MARKETING` e `calcularResumoMarketing()`.
- Produces: `CentralMarketing`, tipo local `AbaMarketing` e visão geral responsiva.

- [ ] **Step 1: Ler a documentação da rota cliente**

Run:

```bash
sed -n '1,220p' node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md
sed -n '1,180p' node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
```

Expected: confirmar que `page.tsx` pode renderizar um Client Component isolado e que estado interativo exige `"use client"`.

- [ ] **Step 2: Criar a página fina e o controlador de abas**

`app/(crm)/marketing/page.tsx`:

```tsx
import { CentralMarketing } from "@/components/marketing/central-marketing";

export default function MarketingPage() {
  return <CentralMarketing />;
}
```

`CentralMarketing` deve manter `aba`, `conteudos` e `kitGerado` em estado local. As abas válidas são `resumo`, `estudio`, `calendario`, `trafego`, `conteudos` e `aprovacoes`.

- [ ] **Step 3: Implementar navegação interna responsiva**

`NavegacaoMarketing` recebe:

```ts
type Props = {
  aba: AbaMarketing;
  aoAlterar: (aba: AbaMarketing) => void;
};
```

No desktop, renderizar seis botões com `aria-pressed`. Abaixo de `sm`, esconder os botões e renderizar `<select aria-label="Área de marketing">` com as mesmas opções.

- [ ] **Step 4: Implementar a visão geral**

`ResumoMarketing` deve renderizar:

- seis cards de indicadores;
- próximos quatro eventos por dia e horário;
- barras por canal calculadas pelo número de conteúdos;
- três campanhas ativas;
- uma recomendação demonstrativa destacada.

Usar `formatarMoeda()` de `lib/perez360/seletores.ts` e `formatarPercentual()` do domínio de marketing.

- [ ] **Step 5: Executar verificação estática**

Run:

```bash
pnpm exec tsc --noEmit
pnpm lint
```

Expected: ambos encerram com código `0`.

- [ ] **Step 6: Commit**

```bash
git add 'app/(crm)/marketing/page.tsx' components/marketing/central-marketing.tsx components/marketing/navegacao-marketing.tsx components/marketing/resumo-marketing.tsx
git commit -m "feat: add Perez marketing overview"
```

---

### Task 4: Implementar o Estúdio IA demonstrativo

**Files:**
- Create: `components/marketing/estudio-ia.tsx`
- Create: `components/marketing/preview-conteudo.tsx`
- Modify: `components/marketing/central-marketing.tsx`

**Interfaces:**
- Consumes: `IMOVEIS_PEREZ`, `ConfiguracaoGeracao`, `KitConteudoIA` e `gerarKitConteudo()`.
- Produces: `EstudioIA` com callback `aoEnviarAprovacao(kit: KitConteudoIA): void` e `PreviewConteudo`.

- [ ] **Step 1: Criar o formulário de configuração**

`EstudioIA` mantém configuração com `imovelId` inicialmente igual a `imovel-01`, todos os cinco canais selecionados, formato `carrossel`, tom `sofisticado` e CTA `Agende sua visita`.

O formulário deve usar controles nativos com rótulos visíveis. Canais usam botões `aria-pressed`, permitindo alternância sem deixar a lista vazia.

- [ ] **Step 2: Implementar a geração com estado visual**

Ao clicar em `Gerar campanha com IA`, definir `gerando=true`, gerar o kit com `gerarKitConteudo()` e atualizar o resultado no próximo ciclo de renderização com `window.setTimeout(..., 650)`. Enquanto isso, renderizar texto `Criando variações para cada canal...` e desabilitar o botão.

Não usar `fetch`, Server Action ou API route.

- [ ] **Step 3: Construir as prévias por canal**

`PreviewConteudo` deve ter abas internas para Instagram/Facebook, Google, TikTok e YouTube e mostrar:

- imagem principal do imóvel com `next/image`;
- legenda e hashtags;
- cinco slides do carrossel;
- títulos e descrição do Google;
- roteiro de vídeo em passos;
- aderência à marca em barra percentual;
- botões `Salvar rascunho` e `Enviar para aprovação` com aviso de ação local.

- [ ] **Step 4: Integrar ao controlador**

`CentralMarketing` deve passar o kit e inserir um novo `ConteudoMarketing` em status `revisao` quando o callback de aprovação for acionado. O novo item usa ID `conteudo-ia-${Date.now()}`, o imóvel e os canais do kit, responsável `Marina Costa` e data `2026-08-12`.

- [ ] **Step 5: Executar testes e verificação estática**

Run:

```bash
pnpm exec vitest run lib/perez360/marketing.test.ts
pnpm exec tsc --noEmit
pnpm lint
```

Expected: todos encerram com código `0`.

- [ ] **Step 6: Commit**

```bash
git add components/marketing/estudio-ia.tsx components/marketing/preview-conteudo.tsx components/marketing/central-marketing.tsx
git commit -m "feat: add visual AI marketing studio"
```

---

### Task 5: Implementar calendário e gestão de tráfego

**Files:**
- Create: `components/marketing/calendario-editorial.tsx`
- Create: `components/marketing/gestao-trafego.tsx`
- Create: `components/marketing/canal-marketing.tsx`
- Modify: `components/marketing/central-marketing.tsx`

**Interfaces:**
- Consumes: `EVENTOS_MARKETING`, `CAMPANHAS_MARKETING`, `CanalMarketing`, `formatarPercentual()` e `formatarMoeda()`.
- Produces: calendário mensal de agosto de 2026 e painel de campanhas pagas.

- [ ] **Step 1: Criar o componente compartilhado de canal**

`CanalMarketing` recebe `canal`, `compacto?` e renderiza nome, ícone Lucide e cor consistente. O mapeamento é:

```ts
instagram: { nome: "Instagram", cor: "text-fuchsia-700 bg-fuchsia-50" }
facebook: { nome: "Facebook", cor: "text-blue-700 bg-blue-50" }
google: { nome: "Google Ads", cor: "text-emerald-700 bg-emerald-50" }
tiktok: { nome: "TikTok", cor: "text-zinc-900 bg-zinc-100" }
youtube: { nome: "YouTube", cor: "text-red-700 bg-red-50" }
```

- [ ] **Step 2: Construir o calendário editorial**

Renderizar cabeçalho `Agosto de 2026`, legenda e grade de 31 dias. Cada dia mostra no máximo dois eventos e um contador `+N` para excedentes. No celular, usar `min-w-[56rem]` dentro de um contêiner `overflow-x-auto`, sem aumentar `documentElement.scrollWidth`.

Abaixo da grade, renderizar os próximos cinco eventos como cards empilhados.

- [ ] **Step 3: Construir gestão de tráfego**

Renderizar cards por campanha com status, canal, progresso de orçamento e métricas CTR, CPC, leads e CPL calculadas a partir dos dados. Incluir quatro recomendações simuladas, sempre rotuladas `Sugestão da IA · demonstração`.

- [ ] **Step 4: Integrar as áreas à central**

Quando `aba === "calendario"`, renderizar `CalendarioEditorial`. Quando `aba === "trafego"`, renderizar `GestaoTrafego`.

- [ ] **Step 5: Executar verificação estática**

Run:

```bash
pnpm exec tsc --noEmit
pnpm lint
```

Expected: ambos encerram com código `0`.

- [ ] **Step 6: Commit**

```bash
git add components/marketing/calendario-editorial.tsx components/marketing/gestao-trafego.tsx components/marketing/canal-marketing.tsx components/marketing/central-marketing.tsx
git commit -m "feat: add marketing calendar and traffic management"
```

---

### Task 6: Implementar biblioteca, aprovações e concluir a entrega

**Files:**
- Create: `components/marketing/biblioteca-conteudos.tsx`
- Create: `components/marketing/fluxo-aprovacoes.tsx`
- Modify: `components/marketing/central-marketing.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: `ConteudoMarketing`, `filtrarConteudos()` e `proximoStatusConteudo()`.
- Produces: biblioteca filtrável, fluxo de aprovação local e documentação do módulo.

- [ ] **Step 1: Construir a biblioteca filtrável**

`BibliotecaConteudos` recebe `conteudos: ConteudoMarketing[]` e mantém filtros `canal`, `status`, `formato` e `imovelId`. As opções `todos` removem o filtro. O estado vazio mostra `Nenhum conteúdo com esses filtros` e botão `Limpar filtros`.

Cada card exibe imagem do imóvel quando houver, canais, formato, status, responsável e data. Conteúdo sem imóvel usa um gradiente Perez com a palavra `PEREZ`.

- [ ] **Step 2: Construir o fluxo de aprovações**

`FluxoAprovacoes` recebe:

```ts
type Props = {
  conteudos: ConteudoMarketing[];
  aoAvancar: (id: string) => void;
};
```

Renderizar cinco colunas em um contêiner horizontal controlado. Cada card mostra título, responsável, observação e botão com o próximo status. Conteúdos publicados exibem `Fluxo concluído` sem botão.

- [ ] **Step 3: Atualizar o estado local ao avançar**

Em `CentralMarketing`:

```ts
const avancarConteudo = (id: string) => {
  setConteudos((atuais) => atuais.map((item) =>
    item.id === id ? { ...item, status: proximoStatusConteudo(item.status) } : item,
  ));
};
```

Integrar `BibliotecaConteudos` e `FluxoAprovacoes` às abas correspondentes.

- [ ] **Step 4: Documentar o novo módulo**

Adicionar ao `README.md` a rota `/marketing` com a descrição: `Central demonstrativa para social media, IA de conteúdo, calendário editorial, tráfego pago e aprovações.`

- [ ] **Step 5: Executar a suíte completa**

Run:

```bash
pnpm test
pnpm lint
pnpm exec tsc --noEmit
```

Expected: todos encerram com código `0`.

- [ ] **Step 6: Validar visualmente em navegador**

Com o servidor local ativo, validar `/marketing` em viewport de notebook e celular:

- todas as seis áreas aparecem e alternam;
- Estúdio IA gera o kit e envia um item à revisão;
- calendário usa rolagem interna no celular;
- biblioteca filtra e limpa;
- aprovação avança um item;
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`;
- console não apresenta erros.

- [ ] **Step 7: Executar build de produção**

Run: `pnpm build`

Expected: Next.js compila a rota `/marketing` e encerra com código `0`.

- [ ] **Step 8: Commit**

```bash
git add components/marketing/biblioteca-conteudos.tsx components/marketing/fluxo-aprovacoes.tsx components/marketing/central-marketing.tsx README.md
git commit -m "feat: complete Perez marketing center"
```
