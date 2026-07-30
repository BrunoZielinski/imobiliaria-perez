"use client";

import { useEffect, useState } from "react";
import { ListaConversas } from "@/components/inbox/lista-conversas";
import { Thread } from "@/components/inbox/thread";
import { FichaLead } from "@/components/inbox/ficha-lead";
import { useCrm } from "@/lib/store/crm-store";
import { conversasVisiveis, marcarComoLida } from "@/lib/data";
import type { Departamento } from "@/lib/tipos";

const InboxPage = () => {
  const [selecionada, setSelecionada] = useState<string | null>("cv-1");
  const [filtro, setFiltro] = useState<Departamento | "todos">("todos");

  const dados = useCrm((s) => s.dados);
  const papel = useCrm((s) => s.papel);
  const usuarioId = useCrm((s) => s.usuarioId);

  const visiveis = conversasVisiveis(dados, papel, usuarioId);
  const aindaVisivel = visiveis.some((conversa) => conversa.id === selecionada);

  useEffect(() => {
    if (!aindaVisivel) setSelecionada(visiveis[0]?.id ?? null);
  }, [aindaVisivel, visiveis]);

  useEffect(() => {
    if (selecionada) marcarComoLida(selecionada);
  }, [selecionada]);

  return (
    <div className="flex h-full">
      <ListaConversas
        selecionada={selecionada}
        aoSelecionar={setSelecionada}
        filtro={filtro}
        aoFiltrar={setFiltro}
      />
      <Thread conversaId={aindaVisivel ? selecionada : null} />
      <FichaLead conversaId={aindaVisivel ? selecionada : null} />
    </div>
  );
};

export default InboxPage;
