"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarPlus, Info, MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  NOVO_LEMBRETE_PADRAO,
  type NovoLembrete,
} from "@/lib/mock/cobrancas";

const previa = (dados: NovoLembrete) =>
  `Olá, ${dados.locatario}. O aluguel do imóvel ${dados.imovel} vence em ${format(new Date(`${dados.vencimento}T12:00:00`), "dd/MM/yyyy")}. Caso já tenha realizado o pagamento, desconsidere esta mensagem.`;

export const ProgramarLembrete = ({
  aberto,
  aoAlterarAberto,
  aoProgramar,
}: {
  aberto: boolean;
  aoAlterarAberto: (aberto: boolean) => void;
  aoProgramar: (novo: NovoLembrete) => void;
}) => {
  const [dados, setDados] = useState<NovoLembrete>({
    ...NOVO_LEMBRETE_PADRAO,
  });

  const confirmar = () => {
    aoProgramar(dados);
    aoAlterarAberto(false);
  };

  return (
    <Dialog open={aberto} onOpenChange={aoAlterarAberto}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
              <CalendarPlus className="size-4" />
            </span>
            Programar lembrete
          </DialogTitle>
          <DialogDescription>
            Simule um aviso de utilidade antes do vencimento do aluguel.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="locatario">Locatário</Label>
            <Input
              id="locatario"
              value={dados.locatario}
              onChange={(evento) =>
                setDados({ ...dados, locatario: evento.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contrato">Contrato</Label>
            <Input
              id="contrato"
              value={dados.contrato}
              onChange={(evento) =>
                setDados({ ...dados, contrato: evento.target.value })
              }
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="imovel">Imóvel</Label>
            <Input
              id="imovel"
              value={dados.imovel}
              onChange={(evento) =>
                setDados({ ...dados, imovel: evento.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vencimento">Data de vencimento</Label>
            <Input
              id="vencimento"
              type="date"
              value={dados.vencimento}
              onChange={(evento) =>
                setDados({ ...dados, vencimento: evento.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="antecedencia">Antecedência</Label>
              <NativeSelect
                id="antecedencia"
                className="w-full"
                value={dados.antecedenciaDias}
                onChange={(evento) =>
                  setDados({
                    ...dados,
                    antecedenciaDias: Number(evento.target.value) as 1 | 3 | 5 | 7,
                  })
                }
              >
                {[1, 3, 5, 7].map((dias) => (
                  <NativeSelectOption key={dias} value={dias}>
                    {dias} {dias === 1 ? "dia antes" : "dias antes"}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                type="time"
                value={dados.horario}
                onChange={(evento) =>
                  setDados({ ...dados, horario: evento.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
              <MessageCircleMore className="size-3.5" />
              Prévia do template
            </p>
            <span className="text-[9px] font-semibold text-sky-700">
              Meta aprovado — demonstração
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-sky-950">
            {previa(dados)}
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-[10px] text-sky-700">
            <Info className="size-3" />
            Esta ação altera somente os dados locais do protótipo.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => aoAlterarAberto(false)}>
            Voltar
          </Button>
          <Button onClick={confirmar}>
            <CalendarPlus className="size-4" />
            Programar lembrete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
