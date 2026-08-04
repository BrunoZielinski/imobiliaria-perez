"use client";

import { useCrm } from "@/lib/store/crm-store";
import { minutosUteisEntre } from "@/lib/expediente/expediente";
import { CartaoMetrica } from "@/components/crm/cartao-metrica";
import { PIPELINES, ETAPAS_TERMINAIS } from "@/lib/mock/pipelines";
import { CANAIS, DEPARTAMENTOS, SLA_PRIMEIRA_RESPOSTA_MIN } from "@/lib/tipos";
import type { Canal, Departamento } from "@/lib/tipos";
import { Progress } from "@/components/ui/progress";
import { AlertasExecutivos } from "@/components/gestao/alertas-executivos";
import { calcularIndicadoresExecutivos } from "@/lib/perez360/indicadores";

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const DashboardPage = () => {
  const dados = useCrm((s) => s.dados);

  const respondidas = dados.conversas.filter((c) => c.primeiraRespostaEm && c.entrouNaFilaEm);
  const temposResposta = respondidas.map((c) =>
    minutosUteisEntre(new Date(c.entrouNaFilaEm!), new Date(c.primeiraRespostaEm!))
  );
  const tempoMedio = temposResposta.length
    ? Math.round(temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length)
    : 0;
  const dentroDoSla = temposResposta.filter((t) => t <= SLA_PRIMEIRA_RESPOSTA_MIN).length;

  const porCanal = (Object.keys(CANAIS) as Canal[]).map((canal) => ({
    canal,
    total: dados.conversas.filter((c) => c.canal === canal).length,
  }));

  const porDepartamento = (Object.keys(DEPARTAMENTOS) as Departamento[]).map((departamento) => ({
    departamento,
    total: dados.conversas.filter((c) => c.departamento === departamento).length,
  }));

  const totalConversas = dados.conversas.length;
  const emFila = dados.conversas.filter((c) => c.status === "fila").length;
  const valorEmNegociacao = dados.leads
    .filter((lead) => !ETAPAS_TERMINAIS.has(lead.etapaId))
    .reduce((soma, lead) => soma + lead.valor, 0);
  const executivos = calcularIndicadoresExecutivos();

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 p-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          Visão da operação
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Indicadores</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Atendimento, distribuição e oportunidades em uma única leitura.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2">
        <CartaoMetrica rotulo="Conversas" valor={String(totalConversas)} apoio="no período" />
        <CartaoMetrica rotulo="Aguardando na fila" valor={String(emFila)} />
        <CartaoMetrica
          rotulo="1ª resposta"
          valor={`${tempoMedio} min`}
          apoio={`${dentroDoSla} de ${temposResposta.length} dentro do SLA de ${SLA_PRIMEIRA_RESPOSTA_MIN} min`}
        />
        <CartaoMetrica rotulo="Em negociação" valor={moeda(valorEmNegociacao)} />
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <CartaoMetrica rotulo="Imóveis ativos" valor={String(executivos.imoveisAtivos)} apoio="mesma base do site" />
        <CartaoMetrica rotulo="Ocupação da carteira" valor={`${executivos.ocupacao}%`} apoio="dado demonstrativo" />
        <CartaoMetrica rotulo="Contratos com atenção" valor={String(executivos.contratosAtencao)} />
        <CartaoMetrica rotulo="Manutenções abertas" valor={String(executivos.manutencoesAbertas)} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border bg-background p-5 shadow-xs">
          <p className="mb-4 text-sm font-bold">Conversas por canal</p>
          <div className="flex flex-col gap-3">
            {porCanal.map(({ canal, total }) => (
              <div key={canal} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span>{CANAIS[canal]}</span>
                  <span className="text-muted-foreground">{total}</span>
                </div>
                <Progress value={totalConversas ? (total / totalConversas) * 100 : 0} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-5 shadow-xs">
          <p className="mb-4 text-sm font-bold">Conversas por departamento</p>
          <div className="flex flex-col gap-3">
            {porDepartamento.map(({ departamento, total }) => (
              <div key={departamento} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span>{DEPARTAMENTOS[departamento]}</span>
                  <span className="text-muted-foreground">{total}</span>
                </div>
                <Progress value={totalConversas ? (total / totalConversas) * 100 : 0} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-5 shadow-xs">
        <p className="mb-4 text-sm font-bold">Leads por pipeline</p>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {PIPELINES.map((pipeline) => (
            <div key={pipeline.id} className="rounded-xl bg-muted/45 px-4 py-3">
              <p className="text-xs text-muted-foreground">{pipeline.nome}</p>
              <p className="mt-1 text-2xl font-bold">
                {dados.leads.filter((lead) => lead.pipeline === pipeline.id).length}
              </p>
            </div>
          ))}
        </div>
      </div>
      <AlertasExecutivos />
      </div>
    </div>
  );
};

export default DashboardPage;
