# Perez 360 — Central de Marketing Design

## Objetivo

Adicionar ao painel Perez 360 uma área visual completa para o social media interno e a gestão de tráfego da Imobiliária Perez. O módulo deve demonstrar como a equipe planeja, cria, aprova, agenda e acompanha conteúdos orgânicos e campanhas pagas em Instagram, Facebook, Google, TikTok e YouTube.

Esta entrega permanece exclusivamente front-end. Nenhuma publicação, compra de mídia, cobrança, integração com rede social ou geração de IA real será executada.

## Público e história principal

O módulo atende dois perfis internos:

- social media, responsável por planejamento, criação, revisão e calendário;
- gestor de tráfego, responsável por campanhas, públicos, orçamento e desempenho.

A principal história demonstrativa começa pela seleção de um imóvel da base Perez 360. O usuário escolhe objetivo, público, canais, formatos e tom. A IA simulada gera um kit de campanha com peças específicas para cada canal. O conteúdo segue para aprovação, agendamento e acompanhamento em métricas fictícias coerentes.

## Navegação e arquitetura visual

O menu principal do CRM recebe o item `Marketing`, com rota `/marketing` e ícone de megafone. A página usa o mesmo shell responsivo, cabeçalho, cores e padrões de demonstração do restante do Perez 360.

Dentro da página, uma navegação local alterna seis áreas sem criar novas rotas:

1. `Visão geral`
2. `Estúdio IA`
3. `Calendário`
4. `Tráfego pago`
5. `Conteúdos`
6. `Aprovações`

Em notebook, a navegação local aparece como abas horizontais. No celular, torna-se um seletor compacto e mantém todo o conteúdo em uma única coluna.

## Visão geral

A abertura do módulo apresenta:

- conteúdos planejados na semana;
- itens aguardando aprovação;
- campanhas ativas;
- investimento mensal demonstrativo;
- leads gerados;
- custo por lead;
- próximos conteúdos agendados;
- distribuição de conteúdo por canal;
- alerta de campanha com oportunidade de otimização.

Os indicadores devem ser derivados do mesmo conjunto local de campanhas e não podem se contradizer.

## Estúdio IA

O estúdio usa duas colunas no notebook e uma coluna no celular.

### Configuração

O lado de configuração contém:

- imóvel da base compartilhada `IMOVEIS_PEREZ`;
- objetivo: vender, alugar, captar proprietário, fortalecer marca ou gerar visitas;
- público sugerido;
- canais: Instagram, Facebook, Google, TikTok e YouTube;
- formato: post, carrossel, stories, vídeo curto, anúncio de busca ou vídeo;
- tom: sofisticado, próximo, direto ou institucional;
- chamada para ação;
- botão `Gerar campanha com IA`.

### Resultado simulado

Ao gerar, a interface exibe um estado curto de processamento e monta um kit visual contendo:

- conceito central da campanha;
- legenda para Instagram e Facebook;
- sequência de carrossel;
- roteiro de vídeo curto;
- títulos e descrições para Google Ads;
- texto para TikTok e YouTube;
- hashtags e chamadas para ação;
- sugestões de imagem selecionadas da galeria do imóvel;
- nota de adequação à identidade Perez.

O resultado pode ser enviado para aprovação ou salvo como rascunho. Essas ações atualizam apenas o estado local da demonstração.

## Calendário editorial

O calendário mensal apresenta conteúdos orgânicos e campanhas pagas com:

- data e horário;
- canal;
- formato;
- imóvel ou tema;
- responsável;
- status;
- marcador para conteúdo orgânico ou mídia paga.

Também devem existir uma lista dos próximos agendamentos e uma legenda de status. O calendário não publica conteúdos reais.

## Gestão de tráfego

A área de tráfego pago apresenta campanhas para Meta Ads, Google Ads, TikTok Ads e YouTube Ads. Cada campanha contém:

- nome e objetivo;
- canal e período;
- imóvel relacionado quando aplicável;
- público resumido;
- orçamento planejado e investimento demonstrativo;
- alcance, impressões, cliques, CTR e CPC;
- leads, CPL e conversões;
- status: rascunho, ativa, pausada ou concluída;
- sinal visual de desempenho.

Uma seção de recomendações simuladas destaca oportunidades como redistribuição de orçamento, troca de criativo ou expansão de público. Nenhuma recomendação altera uma plataforma externa.

## Biblioteca de conteúdos

A biblioteca exibe cartões filtráveis por canal, formato, imóvel e status. Cada conteúdo mostra miniatura, título, canais, responsável, data e estágio. Os filtros são locais e instantâneos.

Os itens iniciais devem cobrir conteúdo institucional, captação de proprietário, venda, locação, lançamento e manutenção de marca.

## Aprovações

O fluxo usa cinco estados:

`Rascunho → Revisão → Aprovado → Agendado → Publicado`

A visualização organiza os conteúdos por etapa e permite avançar itens apenas localmente. Itens em revisão mostram observações fictícias e responsável pela aprovação. A interface deve deixar explícito que os estados são demonstrativos.

## Dados e limites

Os tipos e dados do módulo ficam em `lib/perez360/marketing.ts`. Funções puras derivam métricas, filtram conteúdos e geram o kit de IA simulado. Componentes visuais não calculam indicadores diretamente.

Os imóveis são consumidos de `lib/perez360/dados.ts`, garantindo que o código, título, bairro, preço e imagens sejam os mesmos do site e da carteira interna.

Não fazem parte desta etapa:

- APIs de OpenAI ou outro provedor de IA;
- Meta Marketing API, Google Ads API, TikTok Ads ou YouTube Data API;
- publicação real ou agendamento externo;
- autenticação, permissões ou aprovação real;
- orçamento real, cobrança ou dados financeiros reais;
- upload persistente de arquivos.

## Estados e tratamento de erros

- Sem imóvel selecionado, o botão de geração fica desabilitado e a interface explica o próximo passo.
- Durante a geração, um estado visual informa que a IA demonstrativa está criando as variações.
- Se nenhum conteúdo corresponder aos filtros, a biblioteca apresenta um estado vazio com ação para limpar filtros.
- Métricas com denominador zero retornam zero, evitando valores inválidos.
- Imagens ausentes usam uma área neutra com identificação do imóvel.

## Responsividade e acessibilidade

- Notebook: conteúdo central com largura máxima, cards em grade e estúdio em duas colunas.
- Celular: abas substituídas por seletor, cards empilhados, calendário com rolagem controlada e formulários em uma coluna.
- Controles possuem rótulos acessíveis e foco visível.
- Cores de status nunca são o único meio de transmitir informação.
- Nenhuma seção pode causar overflow horizontal na página.

## Testes e critérios de aceite

Testes unitários devem validar:

- item Marketing presente na navegação;
- vínculo entre campanhas e imóveis existentes;
- cálculo coerente de investimento, leads, CTR, CPC e CPL;
- geração determinística do kit de conteúdo simulado;
- filtros da biblioteca;
- progressão válida entre estados de aprovação.

A entrega é aceita quando:

- `/marketing` abre pelo menu principal e pelo seletor móvel;
- as seis áreas internas são navegáveis;
- o Estúdio IA gera e exibe um kit completo para um imóvel;
- calendário, tráfego, biblioteca e aprovações possuem dados plausíveis;
- o módulo funciona em notebook e celular sem overflow;
- testes, lint, TypeScript e build de produção encerram com código zero;
- toda ação externa ou sensível está identificada como demonstração.
