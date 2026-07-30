# CRM Omnichannel — Imobiliária Perez

Documento de design. Define o lugar, a empresa, o produto pretendido e o escopo do protótipo.

---

## 1. O lugar — Londrina, Paraná

A operação é **exclusivamente londrinense**. Isso não é um detalhe de endereço: elimina toda a camada de roteamento geográfico do produto. Não há unidade por estado, não há distribuição por DDD, não há supervisor regional. Um único pool de atendentes cobre a cidade inteira.

O que sobra do lugar, e que efetivamente molda o sistema, é o **horário comercial**:

| Dia | Expediente |
|---|---|
| Segunda a sexta | 8h–12h e 14h–18h |
| Sábado | 8h–12h |
| Domingo | fechado |

O intervalo de almoço (12h–14h) é uma janela real de quatro horas semanais × 5 em que ninguém atende, e o WhatsApp não para de receber mensagem nesse período. Fila de espera, mensagens automáticas e cálculo de SLA precisam conhecer esse calendário — é a única razão pela qual existe um módulo de expediente no sistema.

Regiões citadas publicamente pela empresa: **Centro** e **Gleba Palhano**. Servem como valores de exemplo nos dados do protótipo, não como regra de negócio.

---

## 2. A empresa — Imobiliária Perez

Fatos extraídos de [imobiliariaperez.com.br](https://www.imobiliariaperez.com.br/):

| Campo | Valor |
|---|---|
| Razão de mercado | Imobiliária Perez |
| CRECI | J-2.696 |
| Tempo de atuação | mais de 35 anos |
| Endereço | Av. Juscelino Kubitschek, 3600 — esquina com Rua Brasil — CEP 86010-540, Londrina/PR |
| Telefone | (43) 3376-7500 |
| WhatsApp | (43) 99156-7500 |
| E-mail | falecom@imobiliariaperez.com.br |
| Serviços | venda, locação, permutas, lançamentos |
| Tipos de imóvel | casas, apartamentos |
| Presença digital | site, [Instagram](https://www.instagram.com/imobiliariaperez/), Facebook, YouTube, LinkedIn |

Não informados publicamente e **não estimados neste documento**: número de corretores, volume de imóveis na carteira, volume mensal de leads.

### Identidade visual

Extraída das custom properties do CSS do site em produção:

```
--ks-primary:   #C81934   /* vermelho carmim — cor da marca */
--ks-secondary: #333333
--ks-accent:    #434343
--whatsapp:     #098a10   /* verde usado nas ações de WhatsApp */
```

Tipografia: **Montserrat**.

O CRM herda essa paleta. Como é ferramenta de uso diário e não vitrine, o carmim fica reservado para ação primária, estado ativo e alerta de SLA estourado — não para grandes áreas de fundo. O verde `#098a10` marca exclusivamente o canal WhatsApp, mantendo a associação que o cliente já tem do site.

---

## 3. O problema

Os canais de venda da Perez hoje são independentes entre si. WhatsApp, formulário do site e portais imobiliários chegam por caminhos separados, cada um com sua própria caixa de entrada, e ninguém tem uma visão única de quantos leads entraram, quem atendeu, quanto tempo demorou e onde cada negociação parou.

Três consequências:

1. **Lead sem dono.** Sem atribuição explícita, um lead ou é atendido por todos ou por ninguém.
2. **Tempo de primeira resposta invisível.** Não existe medição, logo não existe cobrança.
3. **Funil não existe fora da cabeça do corretor.** Não há como saber quantas propostas estão abertas nem por que um negócio esfriou.

---

## 4. O produto

Um CRM que centraliza os canais de venda da Perez em uma caixa de entrada única, faz **pré-atendimento automatizado**, **distribui os atendimentos automaticamente** entre os atendentes disponíveis e acompanha cada negociação em **funis por tipo de negócio**.

Quatro capacidades:

1. **Inbox unificado** — WhatsApp, site e portais numa timeline só, por contato.
2. **Ana** — assistente virtual que recebe, dá boas-vindas, identifica o assunto e encaminha ao departamento certo.
3. **Fila com distribuição automática** — cada departamento tem sua fila, drenada em rodízio entre quem está disponível.
4. **Pipelines** — funis de Venda, Locação, Lançamentos e Captação, com histórico e métricas.

---

## 5. Escopo desta entrega

**Protótipo navegável com dados mockados.** Sem backend, sem banco, sem número de WhatsApp conectado.

O objetivo é validar fluxo, telas e regras de negócio com a Perez antes de investir em infraestrutura. Deve funcionar bem o suficiente para ser apresentado como demonstração ao vivo — arrastar card, responder mensagem, ver a distribuição acontecer.

### Dentro do escopo

- Todas as telas navegáveis, com dados realistas
- Estado mutável e persistente (arrastar card, responder, assumir atendimento)
- Fila e distribuição funcionando de verdade sobre os dados mockados
- Ana simulada, com o script real de atendimento
- Canais: WhatsApp, formulário do site, portais (ZAP/VivaReal/OLX)

### Fora do escopo, registrado para depois

| Item | Motivo |
|---|---|
| Conexão real com a WhatsApp Cloud API | Exige Meta Business verificado, número dedicado e HTTPS público |
| LLM real no pré-atendimento | Sem backend não há onde guardar credencial nem chamar modelo |
| Banco de dados e autenticação | Protótipo não persiste fora do navegador |
| Instagram Direct | Canal existe (@imobiliariaperez), mas não entra nesta fase |
| Multi-unidade por estado + central administrativa | Descartado nesta fase — operação é só Londrina |

---

## 6. Arquitetura

Next.js 16 + React 19 + Tailwind 4 + shadcn/ui, tudo client-side.

A decisão estrutural é uma só: **toda leitura e escrita de dados passa por `lib/data/`**, um módulo de funções assíncronas (`listarConversas`, `enviarMensagem`, `assumirAtendimento`, `moverLead`) que hoje operam sobre o store local e amanhã viram chamadas HTTP. Nenhum componente acessa o store diretamente.

Isso significa que a migração para backend real toca **um diretório**, não o app inteiro. As funções já são assíncronas hoje justamente para que a UI já lide com estados de carregamento — trocar a implementação não muda a forma de nenhum componente.

```
app/
  (crm)/
    inbox/          conversas + chat + ficha do lead
    pipelines/      kanban dos 4 funis
    atendentes/     disponibilidade, rodízio, carga
    dashboard/      métricas consolidadas
components/
  inbox/  pipeline/  lead/  ui/
lib/
  data/           ÚNICO ponto de acesso a dados
  store/          estado + persistência em localStorage
  ana/            motor de pré-atendimento
  distribuicao/   fila e rodízio (funções puras)
  expediente/     calendário comercial da Perez
  mock/           seed de dados
```

`lib/distribuicao/` e `lib/expediente/` são **funções puras**, sem dependência de React ou de store. São as regras que mais importam e as únicas testáveis isoladamente — e sobrevivem intactas à migração para o backend, porque é exatamente lá que vão rodar depois.

### Estado

Seed em JSON → store React com mutações reais → persistido em `localStorage`. A demonstração sobrevive a um refresh, o que importa quando se está apresentando para o cliente.

---

## 7. Modelo de dados

```
Contato          identidade da pessoa: nome, telefone, e-mail, origem
Conversa         thread de um contato num canal; tem departamento, status e atendente
Mensagem         unidade da conversa: direção, autor (contato|ana|atendente), conteúdo, horário
Atendente        pessoa da equipe: departamentos, papel, disponibilidade, posição no rodízio
Departamento     Comercial | Administrativo | Recepção
ItemFila         conversa aguardando: departamento, entrada, posição, prioridade
Lead             negociação: contato, pipeline, etapa, imóvel, valor, responsável
Pipeline         funil com suas etapas ordenadas
Imovel           código, tipo, bairro, valor, finalidade — dado de apoio
EventoAtribuicao log de cada distribuição: conversa, atendente, motivo, horário
```

Duas escolhas que merecem justificativa:

**`Contato` e `Lead` são entidades separadas.** A mesma pessoa pode ligar para o Administrativo sobre um boleto de aluguel e, seis meses depois, virar lead de compra. Amarrar os dois numa entidade só perde o histórico ou duplica a pessoa.

**`EventoAtribuicao` existe desde o protótipo.** Distribuição automática gera desconfiança na equipe — "por que ele recebeu e eu não?". O log responde isso com dado, e é barato de manter desde o começo. Também é o que permite auditar a fila quando algo dá errado.

---

## 8. A Ana — pré-atendimento

### Comportamento

Primeira mensagem de um contato novo no WhatsApp dispara o script oficial:

```
Eu sou a 🙋🏻‍♀️ *Ana*, assistente virtual da Imobiliária Perez.

Por favor, encaminhar suas mensagens por texto.

Já estou lhe encaminhando para um de nossos atendentes.

Para agilizar seu atendimento por favor, digite sua dúvida.

Seja bem vindo a Imobiliária Perez.

Para iniciar seu atendimento me informe sobre qual assunto deseja
falar com a gente hoje?

🔹 1 - Comercial
🔹 2 - Administrativo
🔹 3 - Recepção e Assuntos Gerais
```

A resposta segue dois caminhos:

- **Número (1, 2 ou 3)** → roteamento direto, determinístico.
- **Texto livre** → a Ana interpreta a intenção, escolhe o departamento e **preserva o texto original como contexto**, que aparece na ficha do lead. O atendente já abre a conversa sabendo do que se trata.

Quando não consegue classificar com confiança, a Ana repete o menu uma vez. Persistindo a dúvida, encaminha para **Recepção e Assuntos Gerais** — que é exatamente o departamento existente para o que não se encaixa nos outros dois.

### Implementação no protótipo × em produção

| | Protótipo | Produção |
|---|---|---|
| Menu numérico | idêntico ao final | idêntico |
| Texto livre | correspondência por palavra-chave sobre um dicionário por departamento | LLM classificando intenção e extraindo qualificação |
| Interface | `classificar(texto) → { departamento, confianca, contexto }` | **a mesma** |

O contrato da função é o mesmo nos dois casos. Substituir o classificador simulado pelo real é trocar a implementação de uma função — nada mais no sistema depende de qual dos dois está rodando.

### Leads que não passam pela Ana

Formulário do site e portais chegam **já estruturados** — nome, telefone e imóvel de interesse vêm preenchidos. Não há conversa a interpretar, então entram direto na fila do **Comercial**, com a origem marcada e o imóvel já vinculado. A Ana só existe onde há mensagem a interpretar.

---

## 9. Departamentos e filas

Três departamentos, cada um com sua fila independente:

| Departamento | Atende | Funil |
|---|---|---|
| **Comercial** | compra, venda, locação, lançamentos, captação | sim — os 4 pipelines |
| **Administrativo** | contratos, boletos, repasses, vistorias | não |
| **Recepção e Assuntos Gerais** | triagem, dúvidas gerais, o que não se encaixa | não |

**Decisão:** apenas o Comercial tem funil. Administrativo e Recepção resolvem demandas pontuais que começam e terminam na conversa — não são negociações com etapas. Forçar um funil sobre eles criaria burocracia sem informação. Eles têm fila, SLA e histórico; não têm kanban.

### Como a fila funciona

Uma fila por departamento, ordenada por chegada. Distribuição e fila **não são dois mecanismos** — são o mesmo:

1. Conversa classificada entra na fila do departamento.
2. O sistema tenta atribuir imediatamente ao próximo atendente disponível daquele departamento, em **rodízio circular** — o ponteiro avança a cada atribuição, garantindo divisão equilibrada. Atendente indisponível ou fora do expediente é pulado, sem perder a vez.
3. Se ninguém está disponível, a conversa **permanece na fila** com sua posição.
4. Quando um atendente finaliza um atendimento, puxa o topo da fila.

Ou seja: rodízio é a **ordem de drenagem** da fila, não um distribuidor separado. Há um único caminho pelo qual uma conversa chega a um atendente, e ele é registrado em `EventoAtribuicao`.

Enquanto o contato espera, a Ana informa a posição na fila e continua coletando informação útil — tipo de imóvel, região, faixa de valor. A espera vira qualificação em vez de silêncio.

---

## 10. Pipelines

Quatro funis, todos do Comercial. Etapas conforme prática de mercado, **a validar com a Perez** e editáveis depois:

| Pipeline | Etapas |
|---|---|
| **Venda** | Novo → Contato feito → Visita agendada → Visita realizada → Proposta → Fechado / Perdido |
| **Locação** | Novo → Contato feito → Visita → Documentação → Análise cadastral → Contrato assinado / Perdido |
| **Lançamentos** | Novo → Interesse → Apresentação → Reserva → Contrato / Perdido |
| **Captação** | Proprietário contatado → Avaliação → Proposta de exclusividade → Imóvel na carteira / Não captado |

Captação é um funil invertido — a Perez é quem vende, o proprietário é quem decide. Merece funil próprio justamente por ter uma dinâmica oposta à dos outros três.

Card mostra: contato, canal de origem, imóvel de interesse, valor, responsável, dias na etapa. Movimentação é por arrastar, com registro de quem moveu e quando.

---

## 11. Papéis

| Papel | Vê |
|---|---|
| **Atendente / corretor** | a própria fila e os próprios atendimentos, no seu departamento |
| **Supervisor de departamento** | fila inteira do departamento, redistribuição manual, SLA da equipe |
| **Administrador** | tudo — os 3 departamentos, os 4 funis, métricas gerais, configuração da Ana e do rodízio |

No protótipo, um seletor de papel no cabeçalho troca a visão sem autenticação real. Isso permite demonstrar as três perspectivas na mesma sessão de apresentação.

---

## 12. Telas

**Inbox** (home) — três colunas: lista de conversas com filtro por canal, departamento e status; thread no centro, com as mensagens da Ana visualmente distintas das humanas; ficha do lead à direita, com pipeline, etapa, imóvel e ação de mover.

**Pipelines** — kanban com abas por funil, colunas por etapa, drag entre etapas, contador e soma de valor por coluna.

**Atendentes** — quem está disponível, posição no rodízio, atendimentos abertos por pessoa, tamanho de cada fila.

**Dashboard** — leads por canal, conversão por etapa, tempo médio de primeira resposta, volume por departamento, ranking de atendentes.

**Simulador** — botão que injeta um lead novo (canal e assunto configuráveis) para demonstrar Ana, fila e distribuição funcionando ao vivo. Existe só no protótipo; é o que transforma a demonstração em algo convincente.

---

## 13. Premissas a confirmar com a Perez

Pontos não definidos. O protótipo adota o padrão indicado; nenhum deles é fato conhecido sobre a operação atual.

| Ponto | Padrão adotado | A confirmar |
|---|---|---|
| SLA de primeira resposta | 15 min no expediente | qual o tempo aceitável |
| Lead sem resposta dentro do SLA | volta ao topo da fila e vai ao próximo do rodízio | se deve redistribuir ou só alertar o supervisor |
| Lead parado no funil | alerta ao supervisor após 7 dias na mesma etapa | prazo por etapa |
| Fora do expediente | Ana avisa o horário de funcionamento e enfileira para o próximo dia útil | se deve enfileirar ou pedir retorno |
| Intervalo 12h–14h | tratado como fora do expediente | se há plantão no almoço |
| Teto de atendimentos simultâneos | 5 por atendente | qual o número real |
| Etapas dos funis | prática de mercado (seção 10) | funil real usado hoje |

---

## 14. Caminho para produção

O protótipo é desenhado para que a evolução seja substituição, não reescrita:

1. **Backend + banco** — `lib/data/` passa a chamar API; o resto do app não muda.
2. **WhatsApp Cloud API** — número oficial, webhook de entrada, envio de mensagem. A camada de canal já existe abstraída.
3. **Ana com LLM** — troca do classificador simulado pelo real, mesmo contrato de função.
4. **Autenticação e papéis reais** — o seletor de papel vira sessão.
5. **Instagram Direct** — mais um canal na mesma abstração.

---

> Criado em 2026-07-30 14:14 (-03) · Última modificação: 2026-07-30 14:14 (-03)
