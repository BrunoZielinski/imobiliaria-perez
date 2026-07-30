"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { useCrm } from "@/lib/store/crm-store";
import { receberMensagem, drenarFila } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Canal } from "@/lib/tipos";
import { CANAIS } from "@/lib/tipos";

export const Simulador = () => {
  const contatos = useCrm((s) => s.dados.contatos);
  const reiniciar = useCrm((s) => s.reiniciar);
  const [contatoId, setContatoId] = useState("ct-6");
  const [canal, setCanal] = useState<Canal>("whatsapp");
  const [texto, setTexto] = useState("quero comprar um apartamento na Gleba Palhano");

  const disparar = async () => {
    const agora = new Date();
    await receberMensagem({
      contatoId,
      canal,
      texto,
      agora,
      departamentoDireto: canal === "whatsapp" ? undefined : "comercial",
    });
    await drenarFila(agora);
  };

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="sm" />}>
        <Zap className="size-4" />
        Simular lead
      </PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col gap-3" align="end">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Contato</Label>
          <Select
            items={Object.fromEntries(contatos.map((c) => [c.id, c.nome]))}
            value={contatoId}
            onValueChange={(valor) => setContatoId(valor as string)}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contatos.map((contato) => (
                <SelectItem key={contato.id} value={contato.id}>
                  {contato.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Canal</Label>
          <Select items={CANAIS} value={canal} onValueChange={(v) => setCanal(v as Canal)}>
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(CANAIS) as Canal[]).map((valor) => (
                <SelectItem key={valor} value={valor}>
                  {CANAIS[valor]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Mensagem</Label>
          <Input value={texto} onChange={(e) => setTexto(e.target.value)} />
        </div>
        <Button size="sm" onClick={disparar}>
          Enviar mensagem
        </Button>
        <Button size="sm" variant="ghost" onClick={reiniciar}>
          Reiniciar dados
        </Button>
      </PopoverContent>
    </Popover>
  );
};
