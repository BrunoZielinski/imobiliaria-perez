"use client";

import { useRef, useState } from "react";
import { Play, RotateCcw, ShieldCheck } from "lucide-react";
import { CelularCliente } from "@/components/simulacao/celular-cliente";
import { CentralAoVivo } from "@/components/simulacao/central-ao-vivo";
import { EventosCloud } from "@/components/simulacao/eventos-cloud";
import { Button } from "@/components/ui/button";
import { receberMensagem, enviarMensagem } from "@/lib/data";
import {
  eventosEntradaCloud,
  eventosSaidaCloud,
  type EventoCloud,
} from "@/lib/simulador/cloud-api";
import { useCrm } from "@/lib/store/crm-store";

const CONTATO_DEMO_ID = "ct-9";
const INICIO_DEMO = new Date("2026-07-30T10:00:00-03:00").getTime();
const CONTATO_DEMO = {
  id: CONTATO_DEMO_ID,
  nome: "Cliente da apresentação",
  telefone: "43 99999-0000",
  email: null,
  criadoEm: new Date(INICIO_DEMO).toISOString(),
};

const SimulacaoPage = () => {
  const dados = useCrm((s) => s.dados);
  const aplicar = useCrm((s) => s.aplicar);
  const [iniciada, setIniciada] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [rascunho, setRascunho] = useState("");
  const [resposta, setResposta] = useState(
    "Boa tarde! Aqui é a Zilda, do Financeiro da Perez. Recebi todo o contexto e vou verificar a situação da multa para você.",
  );
  const [eventos, setEventos] = useState<EventoCloud[]>([]);
  const relogio = useRef(INICIO_DEMO);

  const conversa = dados.conversas.find(
    (item) => item.contatoId === CONTATO_DEMO_ID && item.status !== "encerrada",
  );
  const mensagens = dados.mensagens.filter((mensagem) => mensagem.conversaId === conversa?.id);
  const responsavel = dados.atendentes.find(
    (atendente) => atendente.id === conversa?.atendenteId,
  );

  const prepararSimulacao = () => {
    aplicar((estado) => {
      const conversasDemo = estado.conversas
        .filter((item) => item.contatoId === CONTATO_DEMO_ID)
        .map((item) => item.id);
      const idsDemo = new Set(conversasDemo);
      const contatoExiste = estado.contatos.some((contato) => contato.id === CONTATO_DEMO_ID);

      return {
        ...estado,
        contatos: contatoExiste ? estado.contatos : [...estado.contatos, CONTATO_DEMO],
        conversas: estado.conversas.filter((item) => !idsDemo.has(item.id)),
        mensagens: estado.mensagens.filter((mensagem) => !idsDemo.has(mensagem.conversaId)),
        eventos: estado.eventos.filter((evento) => !idsDemo.has(evento.conversaId)),
        ponteiro: { ...estado.ponteiro, administrativo: 0 },
      };
    });
    relogio.current = INICIO_DEMO;
    setEventos([]);
    setRascunho("");
    setResposta(
      "Boa tarde! Aqui é a Zilda, do Financeiro da Perez. Recebi todo o contexto e vou verificar a situação da multa para você.",
    );
    setIniciada(true);
  };

  const enviarComoCliente = async () => {
    const texto = rascunho.trim();
    if (!iniciada || !texto || enviando) return;

    setEnviando(true);
    try {
      const agora = new Date(relogio.current);
      const idsAntes = new Set(useCrm.getState().dados.mensagens.map((mensagem) => mensagem.id));
      setEventos((atuais) => [...atuais, ...eventosEntradaCloud(texto, agora.toISOString())]);

      await receberMensagem({
        contatoId: CONTATO_DEMO_ID,
        canal: "whatsapp",
        texto,
        agora,
      });

      const novasRespostas = useCrm
        .getState()
        .dados.mensagens.filter(
          (mensagem) => !idsAntes.has(mensagem.id) && mensagem.autor !== "contato",
        );
      const eventosResposta = novasRespostas.flatMap((mensagem, indice) =>
        eventosSaidaCloud({
          texto: mensagem.texto,
          autor: mensagem.autor === "atendente" ? "atendente" : "ana",
          em: new Date(relogio.current + 2000 + indice * 5000).toISOString(),
          wamid: `wamid.demo.${mensagem.id}`,
        }),
      );

      setEventos((atuais) => [...atuais, ...eventosResposta]);
      setRascunho("");
      relogio.current += 60_000;
    } finally {
      setEnviando(false);
    }
  };

  const responderComoAtendente = async () => {
    const texto = resposta.trim();
    if (!conversa || !responsavel || !texto || enviando) return;

    setEnviando(true);
    try {
      const agora = new Date(relogio.current);
      const idsAntes = new Set(useCrm.getState().dados.mensagens.map((mensagem) => mensagem.id));
      await enviarMensagem(conversa.id, texto, agora);
      const enviada = useCrm
        .getState()
        .dados.mensagens.find(
          (mensagem) => !idsAntes.has(mensagem.id) && mensagem.autor === "atendente",
        );

      if (enviada) {
        setEventos((atuais) => [
          ...atuais,
          ...eventosSaidaCloud({
            texto: enviada.texto,
            autor: "atendente",
            em: agora.toISOString(),
            wamid: `wamid.demo.${enviada.id}`,
          }),
        ]);
      }
      setResposta("");
      relogio.current += 60_000;
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border bg-[#f5f6f7] shadow-sm">
      <header className="flex shrink-0 items-center justify-between border-b bg-background px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
              Modo apresentação
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Nenhuma mensagem real será enviada
            </span>
          </div>
          <h1 className="mt-2 text-xl font-bold tracking-tight">Simulação ao vivo do cliente</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Digite no celular e acompanhe a mensagem atravessar a Cloud API até a Central Perez.
          </p>
        </div>
        <Button type="button" onClick={prepararSimulacao}>
          {iniciada ? <RotateCcw className="size-4" /> : <Play className="size-4 fill-current" />}
          {iniciada ? "Reiniciar simulação" : "Iniciar simulação"}
        </Button>
      </header>

      <div className="min-h-0 flex-1 overflow-x-auto p-4">
        <div className="grid h-full min-w-[1050px] grid-cols-[minmax(320px,0.9fr)_minmax(250px,0.65fr)_minmax(380px,1.15fr)] gap-4">
          <CelularCliente
            mensagens={mensagens}
            rascunho={rascunho}
            iniciada={iniciada}
            enviando={enviando}
            aoAlterarRascunho={setRascunho}
            aoEnviar={enviarComoCliente}
          />
          <EventosCloud eventos={eventos} />
          <CentralAoVivo
            conversa={conversa}
            responsavel={responsavel}
            mensagens={mensagens}
            resposta={resposta}
            enviando={enviando}
            aoAlterarResposta={setResposta}
            aoResponder={responderComoAtendente}
          />
        </div>
      </div>
    </div>
  );
};

export default SimulacaoPage;
