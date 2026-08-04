# Perez 360 — Especificação da apresentação visual

**Data:** 4 de agosto de 2026  
**Status:** aprovado para planejamento  
**Natureza da entrega:** protótipo navegável somente front-end

## 1. Objetivo

Transformar a demonstração atual da Central Perez em uma apresentação visual completa da futura plataforma digital da Imobiliária Perez. A experiência deve permitir que os proprietários da empresa naveguem desde o novo site institucional e catálogo de imóveis até os módulos internos de atendimento, CRM, locação, portais, financeiro e gestão.

A apresentação deve comunicar amplitude, organização e modernização operacional. Ela não representa um sistema de produção e não deve sugerir que integrações, automações ou operações financeiras reais já estejam implementadas.

## 2. Decisões aprovadas

- Formato da apresentação: **tour por módulos**.
- Direção visual do site: **Busca Direta**, priorizando imóveis e conversão desde o primeiro contato.
- Escopo: experiência completa **somente no front-end**.
- Conteúdo: imóveis, pessoas, indicadores, conversas e documentos fictícios, porém plausíveis para Londrina.
- Portais: incluir experiências demonstrativas para proprietário e locatário.
- Financeiro: incluir apenas visões e interações simuladas.
- CRM existente: preservar e evoluir as telas já criadas, conectando-as ao restante da apresentação.

## 3. Princípios da experiência

1. **Imóvel primeiro:** o site público deve levar o usuário rapidamente da intenção à lista de imóveis.
2. **Uma única Perez:** site, atendimento e operação interna devem compartilhar linguagem visual e dados demonstrativos.
3. **Clareza executiva:** cada módulo deve mostrar seu propósito em poucos segundos.
4. **Profundidade controlada:** as ações importantes devem responder visualmente, mas sem simular infraestrutura desnecessária.
5. **Demonstração honesta:** as áreas internas devem exibir o rótulo “Ambiente de demonstração”.
6. **Responsividade real:** as jornadas principais devem funcionar em notebook e celular.

## 4. Arquitetura da apresentação

A aplicação será organizada em três experiências visuais conectadas:

### 4.1 Site público

Usará cabeçalho e rodapé próprios, navegação aberta e estética editorial. O foco é apresentar a marca, buscar imóveis e gerar contato.

### 4.2 Plataforma interna

Usará o layout lateral da Central Perez, expandido para reunir atendimento, CRM, carteira, locação, financeiro e gestão. O menu deve agrupar módulos para não parecer uma sequência desconexa de páginas.

### 4.3 Portais

Usará uma interface mais simples e acolhedora para proprietário e locatário. O usuário poderá alternar o perfil apenas para fins de demonstração.

## 5. Mapa de rotas

### Site público

| Rota | Tela | Conteúdo principal |
| --- | --- | --- |
| `/` | Home | busca direta, imóveis em destaque, categorias, bairros, história da Perez e captação |
| `/imoveis` | Catálogo | filtros, ordenação, favoritos, cards e alternância entre grade e mapa demonstrativo |
| `/imoveis/[codigo]` | Imóvel | galeria, preço, características, descrição, localização, corretor e formulário de contato |
| `/vender-alugar` | Captação | proposta de valor, etapas e formulário demonstrativo para proprietários |
| `/sobre` | Institucional | mais de 35 anos, valores, equipe e presença em Londrina |
| `/contato` | Contato | setores, endereço, horários e atalhos para atendimento |

### Plataforma interna

| Rota | Tela | Conteúdo principal |
| --- | --- | --- |
| `/dashboard` | Visão executiva | KPIs, funil, origens, atendimento, carteira e alertas |
| `/inbox` | Atendimento | conversas estilo WhatsApp, filas, contexto do lead e exemplos IA/manual |
| `/simulacao` | Simulador | jornada do cliente em tempo real, manual ou assistida |
| `/pipelines` | CRM comercial | quadros de venda e locação, etapas e cards de oportunidades |
| `/contatos` | Pessoas | leads, clientes, proprietários e locatários com ficha unificada |
| `/carteira` | Imóveis internos | inventário, status, proprietário, responsável e publicação |
| `/captacoes` | Captações | imóveis em avaliação, documentação e preparação para anúncio |
| `/locacoes` | Contratos | vigências, reajustes, renovações, vistorias e desocupações |
| `/manutencoes` | Manutenção | chamados, prioridade, imóvel, responsável e andamento |
| `/cobrancas` | Lembretes | agenda de lembretes ao locatário, inadimplência visual e regras simuladas |
| `/financeiro` | Resumo financeiro | recebimentos, repasses e pendências, sem emissão ou movimentação real |
| `/atendentes` | Equipe | disponibilidade, setores, carga e indicadores individuais |
| `/configuracoes` | Configurações | setores, filas e preferências apenas demonstrativas |

### Portais

| Rota | Tela | Conteúdo principal |
| --- | --- | --- |
| `/portal` | Acesso demonstrativo | escolha entre proprietário e locatário |
| `/portal/proprietario` | Área do proprietário | imóveis, ocupação, repasses, documentos e chamados |
| `/portal/locatario` | Área do locatário | contrato, boletos fictícios, documentos e solicitações |

## 6. Novo site público

### 6.1 Home

A home deve abrir com fotografia imobiliária de alta qualidade, navegação leve e um mecanismo de busca dominante. O visitante escolhe “Comprar”, “Alugar” ou “Lançamentos” e informa bairro, cidade, código ou característica.

Seções:

- cabeçalho com marca Perez, navegação, favoritos, áreas do cliente e contato;
- hero com busca direta e argumento de confiança;
- imóveis em destaque com dados reais de demonstração;
- atalhos por objetivo: morar, investir, anunciar e administrar;
- bairros de Londrina em destaque;
- bloco “Há mais de 35 anos cuidando de patrimônios e histórias”;
- chamada para avaliação de imóvel;
- depoimentos e indicadores institucionais;
- rodapé completo com contatos, horários e navegação.

### 6.2 Catálogo de imóveis

O catálogo deve apresentar no mínimo doze imóveis fictícios distribuídos entre venda e locação. Os dados precisam conter código, finalidade, tipo, bairro, cidade, preço, condomínio, área, quartos, suítes, banheiros, vagas, destaque e galeria.

Interações:

- filtro por finalidade, tipo, bairro, faixa de preço, quartos e vagas;
- busca por texto ou código;
- ordenação;
- favoritos locais;
- alternância grade/mapa, sendo o mapa uma representação visual;
- retorno ao catálogo preservando o contexto visual quando possível.

### 6.3 Detalhe do imóvel

A ficha deve valorizar fotografia e informação. A página terá galeria principal, código, preço, características, descrição, comodidades, localização aproximada, imóveis semelhantes e um cartão fixo de contato. O envio do formulário apenas exibirá uma confirmação local e poderá levar ao inbox demonstrativo por um atalho explícito.

## 7. Módulos internos

### 7.1 Atendimento

As telas já existentes serão preservadas e visualmente integradas ao Perez 360. A inbox continuará mostrando os dois formatos aprovados: triagem assistida e fluxo manual compatível com a estrutura de mensagens do WhatsApp. A simulação continuará permitindo representar um cliente em tempo real.

### 7.2 CRM comercial

O pipeline deve ter visões para venda e locação. Cada oportunidade deve ligar visualmente pessoa, imóvel, origem, responsável, valor, próxima tarefa e tempo na etapa. A movimentação entre colunas será local e demonstrativa.

### 7.3 Carteira e captação

A carteira deve reutilizar os mesmos imóveis do site, agora com informações operacionais: status de publicação, proprietário, corretor, chaves, documentação e desempenho do anúncio. Captações terão etapas de avaliação, documentação, fotografia e publicação.

### 7.4 Locação e manutenção

A gestão de locações deve apresentar contratos próximos do reajuste ou vencimento, vistorias e desocupações. A manutenção será um quadro simples com prioridade, imóvel, locatário, prestador fictício e status.

### 7.5 Financeiro demonstrativo

O módulo de cobranças existente será ampliado visualmente com um resumo financeiro. Nenhuma tela deverá afirmar que cria cobrança, boleto, repasse ou conciliação real. Botões sensíveis usarão textos como “Simular”, “Visualizar exemplo” ou “Programar lembrete demonstrativo”.

### 7.6 Gestão

O dashboard deve funcionar como ponto inicial do tour interno. Indicadores recomendados: novos leads, tempo de primeira resposta, atendimentos em fila, visitas agendadas, propostas, imóveis ativos, ocupação da carteira e contratos com atenção. Gráficos e números serão derivados de dados mockados.

## 8. Portais do proprietário e locatário

### Proprietário

- resumo da carteira;
- ocupação e status dos imóveis;
- últimos repasses fictícios;
- contratos e documentos;
- solicitações e manutenções;
- contato com o setor responsável.

### Locatário

- dados do imóvel e contrato;
- próximo vencimento;
- histórico de boletos fictícios;
- documentos e vistorias;
- abertura simulada de manutenção;
- conversa com o atendimento.

## 9. Dados demonstrativos

Os módulos compartilharão um conjunto estático e tipado de dados. Um imóvel apresentado na home deve poder aparecer no catálogo, na carteira, em uma oportunidade e em um contrato. Essa consistência é central para a percepção de plataforma integrada.

Entidades visuais:

- imóveis e galerias;
- pessoas e papéis;
- oportunidades;
- conversas;
- contratos;
- manutenções;
- lembretes e lançamentos financeiros fictícios;
- usuários e equipes;
- indicadores derivados.

Persistência no navegador poderá ser usada apenas para favoritos, filtros e mudanças demonstrativas. Deve existir uma forma simples de restaurar a demonstração ao estado inicial.

## 10. Direção visual

- marca Perez em vermelho profundo, branco, grafite e tons quentes neutros;
- site público com fotografia ampla, títulos editoriais e bastante respiro;
- plataforma interna mais densa, porém limpa e organizada;
- tipografia consistente entre todos os ambientes;
- cartões com bordas discretas, sombras leves e raios moderados;
- ícones lineares e estados de cor sem excesso;
- mensagens de WhatsApp com aparência familiar, sem copiar elementos protegidos de forma enganosa;
- indicação persistente de demonstração nas áreas internas e portais.

## 11. Responsividade

### Site público

- busca do hero reorganizada verticalmente no celular;
- catálogo com filtros em painel deslizante;
- cards em uma coluna;
- detalhe com galeria e contato adaptados, sem barra fixa que cubra conteúdo.

### Plataforma interna

- menu lateral transformado em navegação móvel;
- dashboards empilhados;
- tabelas substituídas por cartões quando necessário;
- quadros horizontais preservam rolagem controlada;
- inbox abre lista e conversa em etapas no celular.

### Portais

- navegação inferior ou menu compacto;
- dados financeiros e documentos em cartões legíveis;
- ações primárias com área de toque adequada.

## 12. Acessibilidade e qualidade

- contraste suficiente para textos e estados;
- foco visível em controles;
- labels acessíveis em campos e botões;
- imagens com textos alternativos;
- navegação por teclado nas principais jornadas;
- ausência de overflow horizontal acidental nos tamanhos de referência;
- animações curtas e respeitando preferência por movimento reduzido.

## 13. Roteiro sugerido para a apresentação

1. Abrir a nova home e realizar uma busca.
2. Filtrar o catálogo e abrir um imóvel.
3. Demonstrar o contato do cliente e entrar no inbox.
4. Mostrar a oportunidade no pipeline.
5. Abrir o imóvel na carteira interna.
6. Passar por contrato, manutenção e cobrança demonstrativa.
7. Mostrar os portais de proprietário e locatário.
8. Encerrar no dashboard executivo.

## 14. Fora do escopo

- banco de dados e APIs de produção;
- login, autorização e segurança reais;
- integração real com WhatsApp/Meta;
- integração com ERP, portais imobiliários ou assinatura eletrônica;
- emissão de boletos, cobrança, conciliação ou repasse;
- geocodificação e mapa funcional;
- upload e gestão real de documentos ou mídias;
- migração do site ou do CRM atuais;
- painel administrativo capaz de publicar conteúdo real;
- SEO técnico completo, analytics e observabilidade de produção.

## 15. Critérios de conclusão da apresentação visual

- todas as rotas principais do tour abrem sem erro;
- home, catálogo e detalhe exibem imóveis consistentes e convincentes;
- pelo menos uma jornada conecta visualmente site, atendimento, CRM e operação;
- portais exibem conteúdo coerente com as mesmas entidades;
- telas principais funcionam em larguras de notebook e celular;
- nenhuma interação crítica termina em tela vazia;
- todos os dados e integrações simulados são claramente identificáveis como demonstração;
- lint, testes relevantes e build de produção passam.
