# Rent Reminder Additional Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a aba visual `Cobranças` para demonstrar lembretes programados antes do vencimento, identificando-a explicitamente como módulo adicional.

**Architecture:** Dados e transições ficam em módulos puros sem integração com o store do CRM. A página cliente mantém uma cópia local da agenda e coordena componentes focados de resumo, tabela, detalhe e diálogo; recarregar restaura os exemplos.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, date-fns, Vitest e componentes existentes.

## Global Constraints

- Mostrar `Módulo adicional — não incluído no núcleo da proposta de R$ 30 mil`.
- Limitar o objetivo a lembrar o locatário antes do vencimento.
- Não enviar mensagens reais.
- Não gerar boleto ou consultar pagamento.
- Não integrar banco, ERP ou sistema de locação.
- Não oferecer cobrança após atraso, multa, acordo ou negativação.
- Identificar template e dados como demonstração.
- Manter o layout adequado para apresentação em MacBook.

---

### Task 1: Contrato e transições locais da agenda

**Files:**
- Create: `lib/mock/cobrancas.ts`
- Create: `lib/cobrancas/agenda.ts`
- Create: `lib/cobrancas/agenda.test.ts`

**Interfaces:**
- Produces: `StatusLembrete`, `LembreteCobranca`, `NOVO_LEMBRETE_PADRAO`, `LEMBRETES_DEMO`.
- Produces: `programarLembrete`, `pausarLembrete`, `cancelarLembrete` e `resumoAgenda`.

- [ ] **Step 1: Write failing agenda tests**

```ts
import { describe, expect, it } from "vitest";
import { LEMBRETES_DEMO } from "@/lib/mock/cobrancas";
import {
  cancelarLembrete,
  pausarLembrete,
  programarLembrete,
  resumoAgenda,
} from "./agenda";

describe("agenda demonstrativa de lembretes", () => {
  it("programa um lembrete local como agendado", () => {
    const resultado = programarLembrete(LEMBRETES_DEMO, {
      locatario: "Renata Almeida",
      contrato: "LOC-2048",
      imovel: "Rua Santos, 245",
      vencimento: "2026-08-10",
      antecedenciaDias: 3,
      horario: "09:00",
    });

    expect(resultado.at(-1)).toMatchObject({
      locatario: "Renata Almeida",
      status: "agendado",
      agendadoPara: "2026-08-07T09:00:00-03:00",
    });
  });

  it("pausa e cancela somente itens editáveis", () => {
    const agendado = LEMBRETES_DEMO.find((item) => item.status === "agendado")!;
    const enviado = LEMBRETES_DEMO.find((item) => item.status === "enviado")!;

    expect(pausarLembrete(LEMBRETES_DEMO, agendado.id)).toContainEqual({
      ...agendado,
      status: "pausado",
    });
    expect(cancelarLembrete(LEMBRETES_DEMO, enviado.id)).toEqual(LEMBRETES_DEMO);
  });

  it("resume os quatro indicadores da agenda", () => {
    expect(resumoAgenda(LEMBRETES_DEMO, new Date("2026-07-30T12:00:00-03:00"))).toEqual({
      programados: 4,
      proximosSeteDias: 2,
      enviados: 2,
      pausados: 1,
    });
  });
});
```

- [ ] **Step 2: Run and verify RED**

Run: `pnpm exec vitest run lib/cobrancas/agenda.test.ts`

Expected: FAIL porque os módulos ainda não existem.

- [ ] **Step 3: Define the demonstration data**

Em `lib/mock/cobrancas.ts`:

```ts
export type StatusLembrete = "agendado" | "enviado" | "pausado" | "cancelado";

export type LembreteCobranca = {
  id: string;
  locatario: string;
  contrato: string;
  imovel: string;
  vencimento: string;
  antecedenciaDias: 1 | 3 | 5 | 7;
  horario: string;
  agendadoPara: string;
  template: "lembrete_vencimento_aluguel";
  status: StatusLembrete;
};
```

Criar sete exemplos: quatro `agendado`, dois `enviado` e um `pausado`. Usar datas entre `2026-07-30` e `2026-08-15`, com dois agendamentos nos sete dias seguintes a `2026-07-30`.

- [ ] **Step 4: Implement pure transitions**

`programarLembrete` calcula `agendadoPara` subtraindo `antecedenciaDias` de `vencimento` e aplica `horario` com offset `-03:00`.

`pausarLembrete` e `cancelarLembrete` alteram somente itens `agendado`. Itens `enviado`, `pausado` e `cancelado` permanecem inalterados.

`resumoAgenda` retorna:

```ts
{
  programados: quantidade com status "agendado";
  proximosSeteDias: agendados entre agora e agora + 7 dias;
  enviados: quantidade com status "enviado";
  pausados: quantidade com status "pausado";
}
```

- [ ] **Step 5: Run focused and full tests**

Run:

```bash
pnpm exec vitest run lib/cobrancas/agenda.test.ts
pnpm test
pnpm exec tsc --noEmit
```

Expected: todos encerram com código `0`.

- [ ] **Step 6: Commit**

```bash
git add lib/mock/cobrancas.ts lib/cobrancas/agenda.ts lib/cobrancas/agenda.test.ts
git commit -m "feat: model demonstration rent reminders"
```

---

### Task 2: Resumo, agenda e detalhe

**Files:**
- Create: `components/cobrancas/resumo-cobrancas.tsx`
- Create: `components/cobrancas/agenda-lembretes.tsx`
- Create: `components/cobrancas/detalhe-lembrete.tsx`
- Create: `lib/cobrancas/apresentacao.test.ts`

**Interfaces:**
- `ResumoCobrancas` recebe o retorno de `resumoAgenda`.
- `AgendaLembretes` recebe `lembretes`, `selecionadoId` e `aoSelecionar`.
- `DetalheLembrete` recebe `lembrete`, `aoPausar` e `aoCancelar`.

- [ ] **Step 1: Write failing static render tests**

Usar `renderToStaticMarkup` e `createElement`:

```ts
const html = renderToStaticMarkup(
  createElement(ResumoCobrancas, {
    resumo: {
      programados: 4,
      proximosSeteDias: 2,
      enviados: 2,
      pausados: 1,
    },
  }),
);

expect(html).toContain("Programados");
expect(html).toContain("Próximos 7 dias");
expect(html).toContain(">4<");
expect(html).toContain(">2<");
```

Renderizar também `DetalheLembrete` com um item agendado e esperar `Template Meta aprovado — demonstração`, `Pausar` e `Cancelar`.

- [ ] **Step 2: Run and verify RED**

Run: `pnpm exec vitest run lib/cobrancas/apresentacao.test.ts`

Expected: FAIL porque os componentes ainda não existem.

- [ ] **Step 3: Build the summary cards**

Usar quatro cartões em grid com ícones:

- `CalendarClock`: Programados;
- `CalendarDays`: Próximos 7 dias;
- `MessageCheck`: Enviados;
- `PauseCircle`: Pausados.

Cada cartão mostra valor, rótulo e apoio curto. Não mostrar valor financeiro.

- [ ] **Step 4: Build the agenda**

Criar uma tabela com colunas:

- Locatário;
- Contrato / imóvel;
- Vencimento;
- Lembrete;
- Programado para;
- Status.

Cada linha é um botão acessível por `aria-label="Abrir lembrete de <nome>"`. Status usam cores distintas. A linha selecionada usa fundo primário suave.

- [ ] **Step 5: Build the detail panel**

Mostrar:

- selo `Template Meta aprovado — demonstração`;
- locatário, contrato, imóvel e vencimento;
- prévia preenchida do template;
- linha do tempo `Programado`, `Processado`, `Enviado`;
- botões `Pausar` e `Cancelar` somente quando status for `agendado`;
- texto `Ação indisponível para lembretes enviados` quando status for `enviado`.

- [ ] **Step 6: Run tests and static verification**

Run:

```bash
pnpm exec vitest run lib/cobrancas/apresentacao.test.ts
pnpm test
pnpm exec eslint components/cobrancas lib/cobrancas
pnpm exec tsc --noEmit
```

Expected: todos encerram com código `0`.

- [ ] **Step 7: Commit**

```bash
git add components/cobrancas lib/cobrancas/apresentacao.test.ts
git commit -m "feat: add rent reminder agenda views"
```

---

### Task 3: Diálogo, página e navegação

**Files:**
- Create: `components/cobrancas/programar-lembrete.tsx`
- Create: `app/(crm)/cobrancas/page.tsx`
- Modify: `components/crm/navegacao.tsx`

**Interfaces:**
- `ProgramarLembrete` recebe `aberto`, `aoAlterarAberto` e `aoProgramar`.
- A página mantém `lembretes`, `selecionadoId` e `dialogoAberto`.
- A navegação expõe `/cobrancas` com o rótulo `Cobranças`.

- [ ] **Step 1: Build the controlled scheduling dialog**

Usar `Dialog` com campos controlados:

- locatário: `Renata Almeida`;
- contrato: `LOC-2048`;
- imóvel: `Rua Santos, 245`;
- vencimento: `2026-08-10`;
- antecedência: `3`;
- horário: `09:00`.

Mostrar abaixo a prévia:

```text
Olá, Renata Almeida. O aluguel do imóvel Rua Santos, 245 vence em 10/08/2026. Caso já tenha realizado o pagamento, desconsidere esta mensagem.
```

Ao confirmar, chamar `aoProgramar`, fechar o diálogo e limpar somente o estado `aberto`.

- [ ] **Step 2: Build the page**

O cabeçalho deve conter:

- selo `Protótipo visual`;
- título `Lembretes de cobrança`;
- descrição `Avise o locatário antes do vencimento`;
- botão `Programar lembrete`;
- faixa destacada com o texto exato `Módulo adicional — não incluído no núcleo da proposta de R$ 30 mil`.

Layout:

1. resumo em quatro cartões;
2. grade `minmax(0, 1fr) 22rem`;
3. agenda à esquerda;
4. detalhe à direita.

Usar `useState(() => LEMBRETES_DEMO.map((item) => ({ ...item })))`, evitando persistência no store.

- [ ] **Step 3: Wire local actions**

- `aoProgramar`: aplicar `programarLembrete`, selecionar o novo ID;
- `aoPausar`: aplicar `pausarLembrete`;
- `aoCancelar`: pedir confirmação com `AlertDialog` e aplicar `cancelarLembrete`;
- nenhuma função importa `fetch`, `receberMensagem` ou `enviarMensagem`.

- [ ] **Step 4: Add the navigation item**

Adicionar após `Carteira`:

```ts
{
  href: "/cobrancas",
  rotulo: "Cobranças",
  icone: CalendarClock,
  adicional: true,
}
```

Adaptar o mapa para mostrar um ponto âmbar e `title="Módulo adicional"` quando `adicional` for verdadeiro.

- [ ] **Step 5: Verify TypeScript and lint**

Run:

```bash
pnpm exec tsc --noEmit
pnpm exec eslint 'app/(crm)/cobrancas/page.tsx' components/cobrancas components/crm/navegacao.tsx
pnpm test
```

Expected: todos encerram com código `0`.

- [ ] **Step 6: Browser validation**

Em `/cobrancas`:

1. confirmar o aviso de módulo adicional;
2. conferir quatro indicadores e agenda preenchida;
3. selecionar um lembrete e conferir a prévia;
4. abrir `Programar lembrete`;
5. confirmar a prévia do template;
6. programar e verificar a nova linha;
7. pausar a nova programação;
8. cancelar outro agendamento mediante confirmação;
9. recarregar e confirmar a restauração dos dados.

- [ ] **Step 7: Commit**

```bash
git add 'app/(crm)/cobrancas/page.tsx' components/cobrancas/programar-lembrete.tsx components/crm/navegacao.tsx
git commit -m "feat: add additional rent reminder module"
```

---

### Task 4: Final presentation verification

**Files:**
- Modify only files from Tasks 1-3 if browser verification reveals a defect.

**Interfaces:**
- Produces: `/inbox` with two examples and `/cobrancas` as an additional module.

- [ ] **Step 1: Revalidate both routes at 1440 × 900**

Confirmar que:

- os dois exemplos ficam visíveis sem esconder a fila;
- o histórico Manual Meta cabe no painel e diferencia a automação;
- a agenda e o detalhe de cobrança não exigem rolagem horizontal;
- o aviso de módulo adicional permanece visível.

- [ ] **Step 2: Check scope language**

Pesquisar por termos que possam prometer integração real:

```bash
rg -n "pagamento confirmado|boleto gerado|enviado pela Meta|integração ativa" app components lib
```

Expected: nenhum texto novo afirma essas capacidades.

- [ ] **Step 3: Run final verification**

Run:

```bash
pnpm test
pnpm lint
pnpm exec tsc --noEmit
pnpm build
git diff --check
```

Expected: todos encerram com código `0`.
