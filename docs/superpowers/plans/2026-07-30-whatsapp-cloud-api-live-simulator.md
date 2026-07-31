# WhatsApp Cloud API Live Simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar uma simulação ao vivo na qual o apresentador envia mensagens como cliente e acompanha, na mesma tela, a jornada pela Ana, pela distribuição da Central Perez e pelos eventos equivalentes à WhatsApp Cloud API.

**Architecture:** A simulação reutiliza o store, `receberMensagem` e `enviarMensagem` já existentes. Um módulo puro descreve os eventos equivalentes da Cloud API; uma página cliente coordena um celular virtual, a trilha de eventos e um painel operacional, todos derivados do mesmo estado.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Zustand, Tailwind CSS 4, Vitest e componentes shadcn/Base UI já instalados.

## Global Constraints

- Não realizar chamadas externas, usar tokens ou enviar mensagens reais.
- Identificar todos os eventos técnicos como simulação.
- Reutilizar o classificador real da Ana e a distribuição existente.
- Manter o fluxo repetível com relógio de demonstração dentro do expediente.
- Preservar as demais conversas ao reiniciar apenas o contato da simulação.
- Limitar o escopo a mensagens de texto.

---

### Task 1: Contrato de eventos simulados da Cloud API

**Files:**
- Create: `lib/simulador/cloud-api.ts`
- Test: `lib/simulador/cloud-api.test.ts`

**Interfaces:**
- Produces: `EventoCloud`, `eventosEntradaCloud(texto, em)` e `eventosSaidaCloud(params)`.
- `eventosEntradaCloud` retorna `webhook.received` e `webhook.acknowledged`.
- `eventosSaidaCloud` retorna `message.accepted`, `message.sent`, `message.delivered` e `message.read`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { eventosEntradaCloud, eventosSaidaCloud } from "./cloud-api";

describe("eventos da Cloud API simulada", () => {
  it("representa o webhook de entrada e sua confirmação", () => {
    const eventos = eventosEntradaCloud("Olá", "2026-07-30T13:00:00.000Z");
    expect(eventos.map((evento) => evento.tipo)).toEqual([
      "webhook.received",
      "webhook.acknowledged",
    ]);
    expect(eventos[0].detalhe).toContain("Olá");
    expect(eventos[1].detalhe).toContain("200 OK");
  });

  it("representa aceite, envio, entrega e leitura da resposta", () => {
    const eventos = eventosSaidaCloud({
      texto: "Olá! Eu sou a Ana.",
      autor: "ana",
      em: "2026-07-30T13:00:02.000Z",
      wamid: "wamid.demo-1",
    });
    expect(eventos.map((evento) => evento.tipo)).toEqual([
      "message.accepted",
      "message.sent",
      "message.delivered",
      "message.read",
    ]);
    expect(eventos.every((evento) => evento.simulado)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `/Users/jeremiasmatra/Library/pnpm/bin/pnpm test -- lib/simulador/cloud-api.test.ts`

Expected: FAIL porque `./cloud-api` ainda não existe.

- [ ] **Step 3: Implement the pure event builders**

Criar o tipo:

```ts
export type TipoEventoCloud =
  | "webhook.received"
  | "webhook.acknowledged"
  | "message.accepted"
  | "message.sent"
  | "message.delivered"
  | "message.read";

export type EventoCloud = {
  id: string;
  tipo: TipoEventoCloud;
  rotulo: string;
  detalhe: string;
  em: string;
  simulado: true;
};
```

Usar IDs determinísticos derivados do `wamid`, tipo e instante. Os eventos de saída devem manter o mesmo `wamid` em seus detalhes e avançar o instante em um segundo por status.

- [ ] **Step 4: Run focused and full tests**

Run:

```bash
/Users/jeremiasmatra/Library/pnpm/bin/pnpm test -- lib/simulador/cloud-api.test.ts
/Users/jeremiasmatra/Library/pnpm/bin/pnpm test
```

Expected: todos os testes passam.

- [ ] **Step 5: Commit**

```bash
git add lib/simulador/cloud-api.ts lib/simulador/cloud-api.test.ts
git commit -m "feat: model simulated WhatsApp Cloud API events"
```

---

### Task 2: Jornada ao vivo de cliente e atendente

**Files:**
- Create: `app/(crm)/simulacao/page.tsx`
- Create: `components/simulacao/celular-cliente.tsx`
- Create: `components/simulacao/eventos-cloud.tsx`
- Create: `components/simulacao/central-ao-vivo.tsx`
- Modify: `lib/mock/seed.ts`

**Interfaces:**
- Consumes: `eventosEntradaCloud`, `eventosSaidaCloud`, `receberMensagem`, `enviarMensagem` e `useCrm`.
- Produces: página `/simulacao` com envio do cliente, resposta humana e reinício isolado.
- `CelularCliente` recebe mensagens, rascunho, callbacks de alteração e envio.
- `EventosCloud` recebe `EventoCloud[]`.
- `CentralAoVivo` recebe conversa, contato, responsável, mensagens e callback de resposta.

- [ ] **Step 1: Add the demonstration contact to the seed**

Adicionar ao final de `CONTATOS`:

```ts
{
  nome: "Cliente da apresentação",
  telefone: "43 99999-0000",
  email: null,
}
```

O contato será `ct-9` e não terá conversa inicial.

- [ ] **Step 2: Build the isolated simulation reset**

Na página, implementar `prepararSimulacao()` com `useCrm.getState().aplicar`. A mutação deve:

- garantir que `ct-9` existe mesmo quando o Zustand restaurar estado antigo;
- remover somente conversas de `ct-9`;
- remover mensagens e eventos ligados às conversas removidas;
- manter contatos, conversas, leads e atendentes restantes;
- definir o ponteiro administrativo como `0` para a demonstração começar pela Zilda.

- [ ] **Step 3: Build the client phone**

Criar um celular virtual com:

- cabeçalho “Imobiliária Perez” e estado “conta comercial”;
- fundo e bolhas inspirados no WhatsApp;
- mensagens do contato à direita e mensagens da Ana/atendente à esquerda;
- horário e confirmações visuais;
- textarea e botão de enviar;
- sugestões clicáveis `Olá` e a solicitação financeira completa.

- [ ] **Step 4: Build the Cloud API event rail**

Renderizar os eventos em ordem cronológica com:

- selo “SIMULAÇÃO”;
- método técnico (`WEBHOOK`, `200 OK`, `POST /messages`);
- status `sent`, `delivered` e `read`;
- `wamid` abreviado;
- estado vazio explicando que os eventos surgirão após o primeiro envio.

- [ ] **Step 5: Build the live operations panel**

Mostrar:

- estado atual da conversa;
- contexto captado pela Ana;
- departamento;
- responsável;
- últimas mensagens;
- campo “Responder como atendente”.

Quando houver responsável, o envio deve usar `enviarMensagem`; quando ainda estiver com a Ana, o campo permanece desabilitado.

- [ ] **Step 6: Coordinate the live flow**

No envio do cliente:

1. gerar e anexar os eventos de entrada;
2. capturar os IDs das mensagens antes da chamada;
3. chamar `receberMensagem` com `ct-9`, canal `whatsapp` e relógio iniciado em `2026-07-30T10:00:00-03:00`;
4. identificar novas mensagens da Ana;
5. criar os eventos de saída de cada nova mensagem;
6. avançar o relógio em um minuto.

No envio humano, chamar `enviarMensagem`, criar os eventos de saída e avançar o relógio.

- [ ] **Step 7: Verify the page**

Run:

```bash
/Users/jeremiasmatra/Library/pnpm/bin/pnpm exec tsc --noEmit
/Users/jeremiasmatra/Library/pnpm/bin/pnpm exec eslint 'app/(crm)/simulacao/page.tsx' components/simulacao lib/simulador
```

Expected: ambos encerram com código `0`.

- [ ] **Step 8: Commit**

```bash
git add 'app/(crm)/simulacao/page.tsx' components/simulacao lib/mock/seed.ts
git commit -m "feat: add live customer WhatsApp simulator"
```

---

### Task 3: Entrada de apresentação e validação final

**Files:**
- Modify: `components/crm/navegacao.tsx`
- Modify: `components/crm/simulador.tsx`

**Interfaces:**
- Consumes: rota `/simulacao`.
- Produces: acesso “Simulação ao vivo” no menu e no botão superior.

- [ ] **Step 1: Add the navigation entry**

Adicionar antes de `Conversas`:

```ts
{ href: "/simulacao", rotulo: "Simulação ao vivo", icone: Radio }
```

- [ ] **Step 2: Point the presentation action to the live simulator**

Alterar `apresentar` para navegar a `/simulacao`. Atualizar a descrição para destacar que o apresentador poderá digitar como cliente.

- [ ] **Step 3: Validate the complete browser flow**

No navegador:

1. abrir `/simulacao`;
2. clicar `Iniciar simulação`;
3. enviar `Olá`;
4. confirmar saudação da Ana no celular e eventos no painel;
5. enviar a solicitação de aluguel vencido;
6. confirmar Administrativo, contexto e Zilda;
7. responder como Zilda;
8. confirmar a resposta no celular e estados de entrega/leitura;
9. reiniciar e confirmar que a simulação volta ao estado inicial.

- [ ] **Step 4: Run final verification**

Run:

```bash
/Users/jeremiasmatra/Library/pnpm/bin/pnpm test
/Users/jeremiasmatra/Library/pnpm/bin/pnpm lint
/Users/jeremiasmatra/Library/pnpm/bin/pnpm exec tsc --noEmit
/Users/jeremiasmatra/Library/pnpm/bin/pnpm build
git diff --check
```

Expected: todos encerram com código `0`.

- [ ] **Step 5: Commit**

```bash
git add components/crm/navegacao.tsx components/crm/simulador.tsx
git commit -m "feat: expose live simulator in presentation navigation"
```
