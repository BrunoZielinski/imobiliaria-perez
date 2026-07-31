"use client";

import { useRouter } from "next/navigation";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import { useCrm } from "@/lib/store/crm-store";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const Simulador = () => {
  const router = useRouter();
  const reiniciar = useCrm((s) => s.reiniciar);

  const apresentar = () => {
    reiniciar();
    router.push("/simulacao");
  };

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="sm" />}>
        <Play className="size-3.5 fill-current" />
        Apresentar cenário
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b bg-primary/[0.035] p-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-3.5" />
            </span>
            Demonstração ao vivo
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Digite como se fosse o cliente e acompanhe a mensagem chegando pela Cloud API,
            passando pela Ana e sendo entregue ao atendente correto.
          </p>
        </div>
        <div className="space-y-3 p-4">
          <div className="rounded-xl border bg-muted/35 p-3 text-xs">
            <p className="font-semibold">O que destacar</p>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              A visão do cliente, os eventos técnicos e a operação da Central Perez aparecem ao
              mesmo tempo.
            </p>
          </div>
          <Button className="w-full" size="sm" onClick={apresentar}>
            <RotateCcw className="size-3.5" />
            Abrir simulação ao vivo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
