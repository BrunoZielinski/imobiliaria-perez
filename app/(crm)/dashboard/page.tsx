"use client";

import { useCrm } from "@/lib/store/crm-store";
import { minutosUteisEntre } from "@/lib/expediente/expediente";
import { CartaoMetrica } from "@/components/crm/cartao-metrica";
import { PIPELINES, ETAPAS_TERMINAIS } from "@/lib/mock/pipelines";
import { CANAIS, DEPARTAMENTOS, SLA_PRIMEIRA_RESPOSTA_MIN } from "@/lib/tipos";
import type { Canal, Departamento } from "@/lib/tipos";
import { Progress } from "@/components/ui/progress";

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

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="grid grid-cols-4 gap-3">
        <CartaoMetrica rotulo="Conversas" valor={String(totalConversas)} apoio="no período" />
        <CartaoMetrica rotulo="Aguardando na fila" valor={String(emFila)} />
        <CartaoMetrica
          rotulo="1ª resposta"
          valor={`${tempoMedio} min`}
          apoio={`${dentroDoSla} de ${temposResposta.length} dentro do SLA de ${SLA_PRIMEIRA_RESPOSTA_MIN} min`}
        />
        <CartaoMetrica rotulo="Em negociação" valor={moeda(valorEmNegociacao)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-4">
          <p className="mb-3 text-sm font-medium">Conversas por canal</p>
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

        <div className="rounded-lg border p-4">
          <p className="mb-3 text-sm font-medium">Conversas por departamento</p>
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

      <div className="rounded-lg border p-4">
        <p className="mb-3 text-sm font-medium">Leads por pipeline</p>
        <div className="grid grid-cols-4 gap-3">
          {PIPELINES.map((pipeline) => (
            <div key={pipeline.id}>
              <p className="text-xs text-muted-foreground">{pipeline.nome}</p>
              <p className="text-2xl font-semibold">
                {dados.leads.filter((lead) => lead.pipeline === pipeline.id).length}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
