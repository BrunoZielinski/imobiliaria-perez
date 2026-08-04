"use client";

import { useMemo, useState } from "react";
import {
  CalendarPlus,
  FlaskConical,
  Puzzle,
  ShieldCheck,
} from "lucide-react";
import { AgendaLembretes } from "@/components/cobrancas/agenda-lembretes";
import { DetalheLembrete } from "@/components/cobrancas/detalhe-lembrete";
import { ProgramarLembrete } from "@/components/cobrancas/programar-lembrete";
import { ResumoCobrancas } from "@/components/cobrancas/resumo-cobrancas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvisoDemonstracao } from "@/components/gestao/aviso-demonstracao";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  cancelarLembrete,
  pausarLembrete,
  programarLembrete,
  resumoAgenda,
} from "@/lib/cobrancas/agenda";
import {
  LEMBRETES_DEMO,
  type NovoLembrete,
} from "@/lib/mock/cobrancas";

const AGORA_DEMO = new Date("2026-07-30T12:00:00-03:00");

const CobrancasPage = () => {
  const [lembretes, setLembretes] = useState(() =>
    LEMBRETES_DEMO.map((item) => ({ ...item })),
  );
  const [selecionadoId, setSelecionadoId] = useState("lc-1");
  const [dialogoAberto, setDialogoAberto] = useState(false);
  const [cancelarId, setCancelarId] = useState<string | null>(null);

  const resumo = useMemo(
    () => resumoAgenda(lembretes, AGORA_DEMO),
    [lembretes],
  );
  const selecionado = lembretes.find((item) => item.id === selecionadoId);

  const adicionar = (novo: NovoLembrete) => {
    setLembretes((atuais) => {
      const atualizados = programarLembrete(atuais, novo);
      setSelecionadoId(atualizados.at(-1)!.id);
      return atualizados;
    });
  };

  const confirmarCancelamento = () => {
    if (!cancelarId) return;
    setLembretes((atuais) => cancelarLembrete(atuais, cancelarId));
    setCancelarId(null);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-5">
        <header className="flex items-end justify-between gap-6">
          <div>
            <Badge
              variant="outline"
              className="border-violet-200 bg-violet-50 text-violet-700"
            >
              <FlaskConical className="size-3" />
              Protótipo visual
            </Badge>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">
              Lembretes de cobrança
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Avise o locatário antes do vencimento, com contexto e previsibilidade.
            </p>
          </div>
          <Button onClick={() => setDialogoAberto(true)}>
            <CalendarPlus className="size-4" />
            Programar lembrete
          </Button>
        </header>

        <AvisoDemonstracao
          titulo="Lembretes demonstrativos"
          descricao="A agenda não envia mensagens, não consulta pagamentos e não gera cobranças reais."
        />

        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-amber-100">
              <Puzzle className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold">
                Módulo adicional — não incluído no núcleo da proposta de R$ 30 mil
              </p>
              <p className="text-[10px] text-amber-800">
                Demonstração limitada a lembretes antes do vencimento.
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold">
            <ShieldCheck className="size-3.5" />
            Sem envio real ou consulta financeira
          </span>
        </div>

        <ResumoCobrancas resumo={resumo} />

        <div className="grid min-h-[28rem] grid-cols-[minmax(0,1fr)_22rem] gap-4">
          <AgendaLembretes
            lembretes={lembretes}
            selecionadoId={selecionadoId}
            aoSelecionar={setSelecionadoId}
          />
          <DetalheLembrete
            lembrete={selecionado}
            aoPausar={(id) =>
              setLembretes((atuais) => pausarLembrete(atuais, id))
            }
            aoSolicitarCancelamento={setCancelarId}
          />
        </div>
      </div>

      <ProgramarLembrete
        aberto={dialogoAberto}
        aoAlterarAberto={setDialogoAberto}
        aoProgramar={adicionar}
      />

      <AlertDialog
        open={Boolean(cancelarId)}
        onOpenChange={(aberto) => {
          if (!aberto) setCancelarId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar este lembrete?</AlertDialogTitle>
            <AlertDialogDescription>
              A programação ficará marcada como cancelada somente nesta
              demonstração. Nenhuma ação externa será executada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmarCancelamento}
            >
              Confirmar cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CobrancasPage;
