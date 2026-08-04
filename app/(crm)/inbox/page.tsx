"use client";

import { useEffect, useState } from "react";
import { ListaConversas } from "@/components/inbox/lista-conversas";
import { Thread } from "@/components/inbox/thread";
import { useCrm } from "@/lib/store/crm-store";
import { conversasVisiveis, marcarComoLida } from "@/lib/data";
import type { Departamento } from "@/lib/tipos";

const InboxPage = () => {
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Departamento | "todos">("todos");

  const dados = useCrm((s) => s.dados);
  const papel = useCrm((s) => s.papel);
  const usuarioId = useCrm((s) => s.usuarioId);

  const visiveis = conversasVisiveis(dados, papel, usuarioId);
  const aindaVisivel = visiveis.some((conversa) => conversa.id === selecionada);
  const conversaAtiva = aindaVisivel
    ? selecionada
    : (visiveis.find((conversa) => conversa.id === "cv-4")?.id ?? visiveis[0]?.id ?? null);

  useEffect(() => {
    if (conversaAtiva) marcarComoLida(conversaAtiva);
  }, [conversaAtiva]);

  return (
    <div className="flex h-full overflow-hidden rounded-2xl border bg-background shadow-sm">
      <ListaConversas
        selecionada={selecionada}
        aoSelecionar={setSelecionada}
        filtro={filtro}
        aoFiltrar={setFiltro}
        className={selecionada ? "hidden md:flex" : "flex"}
      />
      <Thread
        conversaId={conversaAtiva}
        aoVoltar={() => setSelecionada(null)}
        className={selecionada ? "flex" : "hidden md:flex"}
      />
    </div>
  );
};

export default InboxPage;
