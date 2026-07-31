import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  LembreteCobranca,
  StatusLembrete,
} from "@/lib/mock/cobrancas";

const STATUS: Record<
  StatusLembrete,
  { rotulo: string; classe: string }
> = {
  agendado: {
    rotulo: "Agendado",
    classe: "border-violet-200 bg-violet-50 text-violet-700",
  },
  enviado: {
    rotulo: "Enviado",
    classe: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  pausado: {
    rotulo: "Pausado",
    classe: "border-slate-200 bg-slate-100 text-slate-600",
  },
  cancelado: {
    rotulo: "Cancelado",
    classe: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

const dataCurta = (data: string) =>
  format(new Date(`${data}T12:00:00`), "dd/MM/yyyy", { locale: ptBR });

const dataHora = (data: string) =>
  format(new Date(data), "dd/MM · HH:mm", { locale: ptBR });

export const AgendaLembretes = ({
  lembretes,
  selecionadoId,
  aoSelecionar,
}: {
  lembretes: LembreteCobranca[];
  selecionadoId: string | null;
  aoSelecionar: (id: string) => void;
}) => {
  const ordenados = [...lembretes].sort((a, b) =>
    a.agendadoPara.localeCompare(b.agendadoPara),
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border bg-background shadow-xs">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="text-sm font-bold">Agenda de lembretes</h2>
          <p className="text-[11px] text-muted-foreground">
            Programações locais para a demonstração
          </p>
        </div>
        <Badge variant="outline">{lembretes.length} registros</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-muted/35 text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Locatário</th>
              <th className="px-3 py-3 font-semibold">Contrato / imóvel</th>
              <th className="px-3 py-3 font-semibold">Vencimento</th>
              <th className="px-3 py-3 font-semibold">Programado</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="w-8 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {ordenados.map((lembrete) => {
              const status = STATUS[lembrete.status];
              return (
                <tr
                  key={lembrete.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Abrir lembrete de ${lembrete.locatario}`}
                  onClick={() => aoSelecionar(lembrete.id)}
                  onKeyDown={(evento) => {
                    if (evento.key === "Enter" || evento.key === " ") {
                      evento.preventDefault();
                      aoSelecionar(lembrete.id);
                    }
                  }}
                  className={cn(
                    "cursor-pointer border-b transition-colors last:border-b-0 hover:bg-muted/40",
                    selecionadoId === lembrete.id && "bg-violet-50/60",
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold">{lembrete.locatario}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {lembrete.antecedenciaDias} dias antes
                    </p>
                  </td>
                  <td className="max-w-44 px-3 py-3">
                    <p className="font-medium">{lembrete.contrato}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {lembrete.imovel}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {dataCurta(lembrete.vencimento)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {dataHora(lembrete.agendadoPara)}
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="outline" className={status.classe}>
                      {status.rotulo}
                    </Badge>
                  </td>
                  <td className="px-2 py-3 text-muted-foreground">
                    <ChevronRight className="size-4" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
