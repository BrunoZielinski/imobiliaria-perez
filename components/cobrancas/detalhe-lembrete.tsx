import { format } from "date-fns";
import {
  CalendarClock,
  Check,
  CirclePause,
  Clock3,
  MessageCircleMore,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { LembreteCobranca } from "@/lib/mock/cobrancas";

const dataCurta = (data: string) =>
  format(new Date(`${data}T12:00:00`), "dd/MM/yyyy");

export const mensagemDoLembrete = (lembrete: LembreteCobranca) =>
  `Olá, ${lembrete.locatario}. O aluguel do imóvel ${lembrete.imovel} vence em ${dataCurta(lembrete.vencimento)}. Caso já tenha realizado o pagamento, desconsidere esta mensagem.`;

export const DetalheLembrete = ({
  lembrete,
  aoPausar,
  aoSolicitarCancelamento,
}: {
  lembrete: LembreteCobranca | undefined;
  aoPausar: (id: string) => void;
  aoSolicitarCancelamento: (id: string) => void;
}) => {
  if (!lembrete) {
    return (
      <aside className="flex min-h-80 items-center justify-center rounded-2xl border bg-background p-6 text-center text-sm text-muted-foreground shadow-xs">
        Selecione uma programação para ver os detalhes.
      </aside>
    );
  }

  const enviado = lembrete.status === "enviado";
  const editavel = lembrete.status === "agendado";
  const etapas = [
    { rotulo: "Programado", concluida: true },
    { rotulo: "Processado", concluida: enviado },
    { rotulo: "Enviado", concluida: enviado },
  ];

  return (
    <aside className="flex min-h-0 flex-col rounded-2xl border bg-background shadow-xs">
      <div className="border-b px-5 py-4">
        <Badge
          variant="outline"
          className="border-sky-200 bg-sky-50 text-sky-700"
        >
          Template Meta aprovado — demonstração
        </Badge>
        <h2 className="mt-3 text-base font-bold">{lembrete.locatario}</h2>
        <p className="text-[11px] text-muted-foreground">
          {lembrete.contrato} · {lembrete.imovel}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/55 p-3">
            <p className="text-[10px] text-muted-foreground">Vencimento</p>
            <p className="mt-1 text-xs font-bold">
              {dataCurta(lembrete.vencimento)}
            </p>
          </div>
          <div className="rounded-xl bg-muted/55 p-3">
            <p className="text-[10px] text-muted-foreground">Antecedência</p>
            <p className="mt-1 text-xs font-bold">
              {lembrete.antecedenciaDias} dias antes
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            <MessageCircleMore className="size-3.5" />
            Prévia da mensagem
          </p>
          <div className="rounded-2xl rounded-br-md bg-[#d9fdd3] p-3 text-xs leading-relaxed text-slate-800 shadow-xs">
            {mensagemDoLembrete(lembrete)}
            <p className="mt-2 text-right text-[9px] text-slate-500">
              {lembrete.horario}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            <CalendarClock className="size-3.5" />
            Linha do tempo visual
          </p>
          <div className="flex items-center">
            {etapas.map((etapa, indice) => (
              <div key={etapa.rotulo} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`flex size-6 items-center justify-center rounded-full ${
                      etapa.concluida
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {etapa.concluida ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Clock3 className="size-3" />
                    )}
                  </span>
                  <span className="text-[9px] font-medium">{etapa.rotulo}</span>
                </div>
                {indice < etapas.length - 1 && (
                  <span
                    className={`mb-4 h-px flex-1 ${
                      etapas[indice + 1].concluida ? "bg-emerald-400" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-800">
            Nenhuma mensagem real será enviada nesta demonstração.
          </p>
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          {editavel ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => aoPausar(lembrete.id)}
              >
                <CirclePause className="size-3.5" />
                Pausar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive hover:text-destructive"
                onClick={() => aoSolicitarCancelamento(lembrete.id)}
              >
                <X className="size-3.5" />
                Cancelar
              </Button>
            </>
          ) : (
            <p className="w-full rounded-lg border border-dashed p-2 text-center text-[10px] text-muted-foreground">
              {enviado
                ? "Ação indisponível para lembretes enviados"
                : "Esta programação não aceita novas ações"}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
