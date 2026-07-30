# Central Perez — Protótipo visual para apresentação

## Objetivo

Transformar o protótipo atual em uma demonstração visual convincente, executada em um MacBook durante 10 a 15 minutos para os donos da Imobiliária Perez. A apresentação deve materializar a proposta comercial: central de WhatsApp, triagem inteligente, distribuição, CRM conectado à carteira e visão gerencial.

## Direção visual aprovada

O produto seguirá a direção “WhatsApp primeiro”:

- navegação lateral compacta;
- lista priorizada de conversas;
- conversa como superfície principal;
- ficha do cliente e do CRM em painel lateral recolhível;
- identidade Perez em branco, grafite e carmim;
- layout otimizado para telas de MacBook e adaptável a larguras menores.

O painel lateral não ocupará largura permanente. Isso preserva a familiaridade da conversa e evita a quebra atual do inbox em telas estreitas.

## Jornada da demonstração

1. Um contato novo envia uma mensagem em texto livre sobre atraso no aluguel e solicitação de revisão da multa.
2. A Ana responde de forma curta, interpreta a intenção e preserva o texto original.
3. O sistema classifica a demanda como Financeiro, dentro do Administrativo.
4. A conversa entra na fila e é distribuída para Zilda Camilotti.
5. O atendente recebe um resumo da IA, responde ao cliente e abre a ficha contextual.
6. A ficha mostra cliente, contrato ou imóvel relacionado, responsável e próximo passo.
7. A apresentação termina no CRM e nos indicadores da direção.

## Fluxo da Ana

A saudação será curta e pedirá uma descrição em linguagem natural. Não haverá exigência de códigos numéricos.

Atalhos visuais opcionais:

- Comprar ou alugar;
- Financeiro e boletos;
- Manutenção e vistoria;
- Outros assuntos.

Texto livre continua sendo o caminho principal. Quando a confiança for baixa, a Ana faz uma única pergunta complementar. Persistindo a dúvida, encaminha para Recepção. Fora do expediente, informa o horário e registra a demanda. Sem atendente disponível, confirma a entrada na fila.

## Componentes

### Shell

Barra lateral compacta com Conversas, CRM, Carteira, Equipe e Indicadores. O cabeçalho mostra identidade Perez, estado da operação e controles da demonstração.

### Lista de conversas

Busca, filtros por situação e departamento, tempo de espera, prioridade, responsável, canal, não lidas e prévia da última mensagem. A ordenação prioriza demandas aguardando e SLAs próximos do limite.

### Thread

Cabeçalho do contato, estado do atendimento, mensagens, resumo da IA, ações rápidas e compositor. Mensagens da Ana serão compactas e visualmente distintas.

### Ficha contextual

Painel recolhível com contato, intenção, departamento, responsável, contrato ou imóvel vinculado, histórico e próximo passo. O painel deve abrir sem reduzir a conversa a uma largura inutilizável.

### Simulador

Ação de demonstração com cenário predefinido. O fluxo cria contato, mensagem, classificação, distribuição e contexto de CRM. Deve haver reinício confiável para repetir a apresentação.

### CRM, carteira e indicadores

As telas existentes serão polidas e seus dados alinhados à mesma jornada. Não haverá integração real nesta fase; carteira e indicadores serão dados simulados coerentes com a conversa demonstrada.

## Arquitetura

O protótipo permanece client-side com Next.js, React, Zustand e dados mockados. A UI continua acessando mutações por `lib/data`. Regras de classificação e distribuição permanecem isoladas e testáveis.

Mudanças de domínio serão mínimas e voltadas à demonstração: intenção, prioridade, etiquetas e próximo passo podem ser adicionados aos dados simulados quando necessários. Não haverá backend, API externa ou credenciais.

## Estados e falhas

- baixa confiança: uma pergunta complementar e fallback para Recepção;
- fora do expediente: mensagem com próxima abertura;
- equipe indisponível: conversa permanece na fila;
- envio vazio: ação bloqueada;
- cenário já executado: simulador não duplica dados sem reinício;
- painel estreito: ficha vira drawer ou é fechada;
- erro inesperado da demonstração: reinício restaura o seed original.

## Validação

- testes unitários do classificador e distribuição;
- teste do fluxo simulado de triagem;
- lint, testes e build;
- inspeção visual do inbox, CRM, equipe e indicadores;
- validação em dimensões comuns de MacBook;
- verificação do roteiro completo em 10 a 15 minutos.

## Fora do escopo

WhatsApp real, banco de dados, autenticação, integração real com carteira, LLM, migração de dados e deploy de produção.
