"use client";

import { useCrm } from "@/lib/store/crm-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Papel } from "@/lib/tipos";

const ROTULOS: Record<Papel, string> = {
  atendente: "Atendente",
  supervisor: "Supervisor",
  administrador: "Administrador",
};

export const SeletorPapel = () => {
  const papel = useCrm((s) => s.papel);
  const usuarioId = useCrm((s) => s.usuarioId);
  const atendentes = useCrm((s) => s.dados.atendentes);
  const definirPapel = useCrm((s) => s.definirPapel);
  const definirUsuario = useCrm((s) => s.definirUsuario);

  const itensAtendentes = Object.fromEntries(atendentes.map((a) => [a.id, a.nome]));

  return (
    <div className="flex items-center gap-2">
      <Select
        items={itensAtendentes}
        value={usuarioId}
        onValueChange={(valor) => definirUsuario(valor as string)}
      >
        <SelectTrigger className="w-52" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {atendentes.map((atendente) => (
            <SelectItem key={atendente.id} value={atendente.id}>
              {atendente.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select items={ROTULOS} value={papel} onValueChange={(v) => definirPapel(v as Papel)}>
        <SelectTrigger className="w-40" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(ROTULOS) as Papel[]).map((valor) => (
            <SelectItem key={valor} value={valor}>
              {ROTULOS[valor]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
