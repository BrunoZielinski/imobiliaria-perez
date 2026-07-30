# Central Perez Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar um protótipo visual “WhatsApp primeiro” que demonstre triagem pela Ana, distribuição, atendimento, CRM e visão gerencial em 10 a 15 minutos.

**Architecture:** O projeto permanece client-side no App Router. Regras de triagem continuam em funções puras, estado e demonstração permanecem no Zustand, e componentes interativos continuam atrás de limites `"use client"`. O inbox passa a ter duas colunas permanentes e uma ficha contextual em `Sheet`, eliminando a quebra atual em telas de MacBook.

**Tech Stack:** Next.js 16.2.12, React 19.2.4, TypeScript 5, Tailwind CSS 4, shadcn/ui, Zustand, Vitest.

## Global Constraints

- Usar apenas dados mockados; sem backend, API externa ou credenciais.
- Preservar `lib/data` como ponto de mutação da UI.
- Todo texto de interface em português brasileiro.
- Identidade visual Perez: carmim `#C81934`, grafite, branco e Montserrat.
- Texto livre é o caminho principal da Ana; não exigir códigos numéricos.
- Layout principal deve funcionar em larguras comuns de MacBook.
- Não adicionar dependências.
- Não alterar ou incluir no commit `pnpm-lock.yaml`, `pnpm-workspace.yaml` ou `.superpowers/`.

---

### Task 1: Atualizar a Ana e o cenário demonstrável

**Files:**
- Modify: `lib/ana/classificar.test.ts`
- Modify: `lib/ana/classificar.ts`
- Modify: `lib/ana/script.ts`
- Modify: `lib/mock/seed.ts`

**Interfaces:**
- Consumes: `classificar(texto: string): Classificacao`
- Produces: mensagens curtas da Ana e classificação determinística do cenário financeiro

- [ ] **Step 1: Escrever o teste que representa o print real**

Adicionar em `lib/ana/classificar.test.ts`:

```ts
it("classifica atraso de aluguel e multa como administrativo", () => {
  const resultado = classificar(
    "Não conseguimos pagar o aluguel no vencimento e gostaria de rever a multa"
  );

  expect(resultado.departamento).toBe("administrativo");
  expect(resultado.contexto).toContain("multa");
  expect(resultado.confianca).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Executar o teste e confirmar a falha inicial**

Run: `pnpm test -- lib/ana/classificar.test.ts`

Expected: FAIL porque “aluguel” também pontua Comercial e o cenário ainda não possui vocabulário financeiro suficiente.

- [ ] **Step 3: Ajustar o vocabulário e substituir o menu numérico**

Em `lib/ana/classificar.ts`, manter a compatibilidade com números, mas reforçar Administrativo:

```ts
administrativo: [
  "boleto", "segunda via", "pagamento", "pagar", "vencimento", "atraso",
  "multa", "financeiro", "repasse", "contrato", "vistoria", "manutenção",
],
```

Em `lib/ana/script.ts`, substituir a saudação por:

```ts
export const SAUDACAO_ANA = `Olá! Eu sou a Ana, assistente virtual da Imobiliária Perez.

Conte em uma frase como podemos ajudar. Vou entender sua solicitação e encaminhar para a pessoa certa.`;
```

Substituir o fallback por uma pergunta única com os quatro atalhos visuais escritos por extenso.

- [ ] **Step 4: Alinhar os dados da demonstração**

Em `lib/mock/seed.ts`:

- renomear o contato administrativo para `Marcos Oliveira`;
- renomear o atendente administrativo `at-5` para `Zilda Camilotti`;
- trocar as mensagens da conversa administrativa pelo caso de atraso, hospital e revisão da multa;
- manter `contextoAna` com a solicitação completa;
- preservar IDs existentes para não quebrar referências.

- [ ] **Step 5: Executar os testes**

Run: `pnpm test -- lib/ana/classificar.test.ts lib/distribuicao/roleta.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/ana/classificar.test.ts lib/ana/classificar.ts lib/ana/script.ts lib/mock/seed.ts
git commit -m "feat: modernize Ana triage flow"
```

---

### Task 2: Criar o shell compacto da Central Perez

**Files:**
- Modify: `app/(crm)/layout.tsx`
- Modify: `components/crm/navegacao.tsx`
- Modify: `components/crm/seletor-papel.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: rotas existentes `/inbox`, `/pipelines`, `/atendentes`, `/dashboard` e a rota `/carteira` criada na Task 4
- Produces: shell responsivo com navegação compacta e cabeçalho de demonstração

- [ ] **Step 1: Redesenhar a navegação**

Usar rótulos coerentes com a proposta:

```ts
const ITENS = [
  { href: "/inbox", rotulo: "Conversas", icone: MessagesSquare },
  { href: "/pipelines", rotulo: "CRM", icone: KanbanSquare },
  { href: "/carteira", rotulo: "Carteira", icone: Building2 },
  { href: "/atendentes", rotulo: "Equipe", icone: Users },
  { href: "/dashboard", rotulo: "Indicadores", icone: ChartNoAxesCombined },
];
```

A sidebar terá largura compacta no MacBook, rótulos legíveis e estado ativo carmim.

- [ ] **Step 2: Reorganizar o layout**

Em `app/(crm)/layout.tsx`:

- cabeçalho da marca dentro da sidebar;
- navegação abaixo;
- rodapé “Ambiente de demonstração”;
- topo do conteúdo com status “Operação online”, simulador e seletor de papel;
- alturas usando `h-dvh` e filhos com `min-w-0`.

- [ ] **Step 3: Tornar o seletor de papel compacto**

Reduzir larguras e exibir o papel como contexto de demonstração, mantendo todos os valores atuais do store.

- [ ] **Step 4: Ajustar tokens globais**

Em `app/globals.css`, preservar os tokens shadcn e adicionar somente ajustes globais:

```css
body {
  @apply bg-[#f5f5f6] text-foreground;
}

::selection {
  @apply bg-primary/20;
}
```

- [ ] **Step 5: Verificar lint da camada**

Run: `pnpm lint -- 'app/(crm)/layout.tsx' components/crm/navegacao.tsx components/crm/seletor-papel.tsx`

Expected: zero erros.

- [ ] **Step 6: Commit**

```bash
git add 'app/(crm)/layout.tsx' components/crm/navegacao.tsx components/crm/seletor-papel.tsx app/globals.css
git commit -m "feat: redesign Central Perez shell"
```

---

### Task 3: Reconstruir o inbox no layout B

**Files:**
- Modify: `app/(crm)/inbox/page.tsx`
- Modify: `components/inbox/lista-conversas.tsx`
- Modify: `components/inbox/thread.tsx`
- Modify: `components/inbox/ficha-lead.tsx`

**Interfaces:**
- Consumes: `conversasVisiveis`, `marcarComoLida`, `enviarMensagem`, `assumirConversa`
- Produces: inbox em duas colunas e ficha contextual em drawer

- [ ] **Step 1: Simplificar a página do inbox**

`InboxPage` renderiza somente lista e thread:

```tsx
<div className="flex h-full min-w-0 overflow-hidden">
  <ListaConversas
    selecionada={selecionada}
    aoSelecionar={setSelecionada}
    filtro={filtro}
    aoFiltrar={setFiltro}
  />
  <Thread conversaId={aindaVisivel ? selecionada : null} />
</div>
```

- [ ] **Step 2: Redesenhar a lista de conversas**

Adicionar:

- título “Conversas” e total aguardando;
- campo de busca local por nome e texto;
- filtros compactos por departamento;
- ordenação por não lidas, fila e data;
- avatar com iniciais;
- badges de canal, setor e estado;
- tempo com destaque quando aguardando;
- largura `w-[21rem]`, reduzida para `w-72` abaixo de 1200px.

- [ ] **Step 3: Redesenhar o cabeçalho e a timeline**

Em `Thread`:

- contato, telefone, canal, setor e responsável no cabeçalho;
- botão “Ver cliente”;
- resumo compacto da Ana acima das mensagens;
- mensagens do contato neutras, Ana em superfície carmim suave e atendente em carmim sólido;
- fundo suave na timeline;
- compositor com ação de envio legível.

- [ ] **Step 4: Mover a ficha para um Sheet**

Usar `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle` e `SheetDescription`.

`FichaLead` deixa de renderizar `<aside>` fixo e passa a renderizar conteúdo de ficha:

```tsx
<div className="flex flex-col gap-5">
  <section>{/* contexto e responsável */}</section>
  <section>{/* CRM e etapa */}</section>
  <section>{/* imóvel ou contrato relacionado */}</section>
</div>
```

O `SheetContent` terá largura apropriada e não alterará a largura da conversa.

- [ ] **Step 5: Validar interação no navegador**

Verificar:

1. selecionar conversa;
2. pesquisar “Marcos”;
3. abrir “Ver cliente”;
4. fechar o drawer;
5. enviar uma resposta;
6. confirmar que a timeline e a lista atualizam.

- [ ] **Step 6: Verificar lint**

Run: `pnpm lint -- 'app/(crm)/inbox/page.tsx' components/inbox/lista-conversas.tsx components/inbox/thread.tsx components/inbox/ficha-lead.tsx`

Expected: zero erros.

- [ ] **Step 7: Commit**

```bash
git add 'app/(crm)/inbox/page.tsx' components/inbox/lista-conversas.tsx components/inbox/thread.tsx components/inbox/ficha-lead.tsx
git commit -m "feat: rebuild WhatsApp-first inbox"
```

---

### Task 4: Preparar o roteiro visual de apresentação

**Files:**
- Modify: `components/crm/simulador.tsx`
- Create: `app/(crm)/carteira/page.tsx`
- Modify: `app/(crm)/dashboard/page.tsx`
- Modify: `app/(crm)/atendentes/page.tsx`
- Modify: `app/(crm)/pipelines/page.tsx`
- Modify: `components/pipeline/coluna.tsx`
- Modify: `components/pipeline/card-lead.tsx`

**Interfaces:**
- Consumes: store existente, `receberMensagem`, `drenarFila`, `reiniciar`
- Produces: cenário repetível e telas secundárias coerentes com a proposta

- [ ] **Step 1: Transformar o simulador em “Apresentar cenário”**

O estado inicial será:

```ts
const [contatoId, setContatoId] = useState("ct-4");
const [canal, setCanal] = useState<Canal>("whatsapp");
const [texto, setTexto] = useState(
  "Tivemos um imprevisto de saúde e não conseguimos pagar o aluguel no vencimento. Gostaria de rever a multa."
);
```

O popover explica em três passos o que acontecerá e mantém as ações “Iniciar cenário” e “Reiniciar demonstração”.

- [ ] **Step 2: Criar a visão da carteira**

Criar `app/(crm)/carteira/page.tsx` como Client Component que lê `dados.imoveis` e `dados.leads`. A tela terá:

- título “Carteira de imóveis”;
- busca por código, tipo ou bairro;
- cards de quantidade para venda, locação e imóveis ligados a oportunidades;
- tabela com código, tipo, bairro, finalidade, valor e número de leads relacionados.

O vínculo é calculado sem novo estado:

```ts
const oportunidadesDoImovel = (imovelId: string) =>
  dados.leads.filter((lead) => lead.imovelId === imovelId).length;
```

- [ ] **Step 3: Polir os indicadores**

Adicionar título, período “Hoje”, subtítulos executivos e uma seção de operação:

- novos contatos;
- aguardando;
- tempo médio de resposta;
- valor em negociação;
- distribuição por departamento e canal.

Usar o grid atual, mas com responsividade `grid-cols-1 md:grid-cols-2 xl:grid-cols-4`.

- [ ] **Step 4: Polir equipe e CRM**

Em Equipe:

- título e resumo das filas;
- avatar, papel, carga e disponibilidade;
- cards responsivos antes da tabela.

Em CRM:

- título e resumo do pipeline selecionado;
- tabs compactas;
- colunas com superfície e contadores mais claros;
- cards com contato, imóvel, valor, responsável e tempo.

- [ ] **Step 5: Verificar o roteiro completo**

Executar no navegador:

1. reiniciar demonstração;
2. iniciar cenário;
3. abrir Conversas;
4. mostrar resumo da Ana e ficha;
5. abrir CRM;
6. abrir Carteira;
7. abrir Equipe;
8. terminar em Indicadores.

- [ ] **Step 6: Commit**

```bash
git add components/crm/simulador.tsx 'app/(crm)/carteira/page.tsx' 'app/(crm)/dashboard/page.tsx' 'app/(crm)/atendentes/page.tsx' 'app/(crm)/pipelines/page.tsx' components/pipeline/coluna.tsx components/pipeline/card-lead.tsx
git commit -m "feat: prepare Perez presentation journey"
```

---

### Task 5: Verificação final

**Files:**
- Verify only

**Interfaces:**
- Consumes: aplicação completa
- Produces: evidência de qualidade para a apresentação

- [ ] **Step 1: Executar testes**

Run: `pnpm test`

Expected: todos os testes passam.

- [ ] **Step 2: Executar lint**

Run: `pnpm lint`

Expected: zero erros.

- [ ] **Step 3: Executar build**

Run: `pnpm build`

Expected: build de produção concluído com sucesso.

- [ ] **Step 4: Verificar visualmente em MacBook**

Validar inbox, CRM, Carteira, Equipe e Indicadores em:

- `1440 × 900`;
- `1280 × 800`;
- largura próxima de `1024px`.

Confirmar ausência de sobreposição, texto cortado, scroll horizontal global e painéis inutilizáveis.

- [ ] **Step 5: Inspecionar estado do Git**

Run: `git status --short`

Expected: somente arquivos preexistentes não relacionados permanecem fora dos commits.
