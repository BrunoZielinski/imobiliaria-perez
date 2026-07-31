# Dois formatos de triagem na área de Conversas

## Objetivo

Mostrar na área `Conversas` dois atendimentos completos e comparáveis:

- um atendimento classificado por texto livre com a Ana;
- um atendimento conduzido por botões e lista do fluxo Manual Meta.

Os exemplos devem parecer conversas reais da operação, permanecer fáceis de encontrar durante a apresentação e compartilhar a mesma distribuição e atendimento humano.

## Experiência de apresentação

A lista de conversas terá uma seção `Exemplos de triagem` fixada antes da fila operacional. Ela conterá:

1. `Marcos Oliveira` com o selo `Com Ana`.
2. `Renata Almeida` com o selo `Manual Meta`.

A seção operacional existente continuará abaixo, com o título `Prioridade de atendimento`.

Selecionar qualquer exemplo abre o histórico completo no painel principal. Não haverá um controle para converter uma conversa de um formato para o outro.

## Exemplo com Ana

O exemplo atual de Marcos Oliveira será preservado:

1. cliente envia uma saudação;
2. Ana solicita uma descrição em texto livre;
3. cliente explica o atraso e a multa;
4. Ana identifica Administrativo;
5. contexto é organizado pela Ana;
6. Zilda assume e responde.

O cabeçalho exibirá o selo `Com Ana` e o cartão de contexto usará o título `Contexto organizado pela Ana`.

## Exemplo Manual Meta

Uma nova conversa de Renata Almeida será adicionada:

1. cliente envia `Olá`;
2. sistema envia a mensagem interativa `Como podemos ajudar hoje?`;
3. cliente escolhe `Já sou cliente`;
4. sistema envia a lista `Escolha o assunto do seu atendimento`;
5. cliente escolhe `Financeiro/boletos`;
6. sistema solicita uma descrição breve;
7. cliente informa que deseja confirmar o vencimento;
8. sistema confirma o encaminhamento ao Administrativo;
9. Zilda responde.

O cabeçalho exibirá o selo `Manual Meta`. Mensagens automáticas serão identificadas como `Automação Meta`, sem referência à Ana. O cartão de contexto usará o título `Contexto informado pelo cliente`.

## Representação das interações

As mensagens terão metadados suficientes para o histórico diferenciar:

- texto comum;
- mensagem com botões;
- mensagem com lista;
- resposta a botão;
- resposta a item da lista.

Botões e listas serão apresentados como elementos visuais desabilitados no histórico, pois representam escolhas que já aconteceram. A seleção do cliente aparecerá em sua própria bolha.

## Modelo de dados

Cada conversa terá um campo explícito:

```ts
type ModoTriagem = "ana" | "manual" | "direto";
```

Cada mensagem poderá ter uma apresentação opcional:

```ts
type ApresentacaoMensagem =
  | { tipo: "botoes"; opcoes: string[] }
  | { tipo: "lista"; rotulo: string; opcoes: string[] }
  | { tipo: "button_reply" }
  | { tipo: "list_reply" };
```

O autor `sistema` será aceito para mensagens automáticas sem IA.

As conversas existentes que vieram de site, portal ou atendimento direto usarão `modoTriagem: "direto"`. Conversas de WhatsApp atualmente atendidas pela Ana usarão `modoTriagem: "ana"`.

## Componentes

- `lib/tipos.ts`: tipos de modo, autor e apresentação interativa.
- `lib/mock/seed.ts`: nova pessoa e conversa Manual Meta; metadados dos exemplos.
- `components/inbox/lista-conversas.tsx`: seção fixada e selos de formato.
- `components/inbox/thread.tsx`: selo no cabeçalho, contexto correto e mensagens interativas históricas.
- `components/inbox/ficha-lead.tsx`: rótulo de contexto coerente com o modo.
- `lib/data/index.ts`: novas conversas registram o modo correto ao serem criadas.

## Comportamento

- Os dois exemplos permanecem visíveis para o papel Administrador.
- O exemplo selecionado continua no topo da seção de exemplos, sem alterar a ordem da fila operacional.
- O selo de modo aparece somente em conversas de WhatsApp com triagem `ana` ou `manual`.
- Conversas diretas não recebem um selo desnecessário.
- Mensagens interativas históricas não são clicáveis.
- A resposta do atendente continua usando o campo atual e o mesmo store.

## Validação

- testes do modo atribuído a novas conversas;
- teste dos dois exemplos presentes no seed;
- teste de renderização dos selos e elementos históricos;
- verificação visual dos dois exemplos em `Conversas`;
- verificação de que a fila operacional continua visível;
- lint, TypeScript, testes completos e build.

## Fora de escopo

- trocar o formato durante um atendimento;
- configurar opções do fluxo pela interface;
- editar mensagens interativas no histórico;
- sincronizar o histórico com a Meta;
- armazenar payloads reais de webhook;
- alterar permissões ou regras de distribuição.
