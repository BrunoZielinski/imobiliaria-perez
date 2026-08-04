"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EstadoCrm } from "@/lib/mock/seed";
import { criarSeed } from "@/lib/mock/seed";
import type { Papel } from "@/lib/tipos";
import {
  migrarSessaoPersistida,
  type SessaoPersistida,
} from "@/lib/store/migracao";

type AcoesCrm = {
  aplicar: (mutacao: (estado: EstadoCrm) => EstadoCrm) => void;
  definirPapel: (papel: Papel) => void;
  definirUsuario: (atendenteId: string) => void;
  reiniciar: () => void;
};

const estadoInicial = (): SessaoPersistida => ({
  dados: criarSeed(new Date()),
  papel: "administrador",
  usuarioId: "at-1",
});

export const useCrm = create<SessaoPersistida & AcoesCrm>()(
  persist(
    (set) => ({
      ...estadoInicial(),
      aplicar: (mutacao) => set((sessao) => ({ dados: mutacao(sessao.dados) })),
      definirPapel: (papel) => set({ papel }),
      definirUsuario: (usuarioId) => set({ usuarioId }),
      reiniciar: () => set(estadoInicial()),
    }),
    {
      name: "crm-perez",
      version: 3,
      migrate: (persistido, versao) =>
        migrarSessaoPersistida(persistido, versao),
    }
  )
);
