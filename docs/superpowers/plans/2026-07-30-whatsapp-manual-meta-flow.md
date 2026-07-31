# WhatsApp Manual Meta Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar ao simulador um modo manual, sem IA, que usa botões e listas equivalentes à WhatsApp Cloud API para encaminhar o cliente ao departamento correto.

**Architecture:** Um módulo puro define as opções e resolve cada identificador para uma jornada e departamento. A página mantém a etapa transitória da triagem manual e só cria a conversa no store após receber a descrição; o celular e a trilha técnica representam os componentes interativos oficiais sem chamadas externas.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Zustand, Tailwind CSS 4, Vitest e componentes existentes.

## Global Constraints

- Manter os modos `Com Ana (IA)` e `Manual Meta` na mesma página.
- Não realizar chamadas externas, usar tokens ou enviar mensagens reais.
- Não usar IA, classificação probabilística ou interpretação livre no modo manual.
- Usar apenas botões de resposta, lista interativa, texto livre e webhooks equivalentes à Cloud API.
- Preservar os três departamentos existentes: Comercial, Administrativo e Recepção.
- Limitar o produto demonstrado ao escopo compatível com uma solução de até R$ 30 mil.
- Não criar construtor de fluxos, integrações externas, banco de dados, autenticação ou infraestrutura de produção.

---

### Task 1: Contrato do fluxo manual e eventos interativos

**Files:**
- Create: `lib/simulador/fluxo-manual.ts`
- Create: `lib/simulador/fluxo-manual.test.ts`
- Modify: `lib/simulador/cloud-api.ts`
- Modify: `lib/simulador/cloud-api.test.ts`

**Interfaces:**
- Produces: `OPCOES_INICIAIS`, `ASSUNTOS_CLIENTE`, `resolverOpcaoInicial(id)` e `resolverAssuntoCliente(id)`.
- `resolverOpcaoInicial` retorna `{ proximaEtapa: "assuntos" }` ou `{ proximaEtapa: "descricao", departamento, assunto }`.
- `resolverAssuntoCliente` retorna `{ proximaEtapa: "descricao", departamento, assunto }`.
- Produces: `eventosEntradaInterativaCloud(params)` and `eventosSaidaInterativaCloud(params)`.

- [ ] **Step 1: Write the failing routing tests**

```ts
import { describe, expect, it } from "vitest";
import {
  resolverAssuntoCliente,
  resolverOpcaoInicial,
} from "./fluxo-manual";

describe("fluxo manual", () => {
  it("abre a lista de assuntos para um cliente atual", () => {
    expect(resolverOpcaoInicial("cliente_atual")).toEqual({
      proximaEtapa: "assuntos",
    });
  });

  it("encaminha interesse em imóvel ao comercial", () => {
    expect(resolverOpcaoInicial("comprar_alugar")).toEqual({
      proximaEtapa: "descricao",
      departamento: "comercial",
      assunto: "Comprar ou alugar um imóvel",
    });
  });

  it("encaminha financeiro ao administrativo", () => {
    expect(resolverAssuntoCliente("financeiro_boletos")).toEqual({
      proximaEtapa: "descricao",
      departamento: "administrativo",
      assunto: "Financeiro e boletos",
    });
  });

  it("rejeita identificadores inexistentes", () => {
    expect(resolverOpcaoInicial("inexistente")).toBeNull();
    expect(resolverAssuntoCliente("inexistente")).toBeNull();
  });
});
```

- [ ] **Step 2: Run routing tests and verify RED**

Run: `pnpm test -- lib/simulador/fluxo-manual.test.ts`

Expected: FAIL porque `./fluxo-manual` ainda não existe.

- [ ] **Step 3: Implement the deterministic routing**

Criar opções literais com IDs estáveis:

```ts
export const OPCOES_INICIAIS = [
  { id: "comprar_alugar", titulo: "Comprar/alugar" },
  { id: "cliente_atual", titulo: "Já sou cliente" },
  { id: "outros_assuntos", titulo: "Outros assuntos" },
] as const;

export const ASSUNTOS_CLIENTE = [
  { id: "financeiro_boletos", titulo: "Financeiro/boletos", descricao: "Pagamentos, multas e segunda via" },
  { id: "manutencao", titulo: "Manutenção", descricao: "Reparo em imóvel alugado" },
  { id: "vistoria_saida", titulo: "Vistoria/saída", descricao: "Vistoria e desocupação" },
  { id: "repasse_proprietario", titulo: "Repasse proprietário", descricao: "Rendimentos e repasses" },
  { id: "recepcao_geral", titulo: "Recepção/geral", descricao: "Demais orientações" },
] as const;
```

Mapear `comprar_alugar` para `comercial`, `outros_assuntos` e `recepcao_geral` para `recepcao`, e os demais assuntos da lista para `administrativo`.

- [ ] **Step 4: Run routing tests and verify GREEN**

Run: `pnpm test -- lib/simulador/fluxo-manual.test.ts`

Expected: 4 testes passando.

- [ ] **Step 5: Write failing interactive event tests**

Adicionar em `cloud-api.test.ts`:

```ts
it("representa a resposta de um botão interativo", () => {
  const eventos = eventosEntradaInterativaCloud({
    tipo: "button_reply",
    id: "cliente_atual",
    titulo: "Já sou cliente",
    em: "2026-07-30T13:00:00.000Z",
  });
  expect(eventos[0].detalhe).toContain("interactive.button_reply");
  expect(eventos[0].detalhe).toContain("cliente_atual");
});

it("representa o envio de uma lista interativa", () => {
  const eventos = eventosSaidaInterativaCloud({
    tipo: "list",
    titulo: "Escolha o assunto",
    em: "2026-07-30T13:00:02.000Z",
    wamid: "wamid.manual.lista",
  });
  expect(eventos[0].detalhe).toContain("interactive.type=list");
  expect(eventos.map((evento) => evento.tipo)).toEqual([
    "message.accepted",
    "message.sent",
    "message.delivered",
    "message.read",
  ]);
});
```

- [ ] **Step 6: Run event tests and verify RED**

Run: `pnpm test -- lib/simulador/cloud-api.test.ts`

Expected: FAIL porque os dois builders interativos não existem.

- [ ] **Step 7: Implement interactive event builders**

`eventosEntradaInterativaCloud` deve produzir `webhook.received` e `webhook.acknowledged`, registrando `interactive.button_reply` ou `interactive.list_reply`, ID e título.

`eventosSaidaInterativaCloud` deve reutilizar a sequência de status da saída de texto, registrando `interactive.type=button` ou `interactive.type=list` no evento aceito e mantendo o `wamid` nos quatro eventos.

- [ ] **Step 8: Run focused and full tests**

Run:

```bash
pnpm test -- lib/simulador/fluxo-manual.test.ts lib/simulador/cloud-api.test.ts
pnpm test
```

Expected: todos os testes passam.

- [ ] **Step 9: Commit**

```bash
git add lib/simulador/fluxo-manual.ts lib/simulador/fluxo-manual.test.ts lib/simulador/cloud-api.ts lib/simulador/cloud-api.test.ts
git commit -m "feat: model Meta-compatible manual routing"
```

---

### Task 2: Experiência manual no celular e na Central Perez

**Files:**
- Modify: `app/(crm)/simulacao/page.tsx`
- Modify: `components/simulacao/celular-cliente.tsx`
- Modify: `components/simulacao/central-ao-vivo.tsx`

**Interfaces:**
- Consumes: opções, resolvers e builders da Task 1.
- Produces: seletor `Com Ana (IA)` / `Manual Meta`, controles de botão/lista e criação da conversa após a descrição.
- `CelularCliente` recebe `modo`, `etapaManual`, `historicoManual`, `aoSelecionarOpcaoInicial` e `aoSelecionarAssunto`.
- `CentralAoVivo` recebe `modo` e `triagemManual`.

- [ ] **Step 1: Add the mode and manual state to the page**

Usar:

```ts
type ModoSimulacao = "ia" | "manual";
type EtapaManual = "saudacao" | "opcao_inicial" | "assuntos" | "descricao" | "encaminhado";

type RegistroManual = {
  id: string;
  autor: "cliente" | "sistema";
  texto: string;
  formato: "texto" | "botoes" | "lista";
  em: string;
};
```

Reiniciar deve limpar o histórico manual, voltar para `saudacao` e manter o modo selecionado.

- [ ] **Step 2: Coordinate the first manual message**

Quando o cliente enviar `Olá` na etapa `saudacao`:

1. registrar o texto no histórico manual;
2. criar `eventosEntradaCloud`;
3. adicionar a resposta `Olá! Como podemos ajudar hoje?` no formato `botoes`;
4. criar `eventosSaidaInterativaCloud({ tipo: "button" })`;
5. avançar para `opcao_inicial`.

Nenhuma conversa deve ser criada no store nessa etapa.

- [ ] **Step 3: Coordinate initial button selection**

Ao selecionar uma opção:

1. criar `eventosEntradaInterativaCloud({ tipo: "button_reply" })`;
2. registrar a escolha como mensagem do cliente;
3. resolver o ID com `resolverOpcaoInicial`.

Para `cliente_atual`, registrar a mensagem de lista `Escolha o assunto do seu atendimento`, criar a saída `interactive.type=list` e avançar para `assuntos`.

Para as opções diretas, armazenar departamento e assunto, registrar `Conte brevemente como podemos ajudar` e avançar para `descricao`.

- [ ] **Step 4: Coordinate list selection and description**

Ao selecionar um item:

1. criar `interactive.list_reply`;
2. armazenar departamento e assunto;
3. registrar a escolha e o pedido de descrição;
4. avançar para `descricao`.

Ao enviar a descrição:

1. chamar `receberMensagem` com `departamentoDireto`;
2. usar como texto `${assunto}: ${descricao}`;
3. registrar a confirmação `Recebemos sua solicitação e encaminhamos para nossa equipe de <departamento>.`;
4. criar os eventos de saída da confirmação;
5. avançar para `encaminhado`.

- [ ] **Step 5: Render authentic interactive controls**

No celular:

- mostrar os três botões abaixo da mensagem interativa;
- mostrar a mensagem de lista com o botão `Escolher assunto`;
- ao clicar, abrir uma folha sobre o celular com os cinco itens, títulos e descrições;
- fechar a folha após a seleção;
- bloquear texto nas etapas de escolha;
- liberar texto em `saudacao`, `descricao` e `encaminhado`.

- [ ] **Step 6: Differentiate manual context in the operations panel**

Durante a triagem anterior à criação da conversa, renderizar:

- status `Triagem manual em andamento`;
- assunto selecionado, quando existir;
- aviso `O setor será definido pelos IDs oficiais dos botões, sem IA`.

Após o encaminhamento, trocar `Contexto organizado pela Ana` por `Contexto informado pelo cliente` quando `modo === "manual"`.

- [ ] **Step 7: Verify TypeScript and lint**

Run:

```bash
pnpm exec tsc --noEmit
pnpm exec eslint 'app/(crm)/simulacao/page.tsx' components/simulacao lib/simulador
```

Expected: ambos encerram com código `0`.

- [ ] **Step 8: Commit**

```bash
git add 'app/(crm)/simulacao/page.tsx' components/simulacao
git commit -m "feat: add manual WhatsApp flow to live simulator"
```

---

### Task 3: Validação da apresentação

**Files:**
- Modify only if verification reveals a defect in files from Task 2.

**Interfaces:**
- Produces: ambos os modos demonstráveis na rota `/simulacao`.

- [ ] **Step 1: Validate the manual browser flow**

No navegador:

1. abrir `/simulacao`;
2. selecionar `Manual Meta`;
3. iniciar;
4. enviar `Olá`;
5. clicar `Já sou cliente`;
6. abrir `Escolher assunto`;
7. selecionar `Financeiro/boletos`;
8. digitar a solicitação de revisão da multa;
9. confirmar Administrativo e Zilda;
10. responder como Zilda;
11. confirmar resposta no celular e eventos técnicos;
12. reiniciar e confirmar o estado inicial.

- [ ] **Step 2: Validate direct routes**

Reiniciar e verificar:

- `Comprar/alugar` encaminha ao Comercial;
- `Outros assuntos` encaminha à Recepção.

- [ ] **Step 3: Revalidate the AI flow**

Selecionar `Com Ana (IA)` e repetir a saudação e a solicitação financeira já existentes, confirmando que o modo anterior não regrediu.

- [ ] **Step 4: Run final verification**

Run:

```bash
pnpm test
pnpm lint
pnpm exec tsc --noEmit
pnpm build
git diff --check
```

Expected: todos encerram com código `0`.

- [ ] **Step 5: Review scope language**

Confirmar visualmente e no diff que a interface não promete conexão real, integrações externas, banco de dados, automações financeiras ou outros itens excluídos no design.
