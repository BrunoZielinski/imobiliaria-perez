import { format } from "date-fns";
import { CheckCircle2, ListChecks, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mensagem } from "@/lib/tipos";

export const MensagemHistorica = ({ mensagem }: { mensagem: Mensagem }) => {
  const doContato = mensagem.autor === "contato";
  const daAna = mensagem.autor === "ana";
  const doSistema = mensagem.autor === "sistema";
  const foiEscolha =
    mensagem.apresentacao?.tipo === "button_reply" ||
    mensagem.apresentacao?.tipo === "list_reply";

  return (
    <div className={cn("flex flex-col gap-1.5", !doContato && "items-end")}>
      {daAna && (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-primary">
          <Sparkles className="size-3" /> Ana
        </span>
      )}
      {doSistema && (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-sky-700">
          <ListChecks className="size-3" /> Automação Meta
        </span>
      )}
      {foiEscolha && (
        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700">
          <CheckCircle2 className="size-3" /> Escolha do cliente
        </span>
      )}
      <div
        className={cn(
          "max-w-[72%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-xs",
          doContato && "rounded-bl-md border bg-background",
          daAna && "rounded-br-md border border-primary/15 bg-primary/[0.04]",
          doSistema && "rounded-br-md border border-sky-200 bg-sky-50 text-sky-950",
          mensagem.autor === "atendente" &&
            "rounded-br-md bg-primary text-primary-foreground",
        )}
      >
        <p>{mensagem.texto}</p>
        {mensagem.apresentacao?.tipo === "botoes" && (
          <div className="mt-3 grid gap-1.5 border-t border-sky-200 pt-2.5">
            {mensagem.apresentacao.opcoes.map((opcao) => (
              <button
                key={opcao}
                type="button"
                disabled
                aria-disabled="true"
                className="rounded-lg border border-sky-200 bg-white/80 px-3 py-2 text-center text-xs font-semibold text-sky-700"
              >
                {opcao}
              </button>
            ))}
          </div>
        )}
        {mensagem.apresentacao?.tipo === "lista" && (
          <div className="mt-3 overflow-hidden rounded-lg border border-sky-200 bg-white/80">
            <div className="flex items-center gap-2 border-b border-sky-200 px-3 py-2 text-xs font-bold text-sky-700">
              <ListChecks className="size-3.5" />
              {mensagem.apresentacao.rotulo}
            </div>
            {mensagem.apresentacao.opcoes.map((opcao) => (
              <button
                key={opcao}
                type="button"
                disabled
                aria-disabled="true"
                className="block w-full border-b border-sky-100 px-3 py-2 text-left text-xs last:border-b-0"
              >
                {opcao}
              </button>
            ))}
          </div>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground">
        {format(new Date(mensagem.em), "dd/MM HH:mm")}
      </span>
    </div>
  );
};
