# Fluxo manual oficial da Meta no simulador

## Objetivo

Adicionar ao simulador uma alternativa sem inteligência artificial que entregue a mesma jornada operacional essencial: receber o cliente, identificar o assunto, registrar contexto, encaminhar ao departamento correto e permitir a resposta humana.

O fluxo deve ser demonstrável como implementação viável pela WhatsApp Cloud API e permanecer compatível com o escopo comercial de uma solução de até R$ 30 mil.

## Decisão de produto

A tela `Simulação ao vivo` terá dois modos mutuamente exclusivos:

- **Com Ana (IA):** mantém a classificação por texto livre já existente.
- **Manual Meta:** usa somente botões de resposta, mensagem de lista, texto livre e webhooks simulados.

O modo manual não tenta interpretar texto nem atribuir probabilidades. Cada opção possui um identificador estável que é associado diretamente a um dos três departamentos existentes.

## Jornada manual

1. O apresentador inicia a simulação no modo `Manual Meta`.
2. O cliente envia `Olá`.
3. A empresa responde com uma mensagem interativa de três botões:
   - `Comprar/alugar`
   - `Já sou cliente`
   - `Outros assuntos`
4. `Comprar/alugar` segue diretamente para Comercial.
5. `Outros assuntos` segue diretamente para Recepção.
6. `Já sou cliente` abre uma mensagem de lista com:
   - `Financeiro/boletos`
   - `Manutenção`
   - `Vistoria/saída`
   - `Repasse proprietário`
   - `Recepção/geral`
7. Após a escolha, o sistema solicita uma descrição breve.
8. O cliente digita o contexto.
9. A conversa é criada na Central Perez já vinculada ao departamento escolhido e passa pela distribuição existente.
10. A confirmação informa o departamento e o atendente pode responder pelo painel.

Nenhum código numérico é solicitado ao cliente.

## Representação da Cloud API

O protótipo continua sem chamadas externas, mas representa os contratos relevantes:

- envio de mensagem `type: "interactive"` com `interactive.type: "button"`;
- resposta recebida como `interactive.button_reply`;
- envio de mensagem `type: "interactive"` com `interactive.type: "list"`;
- resposta recebida como `interactive.list_reply`;
- identificadores de opção usados pelo backend para roteamento;
- aceite, envio, entrega e leitura identificados pelo mesmo `wamid`;
- janela iniciada pelo cliente identificada como aberta por 24 horas.

As mensagens técnicas permanecem claramente marcadas como simulação.

## Experiência visual

O seletor de modo ficará no cabeçalho da página, antes do botão de iniciar. A descrição da demonstração mudará conforme o modo.

No celular:

- os botões aparecem dentro da mensagem comercial;
- a lista é aberta por um botão `Escolher assunto`;
- a seleção aparece como uma nova bolha do cliente;
- após a seleção, o campo de texto é liberado para a descrição;
- o restante da conversa mantém o estilo visual inspirado no WhatsApp.

Na trilha técnica:

- o clique em botão aparece como `interactive.button_reply`;
- o clique em item da lista aparece como `interactive.list_reply`;
- os envios dos menus aparecem como `interactive.type=button` e `interactive.type=list`.

Na Central Perez:

- durante a navegação, o estado informa que a triagem manual está em andamento;
- após a descrição, mostra departamento, responsável e histórico;
- o contexto é identificado como `Contexto informado pelo cliente`, sem atribuição à Ana.

## Escopo compatível com a proposta

### Incluído na demonstração

- dois caminhos de triagem, IA e manual;
- três departamentos;
- opções configuradas no código do protótipo;
- distribuição para atendente disponível;
- fila, responsável, histórico e resposta humana;
- eventos equivalentes à integração oficial;
- experiência visual para apresentação em MacBook.

### Não incluído e não prometido

- conexão com número real ou conta Meta;
- custos e aprovação da Meta;
- construtor administrativo de fluxos;
- integrações com ERP, sistema financeiro, portais ou bancos;
- banco de dados, autenticação, permissões avançadas ou infraestrutura de produção;
- envio de áudio, documentos, mídia ou templates reais;
- automações de cobrança, geração de boleto ou execução de manutenção;
- relatórios customizados, aplicativo móvel ou omnichannel;
- implantação, homologação ou suporte contínuo.

## Arquitetura

- `lib/simulador/fluxo-manual.ts` concentra opções, rótulos e roteamento determinístico.
- `lib/simulador/cloud-api.ts` passa a representar mensagens interativas e suas respostas.
- `app/(crm)/simulacao/page.tsx` coordena o modo escolhido e mantém o estado transitório da triagem manual.
- `components/simulacao/celular-cliente.tsx` renderiza os controles interativos oficiais simulados.
- `components/simulacao/central-ao-vivo.tsx` diferencia contexto manual de contexto organizado pela Ana.
- O store existente só recebe a conversa quando o cliente conclui a escolha e informa o contexto, evitando representar a automação manual como IA.

## Validação

- testes unitários do roteamento manual e dos eventos interativos;
- todos os testes existentes preservados;
- validação visual dos dois modos no navegador;
- verificação do caminho `Já sou cliente → Financeiro/boletos → descrição → Zilda`;
- verificação dos caminhos diretos para Comercial e Recepção;
- lint, TypeScript e build de produção.
