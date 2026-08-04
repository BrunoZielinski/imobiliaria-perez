"use client";

import { useRef, useState } from "react";
import { Bot, ListChecks, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { CelularCliente } from "@/components/simulacao/celular-cliente";
import { CentralAoVivo } from "@/components/simulacao/central-ao-vivo";
import { EventosCloud } from "@/components/simulacao/eventos-cloud";
import { Button } from "@/components/ui/button";
import { receberMensagem, enviarMensagem } from "@/lib/data";
import {
  eventosEntradaCloud,
  eventosEntradaInterativaCloud,
  eventosSaidaCloud,
  eventosSaidaInterativaCloud,
  type EventoCloud,
} from "@/lib/simulador/cloud-api";
import { ASSUNTOS_CLIENTE, OPCOES_INICIAIS } from "@/lib/simulador/fluxo-manual";
import {
  concluirDescricaoManual,
  criarSessaoManual,
  iniciarAtendimentoManual,
  selecionarAssuntoManual,
  selecionarOpcaoManual,
} from "@/lib/simulador/sessao-manual";
import { conversaAtivaDaSimulacao } from "@/lib/simulador/estado-demo";
import { useCrm } from "@/lib/store/crm-store";
import { cn } from "@/lib/utils";
import type { Departamento } from "@/lib/tipos";

const CONTATO_DEMO_ID = "ct-9";
const INICIO_DEMO = new Date("2026-07-30T10:00:00-03:00").getTime();
const CONTATO_DEMO = {
  id: CONTATO_DEMO_ID,
  nome: "Cliente da apresentação",
  telefone: "43 99999-0000",
  email: null,
  criadoEm: new Date(INICIO_DEMO).toISOString(),
};

const RESPOSTAS_POR_DEPARTAMENTO: Record<Departamento, string> = {
  comercial:
    "Olá! Recebi seu interesse em um imóvel. Vou entender o que você procura e apresentar as melhores opções.",
  administrativo:
    "Boa tarde! Aqui é a Zilda, do Financeiro da Perez. Recebi todo o contexto e vou verificar a situação da multa para você.",
  recepcao:
    "Olá! Aqui é a Bianca, da Recepção Perez. Recebi sua solicitação e vou orientar você por aqui.",
};

type ModoSimulacao = "ia" | "manual";

const SimulacaoPage = () => {
  const dados = useCrm((s) => s.dados);
  const aplicar = useCrm((s) => s.aplicar);
  const [modo, setModo] = useState<ModoSimulacao>("manual");
  const [iniciada, setIniciada] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [rascunho, setRascunho] = useState("");
  const [resposta, setResposta] = useState(
    RESPOSTAS_POR_DEPARTAMENTO.administrativo,
  );
  const [eventos, setEventos] = useState<EventoCloud[]>([]);
  const [sessaoManual, setSessaoManual] = useState(criarSessaoManual);
  const relogio = useRef(INICIO_DEMO);

  const conversa = conversaAtivaDaSimulacao(
    dados.conversas,
    CONTATO_DEMO_ID,
    iniciada,
  );
  const mensagens = dados.mensagens.filter(
    (mensagem) => mensagem.conversaId === conversa?.id,
  );
  const responsavel = dados.atendentes.find(
    (atendente) => atendente.id === conversa?.atendenteId,
  );

  const limparDadosDaSimulacao = () => {
    aplicar((estado) => {
      const conversasDemo = estado.conversas
        .filter((item) => item.contatoId === CONTATO_DEMO_ID)
        .map((item) => item.id);
      const idsDemo = new Set(conversasDemo);
      const contatoExiste = estado.contatos.some(
        (contato) => contato.id === CONTATO_DEMO_ID,
      );

      return {
        ...estado,
        contatos: contatoExiste
          ? estado.contatos
          : [...estado.contatos, CONTATO_DEMO],
        conversas: estado.conversas.filter((item) => !idsDemo.has(item.id)),
        mensagens: estado.mensagens.filter(
          (mensagem) => !idsDemo.has(mensagem.conversaId),
        ),
        eventos: estado.eventos.filter((evento) => !idsDemo.has(evento.conversaId)),
        ponteiro: { ...estado.ponteiro, administrativo: 0, recepcao: 0 },
      };
    });
  };

  const reiniciarEstadoLocal = () => {
    relogio.current = INICIO_DEMO;
    setEventos([]);
    setRascunho("");
    setSessaoManual(criarSessaoManual());
    setResposta(RESPOSTAS_POR_DEPARTAMENTO.administrativo);
  };

  const prepararSimulacao = () => {
    limparDadosDaSimulacao();
    reiniciarEstadoLocal();
    setIniciada(true);
  };

  const trocarModo = (novoModo: ModoSimulacao) => {
    if (novoModo === modo || enviando) return;
    limparDadosDaSimulacao();
    reiniciarEstadoLocal();
    setModo(novoModo);
    setIniciada(false);
  };

  const enviarComAna = async (texto: string) => {
    const agora = new Date(relogio.current);
    const idsAntes = new Set(
      useCrm.getState().dados.mensagens.map((mensagem) => mensagem.id),
    );
    setEventos((atuais) => [
      ...atuais,
      ...eventosEntradaCloud(texto, agora.toISOString()),
    ]);

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
        em: new Date(agora.getTime() + 2000 + indice * 5000).toISOString(),
        wamid: `wamid.demo.${mensagem.id}`,
      }),
    );

    setEventos((atuais) => [...atuais, ...eventosResposta]);
  };

  const enviarManual = async (texto: string) => {
    const agora = new Date(relogio.current);

    if (sessaoManual.etapa === "saudacao") {
      const proxima = iniciarAtendimentoManual(
        sessaoManual,
        texto,
        agora.toISOString(),
      );
      setSessaoManual(proxima);
      setEventos((atuais) => [
        ...atuais,
        ...eventosEntradaCloud(texto, agora.toISOString()),
        ...eventosSaidaInterativaCloud({
          tipo: "button",
          titulo: "Como podemos ajudar hoje?",
          em: new Date(agora.getTime() + 2000).toISOString(),
          wamid: "wamid.manual.menu-inicial",
        }),
      ]);
      return;
    }

    if (sessaoManual.etapa !== "descricao") return;

    const resultado = concluirDescricaoManual(
      sessaoManual,
      texto,
      agora.toISOString(),
    );
    if (!resultado) return;

    setSessaoManual(resultado.sessao);
    setResposta(RESPOSTAS_POR_DEPARTAMENTO[resultado.departamento]);
    setEventos((atuais) => [
      ...atuais,
      ...eventosEntradaCloud(texto, agora.toISOString()),
    ]);

    await receberMensagem({
      contatoId: CONTATO_DEMO_ID,
      canal: "whatsapp",
      texto: resultado.contexto,
      agora,
      departamentoDireto: resultado.departamento,
      modoTriagem: "manual",
    });

    const confirmacao = resultado.sessao.registros.at(-1)?.texto ?? "";
    setEventos((atuais) => [
      ...atuais,
      ...eventosSaidaCloud({
        texto: confirmacao,
        autor: "sistema",
        em: new Date(agora.getTime() + 2000).toISOString(),
        wamid: "wamid.manual.confirmacao",
      }),
    ]);
  };

  const enviarComoCliente = async () => {
    const texto = rascunho.trim();
    if (!iniciada || !texto || enviando) return;

    setEnviando(true);
    try {
      if (modo === "manual") {
        await enviarManual(texto);
      } else {
        await enviarComAna(texto);
      }
      setRascunho("");
      relogio.current += 60_000;
    } finally {
      setEnviando(false);
    }
  };

  const selecionarOpcaoInicial = (id: string) => {
    if (!iniciada || enviando || sessaoManual.etapa !== "opcao_inicial") return;

    const agora = new Date(relogio.current);
    const opcao = OPCOES_INICIAIS.find((item) => item.id === id);
    const proxima = selecionarOpcaoManual(sessaoManual, id, agora.toISOString());
    if (!opcao || !proxima) return;

    const respostaSistema = proxima.registros.at(-1)?.texto ?? "";
    const eventoSaida =
      proxima.etapa === "assuntos"
        ? eventosSaidaInterativaCloud({
            tipo: "list",
            titulo: respostaSistema,
            em: new Date(agora.getTime() + 2000).toISOString(),
            wamid: "wamid.manual.lista-assuntos",
          })
        : eventosSaidaCloud({
            texto: respostaSistema,
            autor: "sistema",
            em: new Date(agora.getTime() + 2000).toISOString(),
            wamid: `wamid.manual.descricao.${id}`,
          });

    setSessaoManual(proxima);
    setEventos((atuais) => [
      ...atuais,
      ...eventosEntradaInterativaCloud({
        tipo: "button_reply",
        id,
        titulo: opcao.titulo,
        em: agora.toISOString(),
      }),
      ...eventoSaida,
    ]);
    relogio.current += 60_000;
  };

  const selecionarAssunto = (id: string) => {
    if (!iniciada || enviando || sessaoManual.etapa !== "assuntos") return;

    const agora = new Date(relogio.current);
    const assunto = ASSUNTOS_CLIENTE.find((item) => item.id === id);
    const proxima = selecionarAssuntoManual(sessaoManual, id, agora.toISOString());
    if (!assunto || !proxima) return;

    setSessaoManual(proxima);
    setEventos((atuais) => [
      ...atuais,
      ...eventosEntradaInterativaCloud({
        tipo: "list_reply",
        id,
        titulo: assunto.titulo,
        em: agora.toISOString(),
      }),
      ...eventosSaidaCloud({
        texto: proxima.registros.at(-1)?.texto ?? "",
        autor: "sistema",
        em: new Date(agora.getTime() + 2000).toISOString(),
        wamid: `wamid.manual.contexto.${id}`,
      }),
    ]);
    relogio.current += 60_000;
  };

  const responderComoAtendente = async () => {
    const texto = resposta.trim();
    if (!conversa || !responsavel || !texto || enviando) return;

    setEnviando(true);
    try {
      const agora = new Date(relogio.current);
      const idsAntes = new Set(
        useCrm.getState().dados.mensagens.map((mensagem) => mensagem.id),
      );
      await enviarMensagem(conversa.id, texto, agora);
      const enviada = useCrm
        .getState()
        .dados.mensagens.find(
          (mensagem) =>
            !idsAntes.has(mensagem.id) && mensagem.autor === "atendente",
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
      <header className="flex shrink-0 flex-col gap-4 border-b bg-background px-3 py-3.5 sm:px-5 xl:flex-row xl:items-center xl:justify-between xl:gap-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
              Modo apresentação
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Nenhuma mensagem real será enviada
            </span>
          </div>
          <h1 className="mt-1.5 text-xl font-bold tracking-tight">
            Simulação ao vivo do cliente
          </h1>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {modo === "manual"
              ? "Fluxo determinístico com botões e lista permitidos pela Meta, sem IA."
              : "Texto livre classificado pela Ana e distribuído para a Central Perez."}
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
          <div
            role="group"
            aria-label="Modo da simulação"
            className="flex min-w-0 overflow-x-auto rounded-xl border bg-muted/45 p-1"
          >
            <button
              type="button"
              aria-pressed={modo === "ia"}
              onClick={() => trocarModo("ia")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-semibold transition",
                modo === "ia"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Bot className="size-3.5" />
              Com Ana (IA)
            </button>
            <button
              type="button"
              aria-pressed={modo === "manual"}
              onClick={() => trocarModo("manual")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-semibold transition",
                modo === "manual"
                  ? "bg-background text-sky-700 shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <ListChecks className="size-3.5" />
              Manual Meta
            </button>
          </div>

          <Button type="button" onClick={prepararSimulacao}>
            {iniciada ? (
              <RotateCcw className="size-4" />
            ) : (
              <Play className="size-4 fill-current" />
            )}
            {iniciada ? "Reiniciar" : "Iniciar simulação"}
          </Button>
        </div>
      </header>

      <div className="scrollbar-hide flex shrink-0 items-center gap-2 overflow-x-auto border-b bg-background/70 px-3 py-2 sm:px-5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Escopo demonstrado
        </span>
        {["WhatsApp oficial", "Triagem", "Distribuição", "Atendimento humano"].map(
          (item) => (
            <span
              key={item}
              className="rounded-full border bg-background px-2 py-0.5 text-[9px] font-medium text-foreground/70"
            >
              {item}
            </span>
          ),
        )}
        <span className="ml-auto text-[9px] text-muted-foreground">
          Protótipo visual · escopo controlado
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-4 lg:overflow-x-auto lg:overflow-y-hidden">
        <div className="grid gap-4 [&>section]:min-h-[34rem] lg:h-full lg:min-w-[1050px] lg:grid-cols-[minmax(320px,0.9fr)_minmax(250px,0.65fr)_minmax(380px,1.15fr)] lg:[&>section]:min-h-0">
          <CelularCliente
            mensagens={mensagens}
            rascunho={rascunho}
            iniciada={iniciada}
            enviando={enviando}
            modo={modo}
            sessaoManual={sessaoManual}
            aoAlterarRascunho={setRascunho}
            aoEnviar={enviarComoCliente}
            aoSelecionarOpcaoInicial={selecionarOpcaoInicial}
            aoSelecionarAssunto={selecionarAssunto}
          />
          <EventosCloud eventos={eventos} />
          <CentralAoVivo
            conversa={conversa}
            responsavel={responsavel}
            mensagens={mensagens}
            resposta={resposta}
            enviando={enviando}
            modo={modo}
            iniciada={iniciada}
            sessaoManual={sessaoManual}
            aoAlterarResposta={setResposta}
            aoResponder={responderComoAtendente}
          />
        </div>
      </div>
    </div>
  );
};

export default SimulacaoPage;
