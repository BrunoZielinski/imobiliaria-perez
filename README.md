# Perez 360 — apresentação visual

Protótipo navegável da futura plataforma digital da Imobiliária Perez. A demonstração conecta novo site público, catálogo de imóveis, atendimento, CRM, operação de locação, portais e gestão executiva.

## Natureza da entrega

Esta aplicação é exclusivamente front-end. Imóveis, pessoas, contratos, mensagens, valores e documentos são fictícios. Não existe integração real com WhatsApp/Meta, bancos, ERP, portais imobiliários, mapas, assinatura eletrônica ou autenticação.

## Executar localmente

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000). O botão **Iniciar apresentação** mostra a sequência recomendada de oito módulos.

## Rotas públicas

- `/` — nova home Busca Direta;
- `/imoveis` — catálogo, filtros, favoritos e mapa demonstrativo;
- `/imoveis/pz-1001` — imóvel principal da jornada;
- `/vender-alugar` — captação e administração;
- `/sobre` — história e posicionamento;
- `/contato` — canais e formulário demonstrativo.

## Plataforma interna

- `/dashboard`, `/inbox`, `/simulacao`, `/pipelines`, `/marketing`;
- `/contatos`, `/carteira`, `/captacoes`;
- `/locacoes`, `/manutencoes`, `/cobrancas`, `/financeiro`;
- `/atendentes`, `/configuracoes`.

`/marketing` apresenta uma central demonstrativa para social media, IA de conteúdo, calendário editorial, tráfego pago e aprovações.

## Portais

- `/portal` — escolha do perfil;
- `/portal/proprietario` — carteira, repasses, documentos e chamados;
- `/portal/locatario` — contrato, vencimentos, documentos e manutenção.

## Verificação

```bash
pnpm test
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Favoritos e mudanças simuladas permanecem apenas no navegador. Use a ação **Restaurar demonstração** no cabeçalho interno para voltar ao estado inicial.
