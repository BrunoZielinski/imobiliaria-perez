# Simulador ao vivo da WhatsApp Cloud API

## Objetivo

Permitir que, durante a apresentação, uma pessoa assuma o papel do cliente e converse em tempo real com a Central Perez. A experiência deve demonstrar simultaneamente:

- o WhatsApp visto pelo cliente;
- a recepção e classificação automática pela Ana;
- a distribuição para o departamento e atendente corretos;
- os eventos que uma integração pela WhatsApp Cloud API produziria.

O protótipo não envia mensagens reais e deve identificar claramente os eventos como simulados.

## Experiência de apresentação

Uma nova área `Simulação ao vivo` será acessível pela navegação e pelo botão de apresentação. A tela terá três regiões:

1. **WhatsApp do cliente:** celular virtual no qual o apresentador digita e envia mensagens.
2. **Eventos da Cloud API:** trilha compacta com webhook recebido, resposta `200 OK`, chamada de envio, `wamid` e estados `sent`, `delivered` e `read`.
3. **Central Perez:** resumo da conversa, contexto entendido pela Ana, departamento, fila e atendente responsável.

Os painéis serão atualizados a partir do mesmo estado para que cada envio feito no celular apareça imediatamente na central.

## Fluxo demonstrável

1. O apresentador inicia ou reinicia a simulação.
2. O celular envia `Olá`.
3. O simulador registra o webhook de entrada e a Ana envia uma saudação curta.
4. O apresentador descreve livremente a situação do aluguel, sem escolher um menu numérico.
5. A Ana classifica o assunto como Administrativo/Financeiro e organiza o contexto.
6. A central distribui o atendimento para um atendente disponível.
7. A resposta humana aparece no celular.
8. Os estados de envio, entrega e leitura avançam na trilha da API.

O relógio da demonstração será controlado para manter o atendimento dentro da janela operacional e tornar o resultado repetível.

## Comportamento

- `Iniciar simulação` prepara um contato exclusivo e sem conversa ativa.
- `Reiniciar` restaura o cenário inicial sem alterar os demais dados da apresentação.
- O envio pelo celular aceita texto livre e utiliza o classificador real da Ana.
- A primeira mensagem abre a conversa e recebe a saudação.
- As mensagens seguintes atualizam a conversa existente.
- A interface diferencia claramente cliente, Ana e atendente.
- A janela de atendimento mostra estado aberto, simulando a sessão iniciada pelo usuário.
- Erros ou textos sem intenção reconhecida geram uma pergunta curta de esclarecimento.

## Arquitetura

- Um módulo puro produzirá a sequência de eventos equivalentes à Cloud API para cada mensagem.
- O simulador reutilizará `receberMensagem`, o classificador e o store existentes.
- Um contato exclusivo de demonstração será adicionado ao seed sem conversa vinculada.
- A página será um componente cliente e observará o store para refletir atualizações ao vivo.
- Nenhum token, número real, webhook externo ou chamada à Meta será usado.

## Validação

- Teste unitário da sequência de eventos simulados, escrito antes da implementação.
- Testes existentes do classificador e da distribuição continuarão passando.
- Validação manual do fluxo completo no navegador:
  - iniciar;
  - enviar saudação;
  - receber resposta da Ana;
  - enviar solicitação financeira;
  - confirmar classificação e atribuição;
  - responder como atendente;
  - observar entrega e leitura.
- Executar lint, TypeScript e build de produção.

## Fora de escopo

- Conexão com conta Meta ou número real.
- Armazenamento em banco de dados.
- Validação criptográfica de webhooks.
- Envio de templates reais ou cobrança de mensagens.
- Áudio, imagem, documento e chamadas.
