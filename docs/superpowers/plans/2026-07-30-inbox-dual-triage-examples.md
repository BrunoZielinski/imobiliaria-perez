# Inbox Dual Triage Examples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Exibir dois exemplos fixados em Conversas, um com triagem da Ana e outro com o fluxo Manual Meta, mantendo o histórico e o contexto coerentes com cada formato.

**Architecture:** O modelo passa a registrar explicitamente o modo de triagem e a apresentação opcional de mensagens interativas. O seed fornece dois exemplos completos; helpers puros separam exemplos da fila e produzem rótulos, enquanto os componentes existentes apenas renderizam esses contratos.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Zustand, Tailwind CSS 4, Vitest e componentes existentes.

## Global Constraints

- Manter `Marcos Oliveira` como exemplo `Com Ana`.
- Adicionar `Renata Almeida` como exemplo `Manual Meta`.
- Fixar os dois exemplos antes da fila operacional.
- Não permitir trocar o formato de uma conversa ativa.
- Mensagens interativas históricas não são clicáveis.
- Não sincronizar payloads reais nem criar configuração administrativa do fluxo.
- Preservar distribuição, permissões e envio humano existentes.

---

### Task 1: Metadados de triagem e exemplos no seed

**Files:**
- Modify: `lib/tipos.ts`
- Modify: `lib/mock/seed.ts`
- Create: `lib/mock/seed-exemplos.test.ts`
- Modify: `lib/data/index.ts`

**Interfaces:**
- Produces: `ModoTriagem`, `ApresentacaoMensagem`, `Conversa.modoTriagem`, `Mensagem.apresentacao` e autor `sistema`.
- Produces: conversa `cv-9` de Renata Almeida com `modoTriagem: "manual"`.
- `receberMensagem` cria conversa com modo `ana` quando a Ana é usada, `manual` quando `modoTriagem` é informado e `direto` nos outros canais.

- [ ] **Step 1: Write failing seed tests**

Criar:

```ts
import { describe, expect, it } from "vitest";
import { criarSeed } from "./seed";

describe("exemplos de triagem no seed", () => {
  const estado = criarSeed(new Date("2026-07-30T13:00:00.000Z"));

  it("mantém Marcos como exemplo de triagem com Ana", () => {
    const contato = estado.contatos.find((item) => item.nome === "Marcos Oliveira");
    const conversa = estado.conversas.find((item) => item.contatoId === contato?.id);

    expect(conversa).toMatchObject({
      id: "cv-4",
      modoTriagem: "ana",
      departamento: "administrativo",
    });
  });

  it("inclui Renata como exemplo do Manual Meta", () => {
    const contato = estado.contatos.find((item) => item.nome === "Renata Almeida");
    const conversa = estado.conversas.find((item) => item.contatoId === contato?.id);
    const mensagens = estado.mensagens.filter(
      (mensagem) => mensagem.conversaId === conversa?.id,
    );

    expect(conversa).toMatchObject({
      id: "cv-9",
      modoTriagem: "manual",
      departamento: "administrativo",
      atendenteId: "at-5",
    });
    expect(mensagens.some((mensagem) => mensagem.autor === "sistema")).toBe(true);
    expect(
      mensagens.some((mensagem) => mensagem.apresentacao?.tipo === "botoes"),
    ).toBe(true);
    expect(
      mensagens.some((mensagem) => mensagem.apresentacao?.tipo === "lista"),
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run the seed tests and verify RED**

Run: `pnpm exec vitest run lib/mock/seed-exemplos.test.ts`

Expected: FAIL porque `modoTriagem`, Renata e as apresentações interativas ainda não existem.

- [ ] **Step 3: Add the type contracts**

Adicionar em `lib/tipos.ts`:

```ts
export type ModoTriagem = "ana" | "manual" | "direto";
export type Autor = "contato" | "ana" | "sistema" | "atendente";

export type ApresentacaoMensagem =
  | { tipo: "botoes"; opcoes: string[] }
  | { tipo: "lista"; rotulo: string; opcoes: string[] }
  | { tipo: "button_reply" }
  | { tipo: "list_reply" };
```

Adicionar `modoTriagem: ModoTriagem` em `Conversa` e `apresentacao?: ApresentacaoMensagem` em `Mensagem`.

- [ ] **Step 4: Populate every existing conversation mode**

Em `lib/mock/seed.ts`:

- `cv-1`, `cv-2`, `cv-4` e `cv-6`: `modoTriagem: "ana"`;
- `cv-3`, `cv-5`, `cv-7` e `cv-8`: `modoTriagem: "direto"`.

Adicionar `Renata Almeida` após o contato de demonstração. O novo contato será `ct-10`.

Adicionar `cv-9`:

```ts
{
  id: "cv-9",
  contatoId: "ct-10",
  canal: "whatsapp",
  departamento: "administrativo",
  modoTriagem: "manual",
  status: "atendimento",
  atendenteId: "at-5",
  criadaEm: minutosAtras(base, 70),
  entrouNaFilaEm: minutosAtras(base, 66),
  primeiraRespostaEm: minutosAtras(base, 59),
  contextoAna: "Financeiro e boletos: quero confirmar o vencimento deste mês.",
  naoLidas: 0,
}
```

Adicionar mensagens `ms-28` a `ms-36` reproduzindo o fluxo do design. As mensagens automáticas usam `autor: "sistema"`. A saudação interativa usa:

```ts
apresentacao: {
  tipo: "botoes",
  opcoes: ["Comprar/alugar", "Já sou cliente", "Outros assuntos"],
}
```

A lista usa:

```ts
apresentacao: {
  tipo: "lista",
  rotulo: "Escolher assunto",
  opcoes: [
    "Financeiro/boletos",
    "Manutenção",
    "Vistoria/saída",
    "Repasse proprietário",
    "Recepção/geral",
  ],
}
```

As escolhas de Renata usam `button_reply` e `list_reply`.

- [ ] **Step 5: Record the mode when creating conversations**

Adicionar `modoTriagem?: ModoTriagem` aos parâmetros de `receberMensagem`.

Definir:

```ts
const viaAna = canal === "whatsapp" && !departamentoDireto && modoTriagem !== "manual";
const modoDaConversa: ModoTriagem = viaAna
  ? "ana"
  : modoTriagem ?? "direto";
```

Gravar `modoTriagem: modoDaConversa` na nova conversa. Na simulação manual, passar `modoTriagem: "manual"` junto com `departamentoDireto`.

- [ ] **Step 6: Run focused and full tests**

Run:

```bash
pnpm exec vitest run lib/mock/seed-exemplos.test.ts
pnpm test
pnpm exec tsc --noEmit
```

Expected: todos encerram com código `0`.

- [ ] **Step 7: Commit**

```bash
git add lib/tipos.ts lib/mock/seed.ts lib/mock/seed-exemplos.test.ts lib/data/index.ts 'app/(crm)/simulacao/page.tsx'
git commit -m "feat: add triage mode metadata and inbox examples"
```

---

### Task 2: Separação e rótulos da lista

**Files:**
- Create: `lib/inbox/apresentacao.ts`
- Create: `lib/inbox/apresentacao.test.ts`
- Modify: `components/inbox/lista-conversas.tsx`

**Interfaces:**
- Consumes: `Conversa[]` e `ModoTriagem`.
- Produces: `separarExemplosTriagem(conversas)` e `rotuloModoTriagem(modo)`.
- Retorna exemplos somente para `cv-4` e `cv-9`, nesta ordem, sem removê-los do store.

- [ ] **Step 1: Write failing presentation tests**

```ts
import { describe, expect, it } from "vitest";
import type { Conversa } from "@/lib/tipos";
import { rotuloModoTriagem, separarExemplosTriagem } from "./apresentacao";

const conversa = (id: string, modoTriagem: Conversa["modoTriagem"]) =>
  ({ id, modoTriagem } as Conversa);

describe("apresentação dos modos de triagem", () => {
  it("separa os dois exemplos na ordem da apresentação", () => {
    const resultado = separarExemplosTriagem([
      conversa("cv-9", "manual"),
      conversa("cv-2", "ana"),
      conversa("cv-4", "ana"),
    ]);

    expect(resultado.exemplos.map((item) => item.id)).toEqual(["cv-4", "cv-9"]);
    expect(resultado.operacionais.map((item) => item.id)).toEqual(["cv-2"]);
  });

  it("fornece rótulos apenas para os formatos comparáveis", () => {
    expect(rotuloModoTriagem("ana")).toBe("Com Ana");
    expect(rotuloModoTriagem("manual")).toBe("Manual Meta");
    expect(rotuloModoTriagem("direto")).toBeNull();
  });
});
```

- [ ] **Step 2: Run and verify RED**

Run: `pnpm exec vitest run lib/inbox/apresentacao.test.ts`

Expected: FAIL porque `lib/inbox/apresentacao.ts` ainda não existe.

- [ ] **Step 3: Implement the pure helpers**

Usar `const IDS_EXEMPLOS = ["cv-4", "cv-9"] as const`. `separarExemplosTriagem` deve ordenar pelos IDs constantes, não pela data ou seleção.

- [ ] **Step 4: Render the two list sections**

Em `ListaConversas`:

1. aplicar busca e departamento antes da separação;
2. chamar `separarExemplosTriagem`;
3. renderizar `Exemplos de triagem` quando houver exemplos;
4. renderizar `Prioridade de atendimento` com as demais conversas;
5. preservar os critérios atuais de não lidas, fila e data somente na lista operacional.

Extrair o cartão repetido para uma função local `renderizarConversa(conversa)`. Dentro do cartão, usar `rotuloModoTriagem` e mostrar:

- selo violeta com `Sparkles` para Ana;
- selo azul com `ListChecks` para Manual Meta;
- nenhum selo para `direto`.

- [ ] **Step 5: Run tests, lint and TypeScript**

Run:

```bash
pnpm exec vitest run lib/inbox/apresentacao.test.ts
pnpm test
pnpm exec eslint components/inbox/lista-conversas.tsx lib/inbox
pnpm exec tsc --noEmit
```

Expected: todos encerram com código `0`.

- [ ] **Step 6: Commit**

```bash
git add lib/inbox/apresentacao.ts lib/inbox/apresentacao.test.ts components/inbox/lista-conversas.tsx
git commit -m "feat: pin dual triage examples in inbox"
```

---

### Task 3: Histórico coerente com Ana e Manual Meta

**Files:**
- Create: `lib/inbox/thread-apresentacao.test.ts`
- Modify: `components/inbox/thread.tsx`
- Modify: `components/inbox/ficha-lead.tsx`

**Interfaces:**
- Consumes: `modoTriagem`, `Mensagem.apresentacao` e autor `sistema`.
- Produces: selo no cabeçalho, contexto correto e cartões históricos de botões/listas.

- [ ] **Step 1: Write failing static render tests**

Criar um teste com `renderToStaticMarkup` para um componente puro local exportado como `MensagemHistorica`. O teste Manual Meta deve esperar `Automação Meta`, `Já sou cliente` e `Escolher assunto`. O teste Ana deve esperar `Ana` e não conter `Automação Meta`.

```ts
expect(htmlManual).toContain("Automação Meta");
expect(htmlManual).toContain("Já sou cliente");
expect(htmlManual).toContain("Escolher assunto");
expect(htmlAna).toContain("Ana");
expect(htmlAna).not.toContain("Automação Meta");
```

- [ ] **Step 2: Run and verify RED**

Run: `pnpm exec vitest run lib/inbox/thread-apresentacao.test.ts`

Expected: FAIL porque `MensagemHistorica` e a renderização manual ainda não existem.

- [ ] **Step 3: Implement historical interactive messages**

Exportar `MensagemHistorica` de `components/inbox/thread.tsx` com props:

```ts
{
  mensagem: Mensagem;
  modoTriagem: ModoTriagem;
}
```

Regras:

- `contato`: esquerda, fundo branco;
- `ana`: direita, fundo primário suave, rótulo `Ana`;
- `sistema`: direita, fundo azul suave, rótulo `Automação Meta`;
- `atendente`: direita, fundo primário sólido.

Para `botoes`, renderizar opções em linhas com bordas e `aria-disabled="true"`. Para `lista`, renderizar `rotulo`, ícone `ListChecks` e a quantidade de opções. Respostas `button_reply` e `list_reply` usam uma pequena identificação `Escolha do cliente`.

- [ ] **Step 4: Add mode and context labels**

No cabeçalho do `Thread`, mostrar `Com Ana` ou `Manual Meta` ao lado de canal e departamento.

No cartão de contexto:

- `ana`: `Contexto organizado pela Ana` com `Sparkles`;
- `manual`: `Contexto informado pelo cliente` com `ListChecks`;
- `direto`: `Contexto do atendimento` sem selo de automação.

Aplicar a mesma regra em `FichaLead`, trocando `Captado pela Ana` pelo rótulo correspondente.

- [ ] **Step 5: Verify the inbox**

Run:

```bash
pnpm exec vitest run lib/inbox/thread-apresentacao.test.ts
pnpm test
pnpm lint
pnpm exec tsc --noEmit
```

Expected: todos encerram com código `0`.

- [ ] **Step 6: Browser validation**

Em `/inbox`:

1. confirmar a seção `Exemplos de triagem`;
2. selecionar Marcos e verificar selo, Ana e contexto organizado;
3. selecionar Renata e verificar selo Manual Meta, botões, lista e Automação Meta;
4. confirmar que `Prioridade de atendimento` permanece abaixo;
5. responder no exemplo Manual Meta e confirmar a nova bolha humana.

- [ ] **Step 7: Commit**

```bash
git add components/inbox/thread.tsx components/inbox/ficha-lead.tsx lib/inbox/thread-apresentacao.test.ts
git commit -m "feat: render AI and manual histories in inbox"
```
