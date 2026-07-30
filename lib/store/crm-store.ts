"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EstadoCrm } from "@/lib/mock/seed";
import { criarSeed } from "@/lib/mock/seed";
import type { Papel } from "@/lib/tipos";

type AcoesCrm = {
  aplicar: (mutacao: (estado: EstadoCrm) => EstadoCrm) => void;
  definirPapel: (papel: Papel) => void;
  definirUsuario: (atendenteId: string) => void;
  reiniciar: () => void;
};

type EstadoSessao = {
  dados: EstadoCrm;
  papel: Papel;
  usuarioId: string;
};

const estadoInicial = (): EstadoSessao => ({
  dados: criarSeed(new Date()),
  papel: "administrador",
  usuarioId: "at-1",
});

export const useCrm = create<EstadoSessao & AcoesCrm>()(
  persist(
    (set) => ({
      ...estadoInicial(),
      aplicar: (mutacao) => set((sessao) => ({ dados: mutacao(sessao.dados) })),
      definirPapel: (papel) => set({ papel }),
      definirUsuario: (usuarioId) => set({ usuarioId }),
      reiniciar: () => set(estadoInicial()),
    }),
    { name: "crm-perez" }
  )
);
