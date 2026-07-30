# CRM Perez — Protótipo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protótipo navegável do CRM omnichannel da Imobiliária Perez — inbox unificado, pré-atendimento pela Ana, fila com rodízio automático e 4 funis de venda — rodando 100% no navegador com dados mockados.

**Architecture:** Next.js App Router com todas as rotas do CRM sob `app/(crm)/`. As regras de negócio (expediente, classificação da Ana, rodízio) são **funções puras** em `lib/`, testadas com Vitest, sem dependência de React. O estado fica num store Zustand persistido em `localStorage`, e nenhum componente o acessa direto: tudo passa por `lib/data/`, um módulo de funções `async` que hoje lê do store e amanhã vira `fetch`.

**Tech Stack:** Next.js 16.2.12 · React 19.2.4 · TypeScript 5 · Tailwind 4 · shadcn/ui (60 componentes já instalados) · Zustand · date-fns 4 · Vitest

## Global Constraints

- **Next.js 16:** `params` e `searchParams` são Promises — sempre `await`. Turbopack é o bundler padrão.
- **Sem backend.** Nenhuma chamada de rede, nenhuma variável de ambiente, nenhuma chave de API. Tudo roda no cliente.
- **Estilo de código:** `const` arrow functions, nunca `function` declarations. Sem comentários, sem `console.log`.
- **Paleta da Perez** (extraída do CSS do site em produção):
  - primária `#C81934` → `oklch(0.5348 0.2033 21.30)`
  - secundária `#333333` → `oklch(0.3211 0 0)`
  - accent `#434343` → `oklch(0.3829 0 0)`
  - whatsapp `#098a10` → `oklch(0.5501 0.1813 142.92)`
- **Tipografia:** Montserrat (`next/font/google`).
- **Expediente da Perez:** seg–sex 8h–12h e 14h–18h; sáb 8h–12h; domingo fechado.
- **Departamentos:** `comercial`, `administrativo`, `recepcao`. Só o Comercial tem funis.
- **Pipelines:** `venda`, `locacao`, `lancamentos`, `captacao`.
- **Todo texto de UI em pt-BR**, com acentuação correta.
- **Seletor do Zustand nunca retorna array ou objeto novo.** `useCrm((s) => s.dados.mensagens.filter(...))` cria um array novo a cada chamada e o React acusa snapshot instável. Selecione a referência (`useCrm((s) => s.dados)`) e faça `filter`/`find`/`map` fora do seletor.
- **`Select` é base-ui, não radix.** `<SelectValue />` renderiza o **valor bruto** a menos que `<Select>` receba a prop `items` (um `Record<string, ReactNode>` de valor → rótulo). Todo `Select` deste plano passa `items`. Esquecer isso faz a UI exibir `at-1` no lugar de `Carlos Ferreira`.
- **Funções que dependem de tempo recebem `agora: Date` por parâmetro.** Nunca chamam `new Date()` internamente — é o que as torna testáveis e o que permite ao simulador viajar no tempo.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `lib/tipos.ts` | tipos do domínio inteiro — fonte única |
| `lib/expediente/expediente.ts` | calendário comercial: dentro/fora, próxima abertura, minutos úteis |
| `lib/ana/script.ts` | textos literais da Ana |
| `lib/ana/classificar.ts` | menu numérico + palavras-chave → departamento |
| `lib/distribuicao/roleta.ts` | rodízio circular sobre atendentes disponíveis |
| `lib/mock/seed.ts` | dados iniciais realistas |
| `lib/store/crm-store.ts` | Zustand + persistência |
| `lib/data/index.ts` | **único** ponto de acesso a dados pela UI |
| `app/(crm)/layout.tsx` | shell: sidebar, seletor de papel |
| `app/(crm)/inbox/page.tsx` | inbox de 3 colunas |
| `app/(crm)/pipelines/page.tsx` | kanban dos 4 funis |
| `app/(crm)/atendentes/page.tsx` | disponibilidade, rodízio, carga |
| `app/(crm)/dashboard/page.tsx` | métricas |
| `components/inbox/*` | lista de conversas, thread, ficha do lead |
| `components/pipeline/*` | coluna e card do kanban |
| `components/crm/*` | shell, badges de canal/departamento, simulador |

---

## Task 1: Fundação — tipos, tema e ferramentas

**Files:**
- Create: `lib/tipos.ts`
- Create: `vitest.config.ts`
- Modify: `package.json`
- Modify: `app/globals.css:51-84` (bloco `:root`)
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nada
- Produces: todos os tipos do domínio, importados por todas as tarefas seguintes

- [ ] **Step 1: Instalar dependências**

```bash
npm install zustand
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths
```

- [ ] **Step 2: Configurar Vitest**

Criar `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
```

Adicionar em `package.json`, dentro de `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Escrever os tipos do domínio**

Criar `lib/tipos.ts`:

```ts
export type Canal = "whatsapp" | "site" | "portal";
export type Departamento = "comercial" | "administrativo" | "recepcao";
export type Papel = "atendente" | "supervisor" | "administrador";
export type StatusConversa = "ana" | "fila" | "atendimento" | "encerrada";
export type Autor = "contato" | "ana" | "atendente";
export type PipelineId = "venda" | "locacao" | "lancamentos" | "captacao";
export type MotivoAtribuicao = "roleta" | "manual" | "sla";

export type Contato = {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  criadoEm: string;
};

export type Mensagem = {
  id: string;
  conversaId: string;
  autor: Autor;
  texto: string;
  em: string;
};

export type Conversa = {
  id: string;
  contatoId: string;
  canal: Canal;
  departamento: Departamento | null;
  status: StatusConversa;
  atendenteId: string | null;
  criadaEm: string;
  entrouNaFilaEm: string | null;
  primeiraRespostaEm: string | null;
  contextoAna: string | null;
  naoLidas: number;
};

export type Atendente = {
  id: string;
  nome: string;
  departamentos: Departamento[];
  papel: Papel;
  disponivel: boolean;
  ordem: number;
};

export type Imovel = {
  id: string;
  codigo: string;
  tipo: "casa" | "apartamento";
  bairro: string;
  valor: number;
  finalidade: "venda" | "locacao";
};

export type Etapa = { id: string; nome: string };

export type Pipeline = {
  id: PipelineId;
  nome: string;
  etapas: Etapa[];
};

export type Lead = {
  id: string;
  contatoId: string;
  conversaId: string | null;
  pipeline: PipelineId;
  etapaId: string;
  imovelId: string | null;
  valor: number;
  responsavelId: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type EventoAtribuicao = {
  id: string;
  conversaId: string;
  atendenteId: string;
  motivo: MotivoAtribuicao;
  em: string;
};

export const DEPARTAMENTOS: Record<Departamento, string> = {
  comercial: "Comercial",
  administrativo: "Administrativo",
  recepcao: "Recepção e Assuntos Gerais",
};

export const CANAIS: Record<Canal, string> = {
  whatsapp: "WhatsApp",
  site: "Site",
  portal: "Portal",
};

export const TETO_ATENDIMENTOS = 5;
export const SLA_PRIMEIRA_RESPOSTA_MIN = 15;
```

- [ ] **Step 4: Aplicar a paleta da Perez**

Em `app/globals.css`, substituir dentro do bloco `:root` as linhas de `--primary`, `--primary-foreground`, `--ring` e `--destructive`, e acrescentar as variáveis de canal e departamento ao final do bloco (antes do `}` da linha 84):

```css
  --primary: oklch(0.5348 0.2033 21.3);
  --primary-foreground: oklch(0.985 0 0);
  --ring: oklch(0.5348 0.2033 21.3);
  --destructive: oklch(0.5348 0.2033 21.3);
  --whatsapp: oklch(0.5501 0.1813 142.92);
  --canal-site: oklch(0.55 0.16 255);
  --canal-portal: oklch(0.62 0.15 65);
```

No bloco `.dark`, substituir:

```css
  --primary: oklch(0.62 0.19 21.3);
  --primary-foreground: oklch(0.985 0 0);
  --ring: oklch(0.62 0.19 21.3);
```

E registrar as novas cores no `@theme inline` (após a linha `--color-primary: var(--primary);`):

```css
  --color-whatsapp: var(--whatsapp);
  --color-canal-site: var(--canal-site);
  --color-canal-portal: var(--canal-portal);
```

- [ ] **Step 5: Trocar a fonte para Montserrat**

Substituir o conteúdo de `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "CRM — Imobiliária Perez",
  description: "Central de atendimento e vendas da Imobiliária Perez",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="pt-BR" className={cn("h-full antialiased font-sans", montserrat.variable)}>
    <body className="min-h-full flex flex-col">{children}</body>
  </html>
);

export default RootLayout;
```

- [ ] **Step 6: Verificar que compila**

Run: `npm run build`
Expected: build conclui sem erro de tipo

- [ ] **Step 7: Commit**

```bash
git add lib/tipos.ts vitest.config.ts package.json package-lock.json app/globals.css app/layout.tsx
git commit -m "feat: tipos do dominio, paleta da Perez e setup de testes"
```

---

## Task 2: Expediente comercial

**Files:**
- Create: `lib/expediente/expediente.ts`
- Test: `lib/expediente/expediente.test.ts`

**Interfaces:**
- Consumes: nada
- Produces:
  - `dentroDoExpediente(agora: Date): boolean`
  - `proximaAbertura(agora: Date): Date`
  - `minutosUteisEntre(inicio: Date, fim: Date): number`

- [ ] **Step 1: Escrever os testes**

Criar `lib/expediente/expediente.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { dentroDoExpediente, proximaAbertura, minutosUteisEntre } from "./expediente";

describe("dentroDoExpediente", () => {
  it("aceita quarta-feira às 10h", () => {
    expect(dentroDoExpediente(new Date(2026, 6, 29, 10, 0))).toBe(true);
  });

  it("recusa o intervalo de almoço às 13h", () => {
    expect(dentroDoExpediente(new Date(2026, 6, 29, 13, 0))).toBe(false);
  });

  it("aceita quarta-feira às 15h", () => {
    expect(dentroDoExpediente(new Date(2026, 6, 29, 15, 0))).toBe(true);
  });

  it("recusa depois das 18h", () => {
    expect(dentroDoExpediente(new Date(2026, 6, 29, 18, 1))).toBe(false);
  });

  it("aceita sábado de manhã", () => {
    expect(dentroDoExpediente(new Date(2026, 7, 1, 9, 0))).toBe(true);
  });

  it("recusa sábado à tarde", () => {
    expect(dentroDoExpediente(new Date(2026, 7, 1, 15, 0))).toBe(false);
  });

  it("recusa domingo o dia inteiro", () => {
    expect(dentroDoExpediente(new Date(2026, 7, 2, 10, 0))).toBe(false);
  });
});

describe("proximaAbertura", () => {
  it("no almoço aponta para as 14h do mesmo dia", () => {
    const r = proximaAbertura(new Date(2026, 6, 29, 13, 0));
    expect(r.getDate()).toBe(29);
    expect(r.getHours()).toBe(14);
  });

  it("na noite de sexta aponta para sábado às 8h", () => {
    const r = proximaAbertura(new Date(2026, 6, 31, 20, 0));
    expect(r.getDate()).toBe(1);
    expect(r.getHours()).toBe(8);
  });

  it("no domingo aponta para segunda às 8h", () => {
    const r = proximaAbertura(new Date(2026, 7, 2, 10, 0));
    expect(r.getDate()).toBe(3);
    expect(r.getHours()).toBe(8);
  });
});

describe("minutosUteisEntre", () => {
  it("conta minutos corridos dentro do mesmo turno", () => {
    const r = minutosUteisEntre(new Date(2026, 6, 29, 10, 0), new Date(2026, 6, 29, 10, 30));
    expect(r).toBe(30);
  });

  it("desconta o intervalo de almoço", () => {
    const r = minutosUteisEntre(new Date(2026, 6, 29, 11, 30), new Date(2026, 6, 29, 14, 30));
    expect(r).toBe(60);
  });

  it("ignora o período fechado da noite", () => {
    const r = minutosUteisEntre(new Date(2026, 6, 29, 17, 30), new Date(2026, 6, 30, 8, 30));
    expect(r).toBe(60);
  });
});
```

- [ ] **Step 2: Rodar os testes e ver falhar**

Run: `npm test -- expediente`
Expected: FAIL — módulo `./expediente` não existe

- [ ] **Step 3: Implementar**

Criar `lib/expediente/expediente.ts`:

```ts
type Turno = { inicio: number; fim: number };

const TURNOS_SEMANA: Turno[] = [
  { inicio: 8 * 60, fim: 12 * 60 },
  { inicio: 14 * 60, fim: 18 * 60 },
];

const TURNOS_SABADO: Turno[] = [{ inicio: 8 * 60, fim: 12 * 60 }];

const turnosDoDia = (diaDaSemana: number): Turno[] => {
  if (diaDaSemana === 0) return [];
  if (diaDaSemana === 6) return TURNOS_SABADO;
  return TURNOS_SEMANA;
};

const minutosDoDia = (data: Date) => data.getHours() * 60 + data.getMinutes();

export const dentroDoExpediente = (agora: Date) =>
  turnosDoDia(agora.getDay()).some((t) => {
    const m = minutosDoDia(agora);
    return m >= t.inicio && m < t.fim;
  });

export const proximaAbertura = (agora: Date): Date => {
  for (let offset = 0; offset < 8; offset++) {
    const dia = new Date(agora);
    dia.setDate(agora.getDate() + offset);
    for (const turno of turnosDoDia(dia.getDay())) {
      const abertura = new Date(dia);
      abertura.setHours(Math.floor(turno.inicio / 60), turno.inicio % 60, 0, 0);
      if (abertura > agora) return abertura;
    }
  }
  return agora;
};

export const minutosUteisEntre = (inicio: Date, fim: Date): number => {
  if (fim <= inicio) return 0;
  let total = 0;
  for (let offset = 0; offset < 14; offset++) {
    const dia = new Date(inicio);
    dia.setDate(inicio.getDate() + offset);
    dia.setHours(0, 0, 0, 0);
    if (dia > fim) break;
    for (const turno of turnosDoDia(dia.getDay())) {
      const abertura = new Date(dia);
      abertura.setHours(Math.floor(turno.inicio / 60), turno.inicio % 60, 0, 0);
      const fechamento = new Date(dia);
      fechamento.setHours(Math.floor(turno.fim / 60), turno.fim % 60, 0, 0);
      const de = inicio > abertura ? inicio : abertura;
      const ate = fim < fechamento ? fim : fechamento;
      if (ate > de) total += Math.round((ate.getTime() - de.getTime()) / 60000);
    }
  }
  return total;
};
```

- [ ] **Step 4: Rodar os testes e ver passar**

Run: `npm test -- expediente`
Expected: PASS — 13 testes

- [ ] **Step 5: Commit**

```bash
git add lib/expediente/
git commit -m "feat: calendario de expediente comercial da Perez"
```

---

## Task 3: Motor de pré-atendimento da Ana

**Files:**
- Create: `lib/ana/script.ts`
- Create: `lib/ana/classificar.ts`
- Test: `lib/ana/classificar.test.ts`

**Interfaces:**
- Consumes: `Departamento` de `lib/tipos`; `dentroDoExpediente`, `proximaAbertura` de `lib/expediente/expediente`
- Produces:
  - `SAUDACAO_ANA: string`
  - `mensagemForaDoExpediente(agora: Date): string`
  - `mensagemPosicaoNaFila(posicao: number): string`
  - `mensagemEncaminhando(departamento: Departamento): string`
  - `MENU_INVALIDO: string`
  - `classificar(texto: string): Classificacao`
  - `type Classificacao = { departamento: Departamento | null; confianca: number; contexto: string | null }`

- [ ] **Step 1: Escrever os textos da Ana**

Criar `lib/ana/script.ts`:

```ts
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Departamento } from "@/lib/tipos";
import { DEPARTAMENTOS } from "@/lib/tipos";
import { proximaAbertura } from "@/lib/expediente/expediente";

export const SAUDACAO_ANA = `Eu sou a 🙋🏻‍♀️ *Ana*, assistente virtual da Imobiliária Perez.

Por favor, encaminhar suas mensagens por texto.

Já estou lhe encaminhando para um de nossos atendentes.

Para agilizar seu atendimento por favor, digite sua dúvida.

Seja bem vindo a Imobiliária Perez.

Para iniciar seu atendimento me informe sobre qual assunto deseja falar com a gente hoje?

🔹 1 - Comercial
🔹 2 - Administrativo
🔹 3 - Recepção e Assuntos Gerais`;

export const MENU_INVALIDO = `Não consegui identificar o assunto. Pode escolher uma das opções?

🔹 1 - Comercial
🔹 2 - Administrativo
🔹 3 - Recepção e Assuntos Gerais`;

export const mensagemEncaminhando = (departamento: Departamento) =>
  `Perfeito! Estou lhe encaminhando para o setor *${DEPARTAMENTOS[departamento]}*. Um momento, por favor.`;

export const mensagemPosicaoNaFila = (posicao: number) =>
  posicao === 1
    ? "Você é o próximo a ser atendido. Enquanto isso, pode me adiantar o que precisa?"
    : `Você está na posição *${posicao}* da fila. Enquanto isso, pode me adiantar o que precisa?`;

export const mensagemForaDoExpediente = (agora: Date) => {
  const abertura = proximaAbertura(agora);
  const quando = format(abertura, "EEEE',' d 'de' MMMM 'às' HH'h'mm", { locale: ptBR });
  return `No momento estamos fora do horário de atendimento.

Nosso horário é de segunda a sexta, das 8h às 12h e das 14h às 18h, e aos sábados das 8h às 12h.

Já registrei sua mensagem e retornaremos ${quando}.`;
};
```

- [ ] **Step 2: Escrever os testes de classificação**

Criar `lib/ana/classificar.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { classificar } from "./classificar";

describe("classificar por menu numérico", () => {
  it("mapeia 1 para comercial com confiança total", () => {
    expect(classificar("1")).toEqual({ departamento: "comercial", confianca: 1, contexto: null });
  });

  it("mapeia 2 para administrativo", () => {
    expect(classificar("2").departamento).toBe("administrativo");
  });

  it("mapeia 3 para recepção", () => {
    expect(classificar("3").departamento).toBe("recepcao");
  });

  it("tolera espaços e emoji ao redor do número", () => {
    expect(classificar(" 🔹 1 ").departamento).toBe("comercial");
  });

  it("recusa número fora do menu", () => {
    expect(classificar("7").departamento).toBe(null);
  });
});

describe("classificar por texto livre", () => {
  it("entende intenção de compra como comercial", () => {
    const r = classificar("quero comprar um apartamento na Gleba Palhano");
    expect(r.departamento).toBe("comercial");
    expect(r.confianca).toBeGreaterThan(0);
  });

  it("entende intenção de locação como comercial", () => {
    expect(classificar("tem casa pra alugar no centro?").departamento).toBe("comercial");
  });

  it("entende boleto como administrativo", () => {
    expect(classificar("preciso da segunda via do boleto").departamento).toBe("administrativo");
  });

  it("entende vistoria como administrativo", () => {
    expect(classificar("quando vai ser a vistoria do imóvel").departamento).toBe("administrativo");
  });

  it("preserva o texto original como contexto", () => {
    const texto = "quero comprar um apartamento na Gleba Palhano";
    expect(classificar(texto).contexto).toBe(texto);
  });

  it("não classifica texto sem sinal", () => {
    const r = classificar("bom dia");
    expect(r.departamento).toBe(null);
    expect(r.confianca).toBe(0);
  });

  it("escolhe o departamento com mais sinais quando há termos dos dois", () => {
    const r = classificar("quero alugar uma casa e visitar o apartamento, e também pagar o boleto");
    expect(r.departamento).toBe("comercial");
    expect(r.confianca).toBeLessThan(1);
  });
});
```

- [ ] **Step 3: Rodar os testes e ver falhar**

Run: `npm test -- classificar`
Expected: FAIL — módulo `./classificar` não existe

- [ ] **Step 4: Implementar o classificador**

Criar `lib/ana/classificar.ts`:

```ts
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
    "manutencao", "manutenção", "reajuste", "multa",
  ],
  recepcao: ["falar com", "recepcao", "recepção", "telefone", "endereco", "endereço", "horario", "horário"],
};

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const pontuar = (texto: string, palavras: string[]) =>
  palavras.filter((palavra) => texto.includes(normalizar(palavra))).length;

export const classificar = (texto: string): Classificacao => {
  const limpo = texto.trim();
  const soNumero = limpo.replace(/[^\d]/g, "");
  if (limpo.length <= 4 && soNumero.length === 1) {
    return { departamento: OPCOES_MENU[soNumero] ?? null, confianca: OPCOES_MENU[soNumero] ? 1 : 0, contexto: null };
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
```

**Por que "imóvel" não está na lista do Comercial:** é o termo mais genérico do negócio e aparece em qualquer contexto — "vistoria do imóvel" é Administrativo, "quero ver o imóvel" é Comercial. Incluí-lo empataria as duas listas e a classificação viraria sorteio. Sem ele, a frase sem outro sinal cai no menu de novo, que é o comportamento correto.

- [ ] **Step 5: Rodar os testes e ver passar**

Run: `npm test -- classificar`
Expected: PASS — 12 testes

- [ ] **Step 6: Commit**

```bash
git add lib/ana/
git commit -m "feat: motor de pre-atendimento da Ana com menu e texto livre"
```

---

## Task 4: Fila e rodízio de atendimento

**Files:**
- Create: `lib/distribuicao/roleta.ts`
- Test: `lib/distribuicao/roleta.test.ts`

**Interfaces:**
- Consumes: `Atendente`, `Departamento`, `TETO_ATENDIMENTOS` de `lib/tipos`; `dentroDoExpediente` de `lib/expediente/expediente`
- Produces:
  - `type ResultadoRodizio = { atendente: Atendente | null; proximoPonteiro: number }`
  - `proximoAtendente(params: ParamsRodizio): ResultadoRodizio`
  - `type ParamsRodizio = { departamento: Departamento; atendentes: Atendente[]; carga: Record<string, number>; ponteiro: number; agora: Date }`

- [ ] **Step 1: Escrever os testes**

Criar `lib/distribuicao/roleta.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { proximoAtendente } from "./roleta";
import type { Atendente } from "@/lib/tipos";

const criar = (id: string, ordem: number, extras: Partial<Atendente> = {}): Atendente => ({
  id,
  nome: id,
  departamentos: ["comercial"],
  papel: "atendente",
  disponivel: true,
  ordem,
  ...extras,
});

const EXPEDIENTE = new Date(2026, 6, 29, 10, 0);
const FECHADO = new Date(2026, 7, 2, 10, 0);

describe("proximoAtendente", () => {
  it("escolhe o primeiro da fila quando o ponteiro está em zero", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0), criar("b", 1), criar("c", 2)],
      carga: {},
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente?.id).toBe("a");
    expect(r.proximoPonteiro).toBe(1);
  });

  it("avança circularmente e volta ao início", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0), criar("b", 1), criar("c", 2)],
      carga: {},
      ponteiro: 2,
      agora: EXPEDIENTE,
    });
    expect(r.atendente?.id).toBe("c");
    expect(r.proximoPonteiro).toBe(0);
  });

  it("pula quem está indisponível sem perder a vez do seguinte", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0, { disponivel: false }), criar("b", 1), criar("c", 2)],
      carga: {},
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente?.id).toBe("b");
    expect(r.proximoPonteiro).toBe(2);
  });

  it("pula quem já atingiu o teto de atendimentos", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0), criar("b", 1)],
      carga: { a: 5 },
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente?.id).toBe("b");
  });

  it("ignora atendente de outro departamento", () => {
    const r = proximoAtendente({
      departamento: "administrativo",
      atendentes: [criar("a", 0), criar("b", 1, { departamentos: ["administrativo"] })],
      carga: {},
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente?.id).toBe("b");
  });

  it("não atribui fora do expediente", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0)],
      carga: {},
      ponteiro: 0,
      agora: FECHADO,
    });
    expect(r.atendente).toBe(null);
    expect(r.proximoPonteiro).toBe(0);
  });

  it("não atribui quando todos estão no teto", () => {
    const r = proximoAtendente({
      departamento: "comercial",
      atendentes: [criar("a", 0), criar("b", 1)],
      carga: { a: 5, b: 5 },
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente).toBe(null);
  });

  it("não atribui quando o departamento não tem atendente", () => {
    const r = proximoAtendente({
      departamento: "recepcao",
      atendentes: [criar("a", 0)],
      carga: {},
      ponteiro: 0,
      agora: EXPEDIENTE,
    });
    expect(r.atendente).toBe(null);
  });
});
```

- [ ] **Step 2: Rodar os testes e ver falhar**

Run: `npm test -- roleta`
Expected: FAIL — módulo `./roleta` não existe

- [ ] **Step 3: Implementar o rodízio**

Criar `lib/distribuicao/roleta.ts`:

```ts
import type { Atendente, Departamento } from "@/lib/tipos";
import { TETO_ATENDIMENTOS } from "@/lib/tipos";
import { dentroDoExpediente } from "@/lib/expediente/expediente";

export type ParamsRodizio = {
  departamento: Departamento;
  atendentes: Atendente[];
  carga: Record<string, number>;
  ponteiro: number;
  agora: Date;
};

export type ResultadoRodizio = {
  atendente: Atendente | null;
  proximoPonteiro: number;
};

export const proximoAtendente = ({
  departamento,
  atendentes,
  carga,
  ponteiro,
  agora,
}: ParamsRodizio): ResultadoRodizio => {
  if (!dentroDoExpediente(agora)) return { atendente: null, proximoPonteiro: ponteiro };

  const doDepartamento = atendentes
    .filter((a) => a.departamentos.includes(departamento))
    .sort((a, b) => a.ordem - b.ordem);

  if (doDepartamento.length === 0) return { atendente: null, proximoPonteiro: ponteiro };

  for (let passo = 0; passo < doDepartamento.length; passo++) {
    const indice = (ponteiro + passo) % doDepartamento.length;
    const candidato = doDepartamento[indice];
    const apto = candidato.disponivel && (carga[candidato.id] ?? 0) < TETO_ATENDIMENTOS;
    if (apto) {
      return { atendente: candidato, proximoPonteiro: (indice + 1) % doDepartamento.length };
    }
  }

  return { atendente: null, proximoPonteiro: ponteiro };
};
```

- [ ] **Step 4: Rodar os testes e ver passar**

Run: `npm test -- roleta`
Expected: PASS — 8 testes

- [ ] **Step 5: Commit**

```bash
git add lib/distribuicao/
git commit -m "feat: rodizio circular de atendimento com filtro de disponibilidade"
```

---

## Task 5: Dados mockados

**Files:**
- Create: `lib/mock/pipelines.ts`
- Create: `lib/mock/seed.ts`

**Interfaces:**
- Consumes: todos os tipos de `lib/tipos`
- Produces:
  - `PIPELINES: Pipeline[]`
  - `type EstadoCrm = { contatos, conversas, mensagens, atendentes, imoveis, leads, eventos, ponteiro }`
  - `criarSeed(base: Date): EstadoCrm`
  - `buscarPipeline(id: PipelineId): Pipeline`

- [ ] **Step 1: Definir os pipelines**

Criar `lib/mock/pipelines.ts`:

```ts
import type { Pipeline } from "@/lib/tipos";

export const PIPELINES: Pipeline[] = [
  {
    id: "venda",
    nome: "Venda",
    etapas: [
      { id: "venda-novo", nome: "Novo" },
      { id: "venda-contato", nome: "Contato feito" },
      { id: "venda-visita-agendada", nome: "Visita agendada" },
      { id: "venda-visita-realizada", nome: "Visita realizada" },
      { id: "venda-proposta", nome: "Proposta" },
      { id: "venda-fechado", nome: "Fechado" },
      { id: "venda-perdido", nome: "Perdido" },
    ],
  },
  {
    id: "locacao",
    nome: "Locação",
    etapas: [
      { id: "loc-novo", nome: "Novo" },
      { id: "loc-contato", nome: "Contato feito" },
      { id: "loc-visita", nome: "Visita" },
      { id: "loc-documentacao", nome: "Documentação" },
      { id: "loc-analise", nome: "Análise cadastral" },
      { id: "loc-assinado", nome: "Contrato assinado" },
      { id: "loc-perdido", nome: "Perdido" },
    ],
  },
  {
    id: "lancamentos",
    nome: "Lançamentos",
    etapas: [
      { id: "lanc-novo", nome: "Novo" },
      { id: "lanc-interesse", nome: "Interesse" },
      { id: "lanc-apresentacao", nome: "Apresentação" },
      { id: "lanc-reserva", nome: "Reserva" },
      { id: "lanc-contrato", nome: "Contrato" },
      { id: "lanc-perdido", nome: "Perdido" },
    ],
  },
  {
    id: "captacao",
    nome: "Captação",
    etapas: [
      { id: "cap-contatado", nome: "Proprietário contatado" },
      { id: "cap-avaliacao", nome: "Avaliação" },
      { id: "cap-exclusividade", nome: "Proposta de exclusividade" },
      { id: "cap-carteira", nome: "Imóvel na carteira" },
      { id: "cap-perdido", nome: "Não captado" },
    ],
  },
];

export const buscarPipeline = (id: Pipeline["id"]) => PIPELINES.find((p) => p.id === id)!;
```

- [ ] **Step 2: Escrever o seed**

Criar `lib/mock/seed.ts`. Os horários são relativos a uma data-base fixa passada por parâmetro, para que a demonstração pareça recente em qualquer dia:

```ts
import type {
  Atendente, Contato, Conversa, EventoAtribuicao, Imovel, Lead, Mensagem, Departamento,
} from "@/lib/tipos";
import { SAUDACAO_ANA, mensagemEncaminhando } from "@/lib/ana/script";

export type EstadoCrm = {
  contatos: Contato[];
  conversas: Conversa[];
  mensagens: Mensagem[];
  atendentes: Atendente[];
  imoveis: Imovel[];
  leads: Lead[];
  eventos: EventoAtribuicao[];
  ponteiro: Record<Departamento, number>;
};

const ATENDENTES: Atendente[] = [
  { id: "at-1", nome: "Carlos Ferreira", departamentos: ["comercial"], papel: "atendente", disponivel: true, ordem: 0 },
  { id: "at-2", nome: "Juliana Moraes", departamentos: ["comercial"], papel: "atendente", disponivel: true, ordem: 1 },
  { id: "at-3", nome: "Rafael Tanaka", departamentos: ["comercial"], papel: "atendente", disponivel: false, ordem: 2 },
  { id: "at-4", nome: "Patrícia Lopes", departamentos: ["comercial"], papel: "supervisor", disponivel: true, ordem: 3 },
  { id: "at-5", nome: "Eduardo Ramos", departamentos: ["administrativo"], papel: "atendente", disponivel: true, ordem: 0 },
  { id: "at-6", nome: "Simone Prado", departamentos: ["administrativo"], papel: "supervisor", disponivel: true, ordem: 1 },
  { id: "at-7", nome: "Bianca Lima", departamentos: ["recepcao"], papel: "atendente", disponivel: true, ordem: 0 },
  { id: "at-8", nome: "Marcos Perez", departamentos: ["comercial", "administrativo", "recepcao"], papel: "administrador", disponivel: false, ordem: 4 },
];

const IMOVEIS: Imovel[] = [
  { id: "im-1", codigo: "PZ-1042", tipo: "apartamento", bairro: "Gleba Palhano", valor: 780000, finalidade: "venda" },
  { id: "im-2", codigo: "PZ-2210", tipo: "apartamento", bairro: "Centro", valor: 2400, finalidade: "locacao" },
  { id: "im-3", codigo: "PZ-3388", tipo: "casa", bairro: "Jardim Higienópolis", valor: 1250000, finalidade: "venda" },
  { id: "im-4", codigo: "PZ-4501", tipo: "casa", bairro: "Vila Nova", valor: 3800, finalidade: "locacao" },
  { id: "im-5", codigo: "PZ-5127", tipo: "apartamento", bairro: "Gleba Palhano", valor: 610000, finalidade: "venda" },
];

const CONTATOS = [
  { nome: "João Silva", telefone: "43 99812-4477", email: "joao.silva@email.com" },
  { nome: "Maria Antunes", telefone: "43 99733-1290", email: null },
  { nome: "Pedro Nakamura", telefone: "43 99604-8815", email: "pnakamura@email.com" },
  { nome: "Ana Beatriz Costa", telefone: "43 99187-3320", email: null },
  { nome: "Ricardo Molina", telefone: "43 99450-7761", email: "rmolina@email.com" },
  { nome: "Fernanda Duarte", telefone: "43 99920-5504", email: null },
  { nome: "Sérgio Batista", telefone: "43 99311-6672", email: "sergio.b@email.com" },
  { nome: "Luciana Prado", telefone: "43 99845-2213", email: null },
];

const minutosAtras = (base: Date, minutos: number) =>
  new Date(base.getTime() - minutos * 60000).toISOString();

export const criarSeed = (base: Date): EstadoCrm => {
  const contatos: Contato[] = CONTATOS.map((c, i) => ({
    id: `ct-${i + 1}`,
    nome: c.nome,
    telefone: c.telefone,
    email: c.email,
    criadoEm: minutosAtras(base, 600 - i * 40),
  }));

  const conversas: Conversa[] = [
    { id: "cv-1", contatoId: "ct-1", canal: "whatsapp", departamento: "comercial", status: "atendimento", atendenteId: "at-1", criadaEm: minutosAtras(base, 95), entrouNaFilaEm: minutosAtras(base, 93), primeiraRespostaEm: minutosAtras(base, 88), contextoAna: "quero comprar um apartamento na Gleba Palhano", naoLidas: 2 },
    { id: "cv-2", contatoId: "ct-2", canal: "whatsapp", departamento: "comercial", status: "fila", atendenteId: null, criadaEm: minutosAtras(base, 22), entrouNaFilaEm: minutosAtras(base, 20), primeiraRespostaEm: null, contextoAna: "tem casa pra alugar no centro?", naoLidas: 1 },
    { id: "cv-3", contatoId: "ct-3", canal: "site", departamento: "comercial", status: "atendimento", atendenteId: "at-2", criadaEm: minutosAtras(base, 240), entrouNaFilaEm: minutosAtras(base, 240), primeiraRespostaEm: minutosAtras(base, 231), contextoAna: null, naoLidas: 0 },
    { id: "cv-4", contatoId: "ct-4", canal: "whatsapp", departamento: "administrativo", status: "atendimento", atendenteId: "at-5", criadaEm: minutosAtras(base, 180), entrouNaFilaEm: minutosAtras(base, 178), primeiraRespostaEm: minutosAtras(base, 170), contextoAna: "preciso da segunda via do boleto", naoLidas: 0 },
    { id: "cv-5", contatoId: "ct-5", canal: "portal", departamento: "comercial", status: "fila", atendenteId: null, criadaEm: minutosAtras(base, 8), entrouNaFilaEm: minutosAtras(base, 8), primeiraRespostaEm: null, contextoAna: null, naoLidas: 1 },
    { id: "cv-6", contatoId: "ct-6", canal: "whatsapp", departamento: null, status: "ana", atendenteId: null, criadaEm: minutosAtras(base, 3), entrouNaFilaEm: null, primeiraRespostaEm: null, contextoAna: null, naoLidas: 1 },
    { id: "cv-7", contatoId: "ct-7", canal: "whatsapp", departamento: "recepcao", status: "encerrada", atendenteId: "at-7", criadaEm: minutosAtras(base, 1400), entrouNaFilaEm: minutosAtras(base, 1398), primeiraRespostaEm: minutosAtras(base, 1392), contextoAna: null, naoLidas: 0 },
    { id: "cv-8", contatoId: "ct-8", canal: "site", departamento: "comercial", status: "atendimento", atendenteId: "at-1", criadaEm: minutosAtras(base, 320), entrouNaFilaEm: minutosAtras(base, 320), primeiraRespostaEm: minutosAtras(base, 300), contextoAna: null, naoLidas: 0 },
  ];

  const mensagens: Mensagem[] = [
    { id: "ms-1", conversaId: "cv-1", autor: "contato", texto: "Boa tarde", em: minutosAtras(base, 95) },
    { id: "ms-2", conversaId: "cv-1", autor: "ana", texto: SAUDACAO_ANA, em: minutosAtras(base, 95) },
    { id: "ms-3", conversaId: "cv-1", autor: "contato", texto: "quero comprar um apartamento na Gleba Palhano", em: minutosAtras(base, 94) },
    { id: "ms-4", conversaId: "cv-1", autor: "ana", texto: mensagemEncaminhando("comercial"), em: minutosAtras(base, 93) },
    { id: "ms-5", conversaId: "cv-1", autor: "atendente", texto: "Olá, João! Aqui é o Carlos, da Perez. Temos ótimas opções na Gleba Palhano. Você procura de quantos dormitórios?", em: minutosAtras(base, 88) },
    { id: "ms-6", conversaId: "cv-1", autor: "contato", texto: "3 dormitórios, com suíte se possível", em: minutosAtras(base, 84) },
    { id: "ms-7", conversaId: "cv-1", autor: "atendente", texto: "Perfeito. Tenho o PZ-1042, 3 dormitórios com suíte, 96m², por R$ 780.000. Posso te enviar as fotos?", em: minutosAtras(base, 80) },
    { id: "ms-8", conversaId: "cv-1", autor: "contato", texto: "Pode sim! Consigo visitar essa semana?", em: minutosAtras(base, 12) },
    { id: "ms-9", conversaId: "cv-1", autor: "contato", texto: "Prefiro quinta à tarde", em: minutosAtras(base, 11) },

    { id: "ms-10", conversaId: "cv-2", autor: "contato", texto: "Oi", em: minutosAtras(base, 22) },
    { id: "ms-11", conversaId: "cv-2", autor: "ana", texto: SAUDACAO_ANA, em: minutosAtras(base, 22) },
    { id: "ms-12", conversaId: "cv-2", autor: "contato", texto: "tem casa pra alugar no centro?", em: minutosAtras(base, 21) },
    { id: "ms-13", conversaId: "cv-2", autor: "ana", texto: mensagemEncaminhando("comercial"), em: minutosAtras(base, 20) },

    { id: "ms-14", conversaId: "cv-3", autor: "contato", texto: "Tenho interesse no imóvel PZ-3388 anunciado no site.", em: minutosAtras(base, 240) },
    { id: "ms-15", conversaId: "cv-3", autor: "atendente", texto: "Olá, Pedro! Sou a Juliana. A casa do Jardim Higienópolis está disponível, sim. Quer agendar uma visita?", em: minutosAtras(base, 231) },

    { id: "ms-16", conversaId: "cv-4", autor: "contato", texto: "boa tarde", em: minutosAtras(base, 180) },
    { id: "ms-17", conversaId: "cv-4", autor: "ana", texto: SAUDACAO_ANA, em: minutosAtras(base, 180) },
    { id: "ms-18", conversaId: "cv-4", autor: "contato", texto: "preciso da segunda via do boleto", em: minutosAtras(base, 179) },
    { id: "ms-19", conversaId: "cv-4", autor: "ana", texto: mensagemEncaminhando("administrativo"), em: minutosAtras(base, 178) },
    { id: "ms-20", conversaId: "cv-4", autor: "atendente", texto: "Boa tarde, Ana Beatriz! Já estou gerando a segunda via e envio em instantes.", em: minutosAtras(base, 170) },

    { id: "ms-21", conversaId: "cv-5", autor: "contato", texto: "Vim pelo ZAP Imóveis, quero informações do apartamento PZ-5127.", em: minutosAtras(base, 8) },

    { id: "ms-22", conversaId: "cv-6", autor: "contato", texto: "oi, boa tarde", em: minutosAtras(base, 3) },
    { id: "ms-23", conversaId: "cv-6", autor: "ana", texto: SAUDACAO_ANA, em: minutosAtras(base, 3) },

    { id: "ms-24", conversaId: "cv-7", autor: "contato", texto: "qual o horário de vocês no sábado?", em: minutosAtras(base, 1400) },
    { id: "ms-25", conversaId: "cv-7", autor: "atendente", texto: "Sábado atendemos das 8h às 12h. Até logo!", em: minutosAtras(base, 1392) },

    { id: "ms-26", conversaId: "cv-8", autor: "contato", texto: "Quero colocar meu apartamento para alugar com vocês.", em: minutosAtras(base, 320) },
    { id: "ms-27", conversaId: "cv-8", autor: "atendente", texto: "Que ótimo, Luciana! Podemos agendar uma avaliação do imóvel?", em: minutosAtras(base, 300) },
  ];

  const leads: Lead[] = [
    { id: "ld-1", contatoId: "ct-1", conversaId: "cv-1", pipeline: "venda", etapaId: "venda-visita-agendada", imovelId: "im-1", valor: 780000, responsavelId: "at-1", criadoEm: minutosAtras(base, 95), atualizadoEm: minutosAtras(base, 80) },
    { id: "ld-2", contatoId: "ct-2", conversaId: "cv-2", pipeline: "locacao", etapaId: "loc-novo", imovelId: "im-2", valor: 2400, responsavelId: null, criadoEm: minutosAtras(base, 22), atualizadoEm: minutosAtras(base, 22) },
    { id: "ld-3", contatoId: "ct-3", conversaId: "cv-3", pipeline: "venda", etapaId: "venda-contato", imovelId: "im-3", valor: 1250000, responsavelId: "at-2", criadoEm: minutosAtras(base, 240), atualizadoEm: minutosAtras(base, 231) },
    { id: "ld-4", contatoId: "ct-5", conversaId: "cv-5", pipeline: "venda", etapaId: "venda-novo", imovelId: "im-5", valor: 610000, responsavelId: null, criadoEm: minutosAtras(base, 8), atualizadoEm: minutosAtras(base, 8) },
    { id: "ld-5", contatoId: "ct-8", conversaId: "cv-8", pipeline: "captacao", etapaId: "cap-avaliacao", imovelId: null, valor: 0, responsavelId: "at-1", criadoEm: minutosAtras(base, 320), atualizadoEm: minutosAtras(base, 300) },
    { id: "ld-6", contatoId: "ct-6", conversaId: null, pipeline: "lancamentos", etapaId: "lanc-interesse", imovelId: null, valor: 450000, responsavelId: "at-2", criadoEm: minutosAtras(base, 2880), atualizadoEm: minutosAtras(base, 1440) },
    { id: "ld-7", contatoId: "ct-7", conversaId: null, pipeline: "venda", etapaId: "venda-proposta", imovelId: "im-5", valor: 590000, responsavelId: "at-4", criadoEm: minutosAtras(base, 5760), atualizadoEm: minutosAtras(base, 2880) },
    { id: "ld-8", contatoId: "ct-4", conversaId: null, pipeline: "locacao", etapaId: "loc-assinado", imovelId: "im-4", valor: 3800, responsavelId: "at-2", criadoEm: minutosAtras(base, 10080), atualizadoEm: minutosAtras(base, 4320) },
  ];

  const eventos: EventoAtribuicao[] = [
    { id: "ev-1", conversaId: "cv-1", atendenteId: "at-1", motivo: "roleta", em: minutosAtras(base, 93) },
    { id: "ev-2", conversaId: "cv-3", atendenteId: "at-2", motivo: "roleta", em: minutosAtras(base, 240) },
    { id: "ev-3", conversaId: "cv-4", atendenteId: "at-5", motivo: "roleta", em: minutosAtras(base, 178) },
    { id: "ev-4", conversaId: "cv-7", atendenteId: "at-7", motivo: "roleta", em: minutosAtras(base, 1398) },
    { id: "ev-5", conversaId: "cv-8", atendenteId: "at-1", motivo: "manual", em: minutosAtras(base, 320) },
  ];

  return {
    contatos,
    conversas,
    mensagens,
    atendentes: ATENDENTES,
    imoveis: IMOVEIS,
    leads,
    eventos,
    ponteiro: { comercial: 2, administrativo: 1, recepcao: 0 },
  };
};
```

- [ ] **Step 3: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sem erros

- [ ] **Step 4: Commit**

```bash
git add lib/mock/
git commit -m "feat: pipelines e dados mockados do prototipo"
```

---

## Task 6: Store e camada de acesso a dados

**Files:**
- Create: `lib/store/crm-store.ts`
- Create: `lib/data/index.ts`

**Interfaces:**
- Consumes: `criarSeed`, `EstadoCrm` de `lib/mock/seed`; `proximoAtendente` de `lib/distribuicao/roleta`; `classificar` de `lib/ana/classificar`; textos de `lib/ana/script`
- Produces:
  - `useCrm` — hook Zustand com seletores (`dados`, `papel`, `usuarioId`, `hidratado`, `definirPapel`, `definirUsuario`, `reiniciar`)
  - `lib/data`: `receberMensagem`, `assumirConversa`, `enviarMensagem`, `encerrarConversa`, `drenarFila`, `moverLead`, `definirPipelineDoLead`, `alternarDisponibilidade`, `marcarComoLida`, `posicaoNaFila`, `cargaPorAtendente`, `conversasVisiveis`

- [ ] **Step 1: Criar o store**

Criar `lib/store/crm-store.ts`:

```ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EstadoCrm } from "@/lib/mock/seed";
import { criarSeed } from "@/lib/mock/seed";
import type { Papel } from "@/lib/tipos";

type AcoesCrm = {
  aplicar: (mutacao: (estado: EstadoCrm) => EstadoCrm) => void;
  definirPapel: (papel: Papel) => void;
  definirUsuario: (atendenteId: string) => void;
  reiniciar: () => void;
};

type EstadoSessao = {
  dados: EstadoCrm;
  papel: Papel;
  usuarioId: string;
  hidratado: boolean;
};

const estadoInicial = (): Omit<EstadoSessao, "hidratado"> => ({
  dados: criarSeed(new Date()),
  papel: "administrador",
  usuarioId: "at-1",
});

export const useCrm = create<EstadoSessao & AcoesCrm>()(
  persist(
    (set) => ({
      ...estadoInicial(),
      hidratado: false,
      aplicar: (mutacao) => set((s) => ({ dados: mutacao(s.dados) })),
      definirPapel: (papel) => set({ papel }),
      definirUsuario: (usuarioId) => set({ usuarioId }),
      reiniciar: () => set(estadoInicial()),
    }),
    {
      name: "crm-perez",
      onRehydrateStorage: () => (estado) => {
        if (estado) estado.hidratado = true;
      },
    }
  )
);
```

- [ ] **Step 2: Criar a camada de acesso a dados**

Criar `lib/data/index.ts`. Toda função é `async` de propósito — é o formato que sobrevive à troca por `fetch`:

```ts
"use client";

import { useCrm } from "@/lib/store/crm-store";
import type { EstadoCrm } from "@/lib/mock/seed";
import { proximoAtendente } from "@/lib/distribuicao/roleta";
import { classificar } from "@/lib/ana/classificar";
import { mensagemEncaminhando, mensagemPosicaoNaFila, MENU_INVALIDO, SAUDACAO_ANA, mensagemForaDoExpediente } from "@/lib/ana/script";
import { dentroDoExpediente } from "@/lib/expediente/expediente";
import type { Canal, Departamento, Mensagem, PipelineId } from "@/lib/tipos";

let sequencia = 0;
const novoId = (prefixo: string) => `${prefixo}-${Date.now().toString(36)}-${sequencia++}`;

const aplicar = (mutacao: (estado: EstadoCrm) => EstadoCrm) => useCrm.getState().aplicar(mutacao);

export const cargaPorAtendente = (estado: EstadoCrm): Record<string, number> =>
  estado.conversas
    .filter((c) => c.status === "atendimento" && c.atendenteId)
    .reduce<Record<string, number>>((acc, c) => {
      acc[c.atendenteId!] = (acc[c.atendenteId!] ?? 0) + 1;
      return acc;
    }, {});

export const posicaoNaFila = (estado: EstadoCrm, conversaId: string): number => {
  const conversa = estado.conversas.find((c) => c.id === conversaId);
  if (!conversa || conversa.status !== "fila") return 0;
  const fila = estado.conversas
    .filter((c) => c.status === "fila" && c.departamento === conversa.departamento)
    .sort((a, b) => (a.entrouNaFilaEm ?? "").localeCompare(b.entrouNaFilaEm ?? ""));
  return fila.findIndex((c) => c.id === conversaId) + 1;
};

const anexar = (estado: EstadoCrm, conversaId: string, autor: Mensagem["autor"], texto: string, em: string): EstadoCrm => ({
  ...estado,
  mensagens: [...estado.mensagens, { id: novoId("ms"), conversaId, autor, texto, em }],
});

const tentarAtribuir = (estado: EstadoCrm, conversaId: string, agora: Date): EstadoCrm => {
  const conversa = estado.conversas.find((c) => c.id === conversaId);
  if (!conversa?.departamento || conversa.status !== "fila") return estado;

  const { atendente, proximoPonteiro } = proximoAtendente({
    departamento: conversa.departamento,
    atendentes: estado.atendentes,
    carga: cargaPorAtendente(estado),
    ponteiro: estado.ponteiro[conversa.departamento],
    agora,
  });

  if (!atendente) {
    const posicao = posicaoNaFila(estado, conversaId);
    const aviso = dentroDoExpediente(agora)
      ? mensagemPosicaoNaFila(posicao)
      : mensagemForaDoExpediente(agora);
    return anexar(estado, conversaId, "ana", aviso, agora.toISOString());
  }

  return {
    ...estado,
    conversas: estado.conversas.map((c) =>
      c.id === conversaId ? { ...c, status: "atendimento", atendenteId: atendente.id } : c
    ),
    leads: estado.leads.map((l) =>
      l.conversaId === conversaId && !l.responsavelId ? { ...l, responsavelId: atendente.id } : l
    ),
    ponteiro: { ...estado.ponteiro, [conversa.departamento]: proximoPonteiro },
    eventos: [
      ...estado.eventos,
      { id: novoId("ev"), conversaId, atendenteId: atendente.id, motivo: "roleta", em: agora.toISOString() },
    ],
  };
};

export const receberMensagem = async (params: {
  contatoId: string;
  canal: Canal;
  texto: string;
  agora: Date;
  departamentoDireto?: Departamento;
}) => {
  const { contatoId, canal, texto, agora, departamentoDireto } = params;
  aplicar((estado) => {
    const existente = estado.conversas.find(
      (c) => c.contatoId === contatoId && c.canal === canal && c.status !== "encerrada"
    );

    if (existente) {
      const comMensagem = anexar(estado, existente.id, "contato", texto, agora.toISOString());
      if (existente.status !== "ana") {
        return {
          ...comMensagem,
          conversas: comMensagem.conversas.map((c) =>
            c.id === existente.id ? { ...c, naoLidas: c.naoLidas + 1 } : c
          ),
        };
      }
      const { departamento, contexto } = classificar(texto);
      if (!departamento) return anexar(comMensagem, existente.id, "ana", MENU_INVALIDO, agora.toISOString());
      const encaminhada: EstadoCrm = {
        ...anexar(comMensagem, existente.id, "ana", mensagemEncaminhando(departamento), agora.toISOString()),
        conversas: comMensagem.conversas.map((c) =>
          c.id === existente.id
            ? { ...c, departamento, status: "fila" as const, entrouNaFilaEm: agora.toISOString(), contextoAna: contexto, naoLidas: c.naoLidas + 1 }
            : c
        ),
      };
      return tentarAtribuir(encaminhada, existente.id, agora);
    }

    const conversaId = novoId("cv");
    const viaAna = canal === "whatsapp" && !departamentoDireto;
    const departamento = departamentoDireto ?? null;

    const base: EstadoCrm = {
      ...estado,
      conversas: [
        ...estado.conversas,
        {
          id: conversaId,
          contatoId,
          canal,
          departamento,
          status: viaAna ? "ana" : "fila",
          atendenteId: null,
          criadaEm: agora.toISOString(),
          entrouNaFilaEm: viaAna ? null : agora.toISOString(),
          primeiraRespostaEm: null,
          contextoAna: viaAna ? null : texto,
          naoLidas: 1,
        },
      ],
    };

    const comMensagem = anexar(base, conversaId, "contato", texto, agora.toISOString());
    if (viaAna) return anexar(comMensagem, conversaId, "ana", SAUDACAO_ANA, agora.toISOString());
    return tentarAtribuir(comMensagem, conversaId, agora);
  });
};

export const assumirConversa = async (conversaId: string, atendenteId: string, agora: Date) => {
  aplicar((estado) => ({
    ...estado,
    conversas: estado.conversas.map((c) =>
      c.id === conversaId ? { ...c, status: "atendimento", atendenteId, naoLidas: 0 } : c
    ),
    eventos: [
      ...estado.eventos,
      { id: novoId("ev"), conversaId, atendenteId, motivo: "manual", em: agora.toISOString() },
    ],
  }));
};

export const enviarMensagem = async (conversaId: string, texto: string, agora: Date) => {
  aplicar((estado) => {
    const comMensagem = anexar(estado, conversaId, "atendente", texto, agora.toISOString());
    return {
      ...comMensagem,
      conversas: comMensagem.conversas.map((c) =>
        c.id === conversaId
          ? { ...c, naoLidas: 0, primeiraRespostaEm: c.primeiraRespostaEm ?? agora.toISOString() }
          : c
      ),
    };
  });
};

export const encerrarConversa = async (conversaId: string, agora: Date) => {
  aplicar((estado) => {
    const encerrada: EstadoCrm = {
      ...estado,
      conversas: estado.conversas.map((c) => (c.id === conversaId ? { ...c, status: "encerrada" } : c)),
    };
    return drenarFilaSync(encerrada, agora);
  });
};

const drenarFilaSync = (estado: EstadoCrm, agora: Date): EstadoCrm => {
  const aguardando = estado.conversas
    .filter((c) => c.status === "fila")
    .sort((a, b) => (a.entrouNaFilaEm ?? "").localeCompare(b.entrouNaFilaEm ?? ""));
  return aguardando.reduce((acc, conversa) => tentarAtribuir(acc, conversa.id, agora), estado);
};

export const drenarFila = async (agora: Date) => {
  aplicar((estado) => drenarFilaSync(estado, agora));
};

export const moverLead = async (leadId: string, etapaId: string, agora: Date) => {
  aplicar((estado) => ({
    ...estado,
    leads: estado.leads.map((l) =>
      l.id === leadId ? { ...l, etapaId, atualizadoEm: agora.toISOString() } : l
    ),
  }));
};

export const definirPipelineDoLead = async (leadId: string, pipeline: PipelineId, etapaId: string, agora: Date) => {
  aplicar((estado) => ({
    ...estado,
    leads: estado.leads.map((l) =>
      l.id === leadId ? { ...l, pipeline, etapaId, atualizadoEm: agora.toISOString() } : l
    ),
  }));
};

export const alternarDisponibilidade = async (atendenteId: string) => {
  aplicar((estado) => ({
    ...estado,
    atendentes: estado.atendentes.map((a) =>
      a.id === atendenteId ? { ...a, disponivel: !a.disponivel } : a
    ),
  }));
};

export const marcarComoLida = async (conversaId: string) => {
  aplicar((estado) => ({
    ...estado,
    conversas: estado.conversas.map((c) => (c.id === conversaId ? { ...c, naoLidas: 0 } : c)),
  }));
};

export const conversasVisiveis = (estado: EstadoCrm, papel: Papel, usuarioId: string) => {
  if (papel === "administrador") return estado.conversas;

  const usuario = estado.atendentes.find((a) => a.id === usuarioId);
  if (!usuario) return [];

  const doEscopo = estado.conversas.filter(
    (c) => c.departamento === null || usuario.departamentos.includes(c.departamento)
  );

  if (papel === "supervisor") return doEscopo;
  return doEscopo.filter((c) => c.atendenteId === usuarioId || c.status !== "atendimento");
};
```

O `Papel` precisa entrar no import de tipos deste arquivo:

```ts
import type { Canal, Departamento, Mensagem, Papel, PipelineId } from "@/lib/tipos";
```

**A regra em uma frase:** administrador vê tudo; supervisor vê o que pertence aos seus departamentos; atendente vê os próprios atendimentos mais o que ainda está sem dono — porque uma conversa na fila precisa ser visível para poder ser assumida.

- [ ] **Step 3: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sem erros

- [ ] **Step 4: Commit**

```bash
git add lib/store/ lib/data/
git commit -m "feat: store persistido e camada unica de acesso a dados"
```

---

## Task 7: Shell do CRM

**Files:**
- Create: `app/(crm)/layout.tsx`
- Create: `components/crm/navegacao.tsx`
- Create: `components/crm/seletor-papel.tsx`
- Create: `components/crm/badge-canal.tsx`
- Create: `components/crm/somente-cliente.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useCrm` de `lib/store/crm-store`; `CANAIS`, `DEPARTAMENTOS` de `lib/tipos`
- Produces:
  - `<BadgeCanal canal={canal} />`
  - `<Navegacao />`, `<SeletorPapel />`

- [ ] **Step 1: Badge de canal**

Criar `components/crm/badge-canal.tsx`:

```tsx
import { Globe, MessageCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Canal } from "@/lib/tipos";
import { CANAIS } from "@/lib/tipos";

const ESTILOS: Record<Canal, string> = {
  whatsapp: "bg-whatsapp/10 text-whatsapp border-whatsapp/20",
  site: "bg-canal-site/10 text-canal-site border-canal-site/20",
  portal: "bg-canal-portal/10 text-canal-portal border-canal-portal/20",
};

const ICONES: Record<Canal, typeof Globe> = {
  whatsapp: MessageCircle,
  site: Globe,
  portal: Building2,
};

export const BadgeCanal = ({ canal, className }: { canal: Canal; className?: string }) => {
  const Icone = ICONES[canal];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
        ESTILOS[canal],
        className
      )}
    >
      <Icone className="size-3" />
      {CANAIS[canal]}
    </span>
  );
};
```

- [ ] **Step 2: Navegação lateral**

Criar `components/crm/navegacao.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, KanbanSquare, Users, ChartLine } from "lucide-react";
import { cn } from "@/lib/utils";

const ITENS = [
  { href: "/inbox", rotulo: "Inbox", icone: Inbox },
  { href: "/pipelines", rotulo: "Pipelines", icone: KanbanSquare },
  { href: "/atendentes", rotulo: "Atendentes", icone: Users },
  { href: "/dashboard", rotulo: "Dashboard", icone: ChartLine },
];

export const Navegacao = () => {
  const caminho = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-2">
      {ITENS.map(({ href, rotulo, icone: Icone }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            caminho.startsWith(href)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icone className="size-4" />
          {rotulo}
        </Link>
      ))}
    </nav>
  );
};
```

- [ ] **Step 3: Seletor de papel**

Criar `components/crm/seletor-papel.tsx`:

```tsx
"use client";

import { useCrm } from "@/lib/store/crm-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Papel } from "@/lib/tipos";

const ROTULOS: Record<Papel, string> = {
  atendente: "Atendente",
  supervisor: "Supervisor",
  administrador: "Administrador",
};

export const SeletorPapel = () => {
  const papel = useCrm((s) => s.papel);
  const usuarioId = useCrm((s) => s.usuarioId);
  const atendentes = useCrm((s) => s.dados.atendentes);
  const definirPapel = useCrm((s) => s.definirPapel);
  const definirUsuario = useCrm((s) => s.definirUsuario);

  const itensAtendentes = Object.fromEntries(atendentes.map((a) => [a.id, a.nome]));

  return (
    <div className="flex items-center gap-2">
      <Select items={itensAtendentes} value={usuarioId} onValueChange={definirUsuario}>
        <SelectTrigger className="w-52" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {atendentes.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select items={ROTULOS} value={papel} onValueChange={(v) => definirPapel(v as Papel)}>
        <SelectTrigger className="w-40" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(ROTULOS) as Papel[]).map((p) => (
            <SelectItem key={p} value={p}>
              {ROTULOS[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
```

- [ ] **Step 4: Guard de hidratação**

O seed é gerado com `new Date()` e a UI mostra tempo relativo ("há 12 minutos"). Servidor e cliente calculam isso em instantes diferentes, e o estado persistido no `localStorage` **não existe** no servidor — as duas coisas juntas garantem erro de hidratação. Este componente resolve as duas de uma vez: nada do CRM renderiza no servidor.

Criar `components/crm/somente-cliente.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export const SomenteCliente = ({ children }: { children: React.ReactNode }) => {
  const [montado, setMontado] = useState(false);

  useEffect(() => setMontado(true), []);

  if (!montado) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-5 text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
};
```

- [ ] **Step 5: Layout do CRM**

Criar `app/(crm)/layout.tsx`:

```tsx
import { Navegacao } from "@/components/crm/navegacao";
import { SeletorPapel } from "@/components/crm/seletor-papel";
import { SomenteCliente } from "@/components/crm/somente-cliente";

const CrmLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-dvh w-full overflow-hidden">
    <aside className="flex w-56 shrink-0 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
          P
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Perez</p>
          <p className="text-[10px] text-muted-foreground">CRECI J-2.696</p>
        </div>
      </div>
      <Navegacao />
    </aside>
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-end gap-3 border-b px-4">
        <SomenteCliente>
          <SeletorPapel />
        </SomenteCliente>
      </header>
      <main className="min-h-0 flex-1 overflow-hidden">
        <SomenteCliente>{children}</SomenteCliente>
      </main>
    </div>
  </div>
);

export default CrmLayout;
```

- [ ] **Step 6: Redirecionar a raiz para o inbox**

Substituir o conteúdo de `app/page.tsx`. Fica **fora** do grupo `(crm)` de propósito — dentro dele, o shell inteiro montaria só para em seguida redirecionar:

```tsx
import { redirect } from "next/navigation";

const Home = () => redirect("/inbox");

export default Home;
```

- [ ] **Step 7: Verificar no navegador**

Run: `npm run dev`
Expected: `http://localhost:3000` redireciona para `/inbox`; a sidebar aparece com o "P" carmim e a navegação; o seletor de papel lista os 8 atendentes **pelo nome** (se aparecer `at-1`, o `items` do `Select` ficou faltando). Nenhum aviso de hydration mismatch no console. `/inbox` ainda dá 404 — esperado, é a próxima tarefa.

- [ ] **Step 8: Commit**

```bash
git add "app/(crm)" app/page.tsx components/crm
git commit -m "feat: shell do CRM com navegacao, seletor de papel e guard de hidratacao"
```

---

## Task 8: Inbox unificado

**Files:**
- Create: `app/(crm)/inbox/page.tsx`
- Create: `components/inbox/lista-conversas.tsx`
- Create: `components/inbox/thread.tsx`
- Create: `components/inbox/ficha-lead.tsx`

**Interfaces:**
- Consumes: `useCrm`; `enviarMensagem`, `assumirConversa`, `marcarComoLida`, `posicaoNaFila`, `conversasVisiveis`, `moverLead` de `lib/data`; `BadgeCanal`; `PIPELINES`, `buscarPipeline` de `lib/mock/pipelines`
- Produces: rota `/inbox` funcional

- [ ] **Step 1: Lista de conversas**

Criar `components/inbox/lista-conversas.tsx`:

```tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCrm } from "@/lib/store/crm-store";
import { conversasVisiveis } from "@/lib/data";
import { BadgeCanal } from "@/components/crm/badge-canal";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEPARTAMENTOS } from "@/lib/tipos";
import type { Departamento } from "@/lib/tipos";

type Props = {
  selecionada: string | null;
  aoSelecionar: (id: string) => void;
  filtro: Departamento | "todos";
  aoFiltrar: (filtro: Departamento | "todos") => void;
};

const ROTULO_STATUS: Record<string, string> = {
  ana: "Com a Ana",
  fila: "Na fila",
  atendimento: "Em atendimento",
  encerrada: "Encerrada",
};

export const ListaConversas = ({ selecionada, aoSelecionar, filtro, aoFiltrar }: Props) => {
  const dados = useCrm((s) => s.dados);
  const papel = useCrm((s) => s.papel);
  const usuarioId = useCrm((s) => s.usuarioId);
  const { contatos, mensagens } = dados;

  const visiveis = conversasVisiveis(dados, papel, usuarioId)
    .filter((c) => filtro === "todos" || c.departamento === filtro)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));

  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-r">
      <div className="border-b p-2">
        <Tabs value={filtro} onValueChange={(v) => aoFiltrar(v as Departamento | "todos")}>
          <TabsList className="w-full">
            <TabsTrigger value="todos" className="text-xs">Todos</TabsTrigger>
            <TabsTrigger value="comercial" className="text-xs">Comercial</TabsTrigger>
            <TabsTrigger value="administrativo" className="text-xs">Admin</TabsTrigger>
            <TabsTrigger value="recepcao" className="text-xs">Recepção</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        {visiveis.map((conversa) => {
          const contato = contatos.find((c) => c.id === conversa.contatoId);
          const ultima = mensagens.filter((m) => m.conversaId === conversa.id).at(-1);
          return (
            <button
              key={conversa.id}
              onClick={() => aoSelecionar(conversa.id)}
              className={cn(
                "flex w-full flex-col gap-1 border-b px-3 py-2.5 text-left transition-colors hover:bg-muted/60",
                selecionada === conversa.id && "bg-muted"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{contato?.nome}</span>
                {conversa.naoLidas > 0 && (
                  <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {conversa.naoLidas}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">{ultima?.texto}</p>
              <div className="flex items-center gap-1.5">
                <BadgeCanal canal={conversa.canal} />
                <Badge variant="outline" className="text-[10px]">
                  {ROTULO_STATUS[conversa.status]}
                </Badge>
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(conversa.criadaEm), { locale: ptBR })}
                </span>
              </div>
              {conversa.departamento && (
                <span className="text-[10px] text-muted-foreground">
                  {DEPARTAMENTOS[conversa.departamento]}
                </span>
              )}
            </button>
          );
        })}
      </ScrollArea>
    </div>
  );
};
```

- [ ] **Step 2: Thread da conversa**

Criar `components/inbox/thread.tsx`:

```tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCrm } from "@/lib/store/crm-store";
import { enviarMensagem, assumirConversa } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export const Thread = ({ conversaId }: { conversaId: string | null }) => {
  const [rascunho, setRascunho] = useState("");
  const dados = useCrm((s) => s.dados);
  const usuarioId = useCrm((s) => s.usuarioId);

  const conversa = dados.conversas.find((c) => c.id === conversaId);
  const contato = dados.contatos.find((c) => c.id === conversa?.contatoId);
  const mensagens = dados.mensagens.filter((m) => m.conversaId === conversaId);

  if (!conversa) {
    return (
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Nenhuma conversa selecionada</EmptyTitle>
            <EmptyDescription>Escolha uma conversa na lista ao lado.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const submeter = async () => {
    if (!rascunho.trim()) return;
    await enviarMensagem(conversa.id, rascunho.trim(), new Date());
    setRascunho("");
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div>
          <p className="text-sm font-semibold">{contato?.nome}</p>
          <p className="text-xs text-muted-foreground">{contato?.telefone}</p>
        </div>
        {conversa.status === "fila" && (
          <Button size="sm" onClick={() => assumirConversa(conversa.id, usuarioId, new Date())}>
            Assumir atendimento
          </Button>
        )}
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 p-4">
          {mensagens.map((mensagem) => {
            const doContato = mensagem.autor === "contato";
            const daAna = mensagem.autor === "ana";
            return (
              <div key={mensagem.id} className={cn("flex flex-col gap-1", !doContato && "items-end")}>
                {daAna && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                    <Sparkles className="size-3" /> Ana
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap",
                    doContato && "bg-muted",
                    daAna && "border border-dashed bg-muted/40 text-muted-foreground",
                    mensagem.autor === "atendente" && "bg-primary text-primary-foreground"
                  )}
                >
                  {mensagem.texto}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(mensagem.em), "dd/MM HH:mm")}
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex shrink-0 items-end gap-2 border-t p-3">
        <Textarea
          value={rascunho}
          onChange={(e) => setRascunho(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submeter();
            }
          }}
          placeholder="Escreva uma mensagem..."
          className="max-h-32 min-h-10 resize-none"
        />
        <Button size="icon" onClick={submeter}>
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Ficha do lead**

Criar `components/inbox/ficha-lead.tsx`:

```tsx
"use client";

import { Sparkles } from "lucide-react";
import { useCrm } from "@/lib/store/crm-store";
import { moverLead, posicaoNaFila } from "@/lib/data";
import { buscarPipeline } from "@/lib/mock/pipelines";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DEPARTAMENTOS } from "@/lib/tipos";

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const FichaLead = ({ conversaId }: { conversaId: string | null }) => {
  const dados = useCrm((s) => s.dados);
  const conversa = dados.conversas.find((c) => c.id === conversaId);
  const lead = dados.leads.find((l) => l.conversaId === conversaId);
  const imovel = dados.imoveis.find((i) => i.id === lead?.imovelId);
  const responsavel = dados.atendentes.find((a) => a.id === conversa?.atendenteId);

  if (!conversa) return <aside className="w-72 shrink-0 border-l" />;

  const pipeline = lead ? buscarPipeline(lead.pipeline) : null;
  const posicao = posicaoNaFila(dados, conversa.id);

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-4 overflow-y-auto border-l p-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground">Departamento</p>
        <p className="text-sm">{conversa.departamento ? DEPARTAMENTOS[conversa.departamento] : "Em triagem"}</p>
      </div>

      {conversa.status === "fila" && (
        <Badge variant="outline">Posição {posicao} na fila</Badge>
      )}

      {responsavel && (
        <div>
          <p className="text-xs font-medium text-muted-foreground">Responsável</p>
          <p className="text-sm">{responsavel.nome}</p>
        </div>
      )}

      {conversa.contextoAna && (
        <div className="rounded-md border border-dashed bg-muted/40 p-2">
          <p className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
            <Sparkles className="size-3" /> Captado pela Ana
          </p>
          <p className="mt-1 text-xs">{conversa.contextoAna}</p>
        </div>
      )}

      <Separator />

      {lead && pipeline ? (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Pipeline</p>
            <p className="text-sm">{pipeline.nome}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Etapa</p>
            <Select
              items={Object.fromEntries(pipeline.etapas.map((e) => [e.id, e.nome]))}
              value={lead.etapaId}
              onValueChange={(v) => moverLead(lead.id, v, new Date())}
            >
              <SelectTrigger size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pipeline.etapas.map((etapa) => (
                  <SelectItem key={etapa.id} value={etapa.id}>
                    {etapa.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {lead.valor > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Valor</p>
              <p className="text-sm font-semibold">{moeda(lead.valor)}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Sem negociação vinculada.</p>
      )}

      {imovel && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Imóvel</p>
            <p className="text-sm font-medium">{imovel.codigo}</p>
            <p className="text-xs text-muted-foreground">
              {imovel.tipo === "casa" ? "Casa" : "Apartamento"} · {imovel.bairro}
            </p>
            <p className="text-xs">{moeda(imovel.valor)}</p>
          </div>
        </>
      )}
    </aside>
  );
};
```

- [ ] **Step 4: Página do inbox**

Criar `app/(crm)/inbox/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { ListaConversas } from "@/components/inbox/lista-conversas";
import { Thread } from "@/components/inbox/thread";
import { FichaLead } from "@/components/inbox/ficha-lead";
import { marcarComoLida } from "@/lib/data";
import type { Departamento } from "@/lib/tipos";

const InboxPage = () => {
  const [selecionada, setSelecionada] = useState<string | null>("cv-1");
  const [filtro, setFiltro] = useState<Departamento | "todos">("todos");

  useEffect(() => {
    if (selecionada) marcarComoLida(selecionada);
  }, [selecionada]);

  return (
    <div className="flex h-full">
      <ListaConversas
        selecionada={selecionada}
        aoSelecionar={setSelecionada}
        filtro={filtro}
        aoFiltrar={setFiltro}
      />
      <Thread conversaId={selecionada} />
      <FichaLead conversaId={selecionada} />
    </div>
  );
};

export default InboxPage;
```

- [ ] **Step 5: Verificar no navegador**

Run: `npm run dev` e abrir `http://localhost:3000/inbox`
Expected:
1. Como **Administrador**, 8 conversas na lista.
2. Clicar em "João Silva": a thread mostra as mensagens da Ana em bloco tracejado e as do atendente em carmim; a ficha à direita mostra pipeline Venda, etapa "Visita agendada" e o imóvel PZ-1042.
3. Enviar uma mensagem: aparece na thread e permanece após recarregar a página.
4. No cabeçalho, trocar para o usuário **Eduardo Ramos** com papel **Atendente**: a lista encolhe para as conversas do Administrativo — a do João Silva some.
5. Trocar o papel para **Supervisor** mantendo Eduardo: continuam só as do Administrativo, mas agora todas, inclusive as de outros atendentes do setor.

- [ ] **Step 6: Commit**

```bash
git add "app/(crm)/inbox" components/inbox
git commit -m "feat: inbox unificado com thread e ficha do lead"
```

---

## Task 9: Kanban dos pipelines

**Files:**
- Create: `app/(crm)/pipelines/page.tsx`
- Create: `components/pipeline/coluna.tsx`
- Create: `components/pipeline/card-lead.tsx`

**Interfaces:**
- Consumes: `useCrm`; `moverLead` de `lib/data`; `PIPELINES`, `buscarPipeline` de `lib/mock/pipelines`
- Produces: rota `/pipelines` com drag and drop nativo

- [ ] **Step 1: Card do lead**

Criar `components/pipeline/card-lead.tsx`:

```tsx
"use client";

import { differenceInDays } from "date-fns";
import { useCrm } from "@/lib/store/crm-store";
import { Card } from "@/components/ui/card";
import { BadgeCanal } from "@/components/crm/badge-canal";
import type { Lead } from "@/lib/tipos";

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const CardLead = ({ lead }: { lead: Lead }) => {
  const dados = useCrm((s) => s.dados);
  const contato = dados.contatos.find((c) => c.id === lead.contatoId);
  const imovel = dados.imoveis.find((i) => i.id === lead.imovelId);
  const responsavel = dados.atendentes.find((a) => a.id === lead.responsavelId);
  const conversa = dados.conversas.find((c) => c.id === lead.conversaId);
  const dias = differenceInDays(new Date(), new Date(lead.atualizadoEm));

  return (
    <Card
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", lead.id)}
      className="cursor-grab gap-2 p-3 active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">{contato?.nome}</p>
        {conversa && <BadgeCanal canal={conversa.canal} />}
      </div>
      {imovel && (
        <p className="text-xs text-muted-foreground">
          {imovel.codigo} · {imovel.bairro}
        </p>
      )}
      {lead.valor > 0 && <p className="text-sm font-semibold">{moeda(lead.valor)}</p>}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{responsavel?.nome ?? "Sem responsável"}</span>
        <span>{dias === 0 ? "hoje" : `${dias}d`}</span>
      </div>
    </Card>
  );
};
```

- [ ] **Step 2: Coluna do kanban**

Criar `components/pipeline/coluna.tsx`:

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { moverLead } from "@/lib/data";
import { CardLead } from "./card-lead";
import type { Etapa, Lead } from "@/lib/tipos";

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const Coluna = ({ etapa, leads }: { etapa: Etapa; leads: Lead[] }) => {
  const [sobre, setSobre] = useState(false);
  const total = leads.reduce((soma, l) => soma + l.valor, 0);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setSobre(true);
      }}
      onDragLeave={() => setSobre(false)}
      onDrop={(e) => {
        e.preventDefault();
        setSobre(false);
        const leadId = e.dataTransfer.getData("text/plain");
        if (leadId) moverLead(leadId, etapa.id, new Date());
      }}
      className={cn(
        "flex w-64 shrink-0 flex-col rounded-lg border bg-muted/30 transition-colors",
        sobre && "border-primary bg-primary/5"
      )}
    >
      <div className="border-b px-3 py-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{etapa.nome}</p>
          <span className="rounded bg-muted px-1.5 text-xs text-muted-foreground">{leads.length}</span>
        </div>
        {total > 0 && <p className="text-[11px] text-muted-foreground">{moeda(total)}</p>}
      </div>
      <div className="flex min-h-24 flex-col gap-2 overflow-y-auto p-2">
        {leads.map((lead) => (
          <CardLead key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Página dos pipelines**

Criar `app/(crm)/pipelines/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useCrm } from "@/lib/store/crm-store";
import { PIPELINES } from "@/lib/mock/pipelines";
import { Coluna } from "@/components/pipeline/coluna";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PipelineId } from "@/lib/tipos";

const PipelinesPage = () => {
  const [ativo, setAtivo] = useState<PipelineId>("venda");
  const leads = useCrm((s) => s.dados.leads);
  const pipeline = PIPELINES.find((p) => p.id === ativo)!;

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b p-3">
        <Tabs value={ativo} onValueChange={(v) => setAtivo(v as PipelineId)}>
          <TabsList>
            {PIPELINES.map((p) => (
              <TabsTrigger key={p.id} value={p.id}>
                {p.nome}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto p-3">
        {pipeline.etapas.map((etapa) => (
          <Coluna
            key={etapa.id}
            etapa={etapa}
            leads={leads.filter((l) => l.pipeline === ativo && l.etapaId === etapa.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PipelinesPage;
```

- [ ] **Step 4: Verificar no navegador**

Run: `npm run dev` e abrir `http://localhost:3000/pipelines`
Expected: aba "Venda" mostra 7 colunas; o card do João Silva está em "Visita agendada" com R$ 780.000. Arrastar o card para "Proposta" move e o total da coluna muda. Recarregar a página mantém a posição nova.

- [ ] **Step 5: Commit**

```bash
git add "app/(crm)/pipelines" components/pipeline
git commit -m "feat: kanban dos quatro pipelines com drag and drop"
```

---

## Task 10: Atendentes e simulador

**Files:**
- Create: `app/(crm)/atendentes/page.tsx`
- Create: `components/crm/simulador.tsx`
- Modify: `app/(crm)/layout.tsx`

**Interfaces:**
- Consumes: `useCrm`; `alternarDisponibilidade`, `receberMensagem`, `drenarFila`, `cargaPorAtendente` de `lib/data`
- Produces: rota `/atendentes`; `<Simulador />` no cabeçalho

- [ ] **Step 1: Página de atendentes**

Criar `app/(crm)/atendentes/page.tsx`:

```tsx
"use client";

import { useCrm } from "@/lib/store/crm-store";
import { alternarDisponibilidade, cargaPorAtendente } from "@/lib/data";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEPARTAMENTOS, TETO_ATENDIMENTOS } from "@/lib/tipos";
import type { Departamento } from "@/lib/tipos";

const AtendentesPage = () => {
  const dados = useCrm((s) => s.dados);
  const carga = cargaPorAtendente(dados);

  const filaPorDepartamento = (departamento: Departamento) =>
    dados.conversas.filter((c) => c.status === "fila" && c.departamento === departamento).length;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(DEPARTAMENTOS) as Departamento[]).map((departamento) => (
          <div key={departamento} className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">{DEPARTAMENTOS[departamento]}</p>
            <p className="text-2xl font-semibold">{filaPorDepartamento(departamento)}</p>
            <p className="text-xs text-muted-foreground">aguardando na fila</p>
          </div>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Atendente</TableHead>
            <TableHead>Departamentos</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Ordem no rodízio</TableHead>
            <TableHead>Em atendimento</TableHead>
            <TableHead className="text-right">Disponível</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.atendentes.map((atendente) => (
            <TableRow key={atendente.id}>
              <TableCell className="font-medium">{atendente.nome}</TableCell>
              <TableCell className="flex flex-wrap gap-1">
                {atendente.departamentos.map((d) => (
                  <Badge key={d} variant="outline" className="text-[10px]">
                    {DEPARTAMENTOS[d]}
                  </Badge>
                ))}
              </TableCell>
              <TableCell className="capitalize">{atendente.papel}</TableCell>
              <TableCell>{atendente.ordem + 1}º</TableCell>
              <TableCell>
                {carga[atendente.id] ?? 0} / {TETO_ATENDIMENTOS}
              </TableCell>
              <TableCell className="text-right">
                <Switch
                  checked={atendente.disponivel}
                  onCheckedChange={() => alternarDisponibilidade(atendente.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AtendentesPage;
```

- [ ] **Step 2: Simulador de lead**

Criar `components/crm/simulador.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { useCrm } from "@/lib/store/crm-store";
import { receberMensagem, drenarFila } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Canal } from "@/lib/tipos";
import { CANAIS } from "@/lib/tipos";

export const Simulador = () => {
  const contatos = useCrm((s) => s.dados.contatos);
  const reiniciar = useCrm((s) => s.reiniciar);
  const [contatoId, setContatoId] = useState("ct-6");
  const [canal, setCanal] = useState<Canal>("whatsapp");
  const [texto, setTexto] = useState("quero comprar um apartamento na Gleba Palhano");

  const disparar = async () => {
    const agora = new Date();
    await receberMensagem({
      contatoId,
      canal,
      texto,
      agora,
      departamentoDireto: canal === "whatsapp" ? undefined : "comercial",
    });
    await drenarFila(agora);
  };

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="sm" />}>
        <Zap className="size-4" />
        Simular lead
      </PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col gap-3" align="end">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Contato</Label>
          <Select
            items={Object.fromEntries(contatos.map((c) => [c.id, c.nome]))}
            value={contatoId}
            onValueChange={setContatoId}
          >
            <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {contatos.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Canal</Label>
          <Select items={CANAIS} value={canal} onValueChange={(v) => setCanal(v as Canal)}>
            <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(CANAIS) as Canal[]).map((c) => (
                <SelectItem key={c} value={c}>{CANAIS[c]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Mensagem</Label>
          <Input value={texto} onChange={(e) => setTexto(e.target.value)} />
        </div>
        <Button size="sm" onClick={disparar}>Enviar mensagem</Button>
        <Button size="sm" variant="ghost" onClick={reiniciar}>Reiniciar dados</Button>
      </PopoverContent>
    </Popover>
  );
};
```

- [ ] **Step 3: Colocar o simulador no cabeçalho**

Em `app/(crm)/layout.tsx`, adicionar o import e o componente antes do `<SeletorPapel />`:

```tsx
import { Simulador } from "@/components/crm/simulador";
```

```tsx
      <header className="flex h-14 shrink-0 items-center justify-end gap-3 border-b px-4">
        <Simulador />
        <SeletorPapel />
      </header>
```

- [ ] **Step 4: Verificar o fluxo completo no navegador**

Run: `npm run dev`
Expected (dentro do expediente):
1. Em `/atendentes`, desligar "Carlos Ferreira" e "Juliana Moraes".
2. Abrir o simulador, escolher "Fernanda Duarte", canal WhatsApp, texto "quero comprar um apartamento na Gleba Palhano", enviar.
3. Em `/inbox`, a conversa da Fernanda mostra a saudação da Ana, a mensagem dela, o encaminhamento para o Comercial e a atribuição a "Patrícia Lopes" — que é a próxima disponível do rodízio.
4. Voltar em `/atendentes`: a carga da Patrícia subiu 1.

- [ ] **Step 5: Commit**

```bash
git add "app/(crm)/atendentes" "app/(crm)/layout.tsx" components/crm/simulador.tsx
git commit -m "feat: painel de atendentes e simulador de lead"
```

---

## Task 11: Dashboard

**Files:**
- Create: `app/(crm)/dashboard/page.tsx`
- Create: `components/crm/cartao-metrica.tsx`

**Interfaces:**
- Consumes: `useCrm`; `minutosUteisEntre` de `lib/expediente/expediente`; `PIPELINES`
- Produces: rota `/dashboard`

- [ ] **Step 1: Cartão de métrica**

Criar `components/crm/cartao-metrica.tsx`:

```tsx
export const CartaoMetrica = ({
  rotulo,
  valor,
  apoio,
}: {
  rotulo: string;
  valor: string;
  apoio?: string;
}) => (
  <div className="rounded-lg border p-4">
    <p className="text-xs text-muted-foreground">{rotulo}</p>
    <p className="mt-1 text-3xl font-semibold tracking-tight">{valor}</p>
    {apoio && <p className="mt-0.5 text-xs text-muted-foreground">{apoio}</p>}
  </div>
);
```

- [ ] **Step 2: Página do dashboard**

Criar `app/(crm)/dashboard/page.tsx`:

```tsx
"use client";

import { useCrm } from "@/lib/store/crm-store";
import { minutosUteisEntre } from "@/lib/expediente/expediente";
import { CartaoMetrica } from "@/components/crm/cartao-metrica";
import { PIPELINES } from "@/lib/mock/pipelines";
import { CANAIS, DEPARTAMENTOS, SLA_PRIMEIRA_RESPOSTA_MIN } from "@/lib/tipos";
import type { Canal, Departamento } from "@/lib/tipos";
import { Progress } from "@/components/ui/progress";

const DashboardPage = () => {
  const dados = useCrm((s) => s.dados);

  const respondidas = dados.conversas.filter((c) => c.primeiraRespostaEm && c.entrouNaFilaEm);
  const temposResposta = respondidas.map((c) =>
    minutosUteisEntre(new Date(c.entrouNaFilaEm!), new Date(c.primeiraRespostaEm!))
  );
  const tempoMedio = temposResposta.length
    ? Math.round(temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length)
    : 0;
  const dentroDoSla = temposResposta.filter((t) => t <= SLA_PRIMEIRA_RESPOSTA_MIN).length;

  const porCanal = (Object.keys(CANAIS) as Canal[]).map((canal) => ({
    canal,
    total: dados.conversas.filter((c) => c.canal === canal).length,
  }));

  const porDepartamento = (Object.keys(DEPARTAMENTOS) as Departamento[]).map((d) => ({
    departamento: d,
    total: dados.conversas.filter((c) => c.departamento === d).length,
  }));

  const totalConversas = dados.conversas.length;
  const emFila = dados.conversas.filter((c) => c.status === "fila").length;
  const valorEmNegociacao = dados.leads
    .filter((l) => !l.etapaId.includes("perdido") && !l.etapaId.includes("fechado"))
    .reduce((soma, l) => soma + l.valor, 0);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="grid grid-cols-4 gap-3">
        <CartaoMetrica rotulo="Conversas" valor={String(totalConversas)} apoio="no período" />
        <CartaoMetrica rotulo="Aguardando na fila" valor={String(emFila)} />
        <CartaoMetrica
          rotulo="1ª resposta"
          valor={`${tempoMedio} min`}
          apoio={`${dentroDoSla} de ${temposResposta.length} dentro do SLA de ${SLA_PRIMEIRA_RESPOSTA_MIN} min`}
        />
        <CartaoMetrica
          rotulo="Em negociação"
          valor={valorEmNegociacao.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0,
          })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-4">
          <p className="mb-3 text-sm font-medium">Conversas por canal</p>
          <div className="flex flex-col gap-3">
            {porCanal.map(({ canal, total }) => (
              <div key={canal} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span>{CANAIS[canal]}</span>
                  <span className="text-muted-foreground">{total}</span>
                </div>
                <Progress value={totalConversas ? (total / totalConversas) * 100 : 0} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <p className="mb-3 text-sm font-medium">Conversas por departamento</p>
          <div className="flex flex-col gap-3">
            {porDepartamento.map(({ departamento, total }) => (
              <div key={departamento} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span>{DEPARTAMENTOS[departamento]}</span>
                  <span className="text-muted-foreground">{total}</span>
                </div>
                <Progress value={totalConversas ? (total / totalConversas) * 100 : 0} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-3 text-sm font-medium">Leads por pipeline</p>
        <div className="grid grid-cols-4 gap-3">
          {PIPELINES.map((pipeline) => (
            <div key={pipeline.id}>
              <p className="text-xs text-muted-foreground">{pipeline.nome}</p>
              <p className="text-2xl font-semibold">
                {dados.leads.filter((l) => l.pipeline === pipeline.id).length}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
```

- [ ] **Step 3: Rodar a verificação completa**

Run: `npm test`
Expected: PASS — 33 testes

Run: `npm run build`
Expected: build conclui sem erro

Run: `npm run dev` e navegar por `/inbox`, `/pipelines`, `/atendentes`, `/dashboard`
Expected: as quatro rotas carregam sem erro no console

- [ ] **Step 4: Commit**

```bash
git add "app/(crm)/dashboard" components/crm/cartao-metrica.tsx
git commit -m "feat: dashboard com metricas de canal, SLA e pipelines"
```

---

## Notas de verificação

O protótipo está pronto quando, com `npm run dev` rodando **dentro do expediente comercial**:

1. `/inbox` lista 8 conversas, thread do João Silva mostra Ana e atendente visualmente distintos, e enviar mensagem persiste após refresh.
2. `/pipelines` permite arrastar um card entre etapas e o total da coluna se atualiza.
3. `/atendentes` permite desligar um atendente e o próximo lead simulado vai para outro.
4. `/dashboard` mostra as métricas coerentes com os dados.
5. `npm test` passa integralmente.

Fora do expediente, o comportamento esperado muda: nenhum lead é atribuído e a Ana responde com a mensagem de fora do horário. Isso é o correto — para demonstrar a distribuição, testar entre 8h–12h ou 14h–18h de um dia útil.

---

> Criado em 2026-07-30 14:27 (-03) · Última modificação: 2026-07-30 14:48 (-03)
