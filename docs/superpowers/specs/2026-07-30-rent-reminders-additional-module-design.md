# Módulo adicional de lembretes de cobrança

## Objetivo

Criar uma aba visual para demonstrar a programação de lembretes enviados ao locatário antes do vencimento do aluguel.

A interface deve comunicar claramente que é um módulo adicional contratável e que não faz parte do núcleo da proposta de R$ 30 mil.

## Posicionamento comercial

A navegação terá uma nova entrada `Cobranças`. A página exibirá, no cabeçalho:

> Módulo adicional — não incluído no núcleo da proposta de R$ 30 mil.

O nome operacional da tela será `Lembretes de cobrança`, evitando prometer cobrança bancária, régua de inadimplência ou conciliação financeira.

## Experiência de apresentação

A página terá quatro áreas:

1. **Resumo:** lembretes programados, próximos sete dias, enviados no período e pausados.
2. **Agenda:** tabela com os próximos lembretes.
3. **Detalhe:** painel lateral ou cartão da programação selecionada.
4. **Programar lembrete:** diálogo visual para demonstrar a criação.

Todos os dados serão simulados e identificados como demonstração.

## Agenda

Cada linha mostrará:

- locatário;
- imóvel ou contrato;
- vencimento;
- antecedência, como `3 dias antes`;
- data e horário programados;
- template utilizado;
- status.

Status disponíveis:

- `Agendado`;
- `Enviado`;
- `Pausado`;
- `Cancelado`.

Não haverá status `Pago` porque confirmar pagamento exige uma fonte financeira externa que não faz parte deste protótipo.

## Programar lembrete

O diálogo terá:

- locatário;
- imóvel ou contrato;
- data de vencimento;
- antecedência de 1, 3, 5 ou 7 dias;
- horário;
- template aprovado;
- prévia da mensagem;
- botão `Programar lembrete`.

Ao confirmar, a programação será adicionada somente ao estado local da demonstração. Nenhuma mensagem será enviada.

## Template demonstrado

O protótipo utilizará uma mensagem de utilidade curta:

> Olá, {{nome}}. O aluguel do imóvel {{imovel}} vence em {{data}}. Caso já tenha realizado o pagamento, desconsidere esta mensagem.

A tela mostrará o selo `Template Meta aprovado — demonstração`, sem afirmar que existe uma aprovação real para a conta da Perez.

## Detalhe da programação

Ao selecionar uma linha, o painel exibirá:

- dados do locatário;
- vencimento e antecedência;
- conteúdo preenchido do template;
- linha do tempo visual com `Programado`, `Processado` e `Enviado`;
- ações `Pausar` e `Cancelar`.

A linha do tempo será visual e local. Ela não representará entrega real pela Meta.

## Arquitetura

- `app/(crm)/cobrancas/page.tsx`: coordenação da página e estado local.
- `components/cobrancas/resumo-cobrancas.tsx`: cartões de resumo.
- `components/cobrancas/agenda-lembretes.tsx`: tabela e seleção.
- `components/cobrancas/detalhe-lembrete.tsx`: prévia e linha do tempo.
- `components/cobrancas/programar-lembrete.tsx`: diálogo controlado.
- `lib/mock/cobrancas.ts`: dados e tipos do módulo demonstrativo.
- `components/crm/navegacao.tsx`: entrada `Cobranças` com identificação de módulo adicional.

O módulo não altera o store do CRM nem a distribuição de atendimentos.

## Comportamento

- a tela inicia com exemplos preenchidos;
- programar cria um item local com status `Agendado`;
- pausar altera o status para `Pausado`;
- cancelar exige confirmação visual e altera para `Cancelado`;
- itens enviados não podem ser pausados ou cancelados;
- recarregar a página restaura os dados de demonstração;
- nenhum botão executa uma ação externa.

## Escopo incluído

- nova aba navegável;
- agenda visual;
- exemplos simulados;
- prévia de template;
- criação, pausa e cancelamento locais;
- identificação explícita de módulo adicional;
- layout para apresentação em MacBook.

## Fora de escopo

- envio real pela WhatsApp Cloud API;
- criação ou aprovação de templates na Meta;
- geração ou segunda via de boleto;
- consulta a banco, ERP ou sistema de locação;
- confirmação automática de pagamento;
- cobrança após vencimento;
- cálculo de juros, multa ou acordo;
- negativação;
- importação de contratos;
- jobs, filas, banco de dados ou infraestrutura de produção;
- relatórios financeiros;
- consentimento, opt-out e regras jurídicas de uma operação real.

## Validação

- testes das transições locais de status;
- teste dos dados demonstrativos;
- teste de renderização da identificação `Módulo adicional`;
- validação visual da agenda e do diálogo em MacBook;
- confirmação de que nenhuma chamada externa é realizada;
- lint, TypeScript, testes completos e build.
