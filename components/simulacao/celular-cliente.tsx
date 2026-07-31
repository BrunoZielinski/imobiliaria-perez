"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  MoreVertical,
  Paperclip,
  Send,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mensagem } from "@/lib/tipos";
import { ASSUNTOS_CLIENTE, OPCOES_INICIAIS } from "@/lib/simulador/fluxo-manual";
import type { SessaoManual } from "@/lib/simulador/sessao-manual";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const SUGESTOES_IA = [
  "Olá",
  "Tivemos um imprevisto de saúde na família e não conseguimos pagar o aluguel no vencimento. Gostaria de solicitar a revisão da multa, se possível.",
];

type ModoSimulacao = "ia" | "manual";

type Props = {
  mensagens: Mensagem[];
  rascunho: string;
  iniciada: boolean;
  enviando: boolean;
  modo: ModoSimulacao;
  sessaoManual: SessaoManual;
  aoAlterarRascunho: (texto: string) => void;
  aoEnviar: () => void;
  aoSelecionarOpcaoInicial: (id: string) => void;
  aoSelecionarAssunto: (id: string) => void;
};

export const CelularCliente = ({
  mensagens,
  rascunho,
  iniciada,
  enviando,
  modo,
  sessaoManual,
  aoAlterarRascunho,
  aoEnviar,
  aoSelecionarOpcaoInicial,
  aoSelecionarAssunto,
}: Props) => {
  const [listaAberta, setListaAberta] = useState(false);
  const triagemPorEscolha =
    modo === "manual" &&
    (sessaoManual.etapa === "opcao_inicial" || sessaoManual.etapa === "assuntos");
  const atendimentoManualEncaminhado =
    modo === "manual" && sessaoManual.etapa === "encaminhado";
  const campoDesabilitado =
    !iniciada || enviando || triagemPorEscolha || atendimentoManualEncaminhado;
  const mensagensHumanas =
    modo === "manual"
      ? mensagens.filter((mensagem) => mensagem.autor === "atendente")
      : mensagens;

  return (
    <section className="flex min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
            Visão do cliente
          </p>
          <h2 className="text-lg font-bold">WhatsApp no celular</h2>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
          {modo === "manual" ? "Interativo oficial" : "Cliente real-time"}
        </span>
      </div>

      <div className="relative mx-auto flex min-h-0 w-full max-w-[390px] flex-1 flex-col overflow-hidden rounded-[2.25rem] border-[7px] border-[#202124] bg-[#111] shadow-2xl shadow-black/20">
        <div className="relative flex h-7 shrink-0 items-center justify-between bg-[#f6f6f6] px-5 text-[9px] font-bold text-[#111]">
          <span>10:00</span>
          <span className="absolute left-1/2 top-1 h-4 w-24 -translate-x-1/2 rounded-full bg-[#111]" />
          <span>5G · 100%</span>
        </div>

        <header className="flex h-16 shrink-0 items-center gap-2 bg-[#075e54] px-3 text-white">
          <ChevronLeft className="size-5" />
          <span className="flex size-9 items-center justify-center rounded-full bg-white text-sm font-black text-primary">
            P
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">Imobiliária Perez</p>
            <p className="text-[9px] text-white/75">conta comercial</p>
          </div>
          <Video className="size-4" />
          <MoreVertical className="size-4" />
        </header>

        <div
          className="min-h-0 flex-1 bg-[#efeae2]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(17, 94, 89, 0.035) 0 1.5px, transparent 1.5px), radial-gradient(circle at 80% 55%, rgba(17, 94, 89, 0.03) 0 1px, transparent 1px)",
            backgroundSize: "34px 34px, 28px 28px",
          }}
        >
          <ScrollArea className="h-full">
            <div className="flex min-h-full flex-col justify-end gap-2 px-3 py-4">
              {!iniciada && (
                <div className="m-auto max-w-60 rounded-xl bg-[#fff5c4] px-3 py-2 text-center text-[10px] leading-relaxed text-[#5f5b45] shadow-sm">
                  Escolha um modo e clique em “Iniciar simulação”.
                </div>
              )}

              {iniciada && (
                <div className="mx-auto mb-1 rounded-lg bg-[#fff5c4] px-3 py-1.5 text-center text-[9px] leading-relaxed text-[#5f5b45] shadow-sm">
                  Demonstração segura · nenhuma mensagem real será enviada.
                </div>
              )}

              {modo === "manual" &&
                sessaoManual.registros.map((registro) => {
                  const doCliente = registro.autor === "cliente";
                  const botoesAtivos =
                    registro.formato === "botoes" &&
                    sessaoManual.etapa === "opcao_inicial";
                  const listaAtiva =
                    registro.formato === "lista" && sessaoManual.etapa === "assuntos";

                  return (
                    <div
                      key={registro.id}
                      className={cn("flex", doCliente ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "relative max-w-[88%] overflow-hidden rounded-lg text-[11px] leading-relaxed shadow-sm",
                          doCliente
                            ? "rounded-tr-sm bg-[#d9fdd3] px-2.5 pb-1.5 pt-2"
                            : "rounded-tl-sm bg-white",
                        )}
                      >
                        <div className={cn(!doCliente && "px-2.5 pb-1.5 pt-2")}>
                          {!doCliente && (
                            <p className="mb-0.5 text-[9px] font-bold text-[#008069]">
                              Perez · Atendimento
                            </p>
                          )}
                          <span className="whitespace-pre-wrap">{registro.texto}</span>
                          <span className="ml-2 inline-flex translate-y-0.5 items-center gap-0.5 text-[8px] text-[#667781]">
                            {format(new Date(registro.em), "HH:mm")}
                            {doCliente && <CheckCheck className="size-3 text-[#53bdeb]" />}
                          </span>
                        </div>

                        {registro.formato === "botoes" && (
                          <div className="border-t border-[#e9edef]">
                            {OPCOES_INICIAIS.map((opcao) => (
                              <button
                                key={opcao.id}
                                type="button"
                                disabled={!botoesAtivos || enviando}
                                onClick={() => aoSelecionarOpcaoInicial(opcao.id)}
                                className="block w-full border-b border-[#e9edef] px-4 py-2 text-center text-[10px] font-medium text-[#00a884] last:border-0 disabled:text-[#8696a0]"
                              >
                                {opcao.titulo}
                              </button>
                            ))}
                          </div>
                        )}

                        {registro.formato === "lista" && (
                          <button
                            type="button"
                            disabled={!listaAtiva || enviando}
                            onClick={() => setListaAberta(true)}
                            className="flex w-full items-center justify-center gap-1.5 border-t border-[#e9edef] px-4 py-2 text-[10px] font-semibold text-[#00a884] disabled:text-[#8696a0]"
                          >
                            Escolher assunto
                            <ChevronDown className="size-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

              {mensagensHumanas.map((mensagem) => {
                const doCliente = mensagem.autor === "contato";
                return (
                  <div
                    key={mensagem.id}
                    className={cn("flex", doCliente ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "relative max-w-[86%] rounded-lg px-2.5 pb-1.5 pt-2 text-[11px] leading-relaxed shadow-sm",
                        doCliente
                          ? "rounded-tr-sm bg-[#d9fdd3] pr-2"
                          : "rounded-tl-sm bg-white",
                      )}
                    >
                      {mensagem.autor === "ana" && (
                        <p className="mb-0.5 text-[9px] font-bold text-primary">
                          Ana · Assistente
                        </p>
                      )}
                      <span className="whitespace-pre-wrap">{mensagem.texto}</span>
                      <span className="ml-2 inline-flex translate-y-0.5 items-center gap-0.5 text-[8px] text-[#667781]">
                        {format(new Date(mensagem.em), "HH:mm")}
                        {doCliente && <CheckCheck className="size-3 text-[#53bdeb]" />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="shrink-0 bg-[#f0f2f5] px-2 pb-3 pt-2">
          {iniciada &&
            modo === "ia" &&
            mensagens.length < 3 && (
              <div className="mb-2 flex gap-1.5 overflow-x-auto">
                {SUGESTOES_IA.map((sugestao) => (
                  <button
                    key={sugestao}
                    type="button"
                    onClick={() => aoAlterarRascunho(sugestao)}
                    className="max-w-44 shrink-0 truncate rounded-full border border-[#cbd6d2] bg-white px-2.5 py-1 text-[9px] text-[#075e54]"
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            )}
          {iniciada && modo === "manual" && sessaoManual.etapa === "saudacao" && (
            <button
              type="button"
              onClick={() => aoAlterarRascunho("Olá")}
              className="mb-2 rounded-full border border-[#cbd6d2] bg-white px-2.5 py-1 text-[9px] text-[#075e54]"
            >
              Olá
            </button>
          )}
          <div className="flex items-end gap-1.5">
            <div className="flex min-h-10 flex-1 items-end rounded-2xl bg-white px-2">
              <Paperclip className="mb-3 size-3.5 shrink-0 rotate-[-35deg] text-[#667781]" />
              <Textarea
                value={rascunho}
                disabled={campoDesabilitado}
                onChange={(evento) => aoAlterarRascunho(evento.target.value)}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" && !evento.shiftKey) {
                    evento.preventDefault();
                    aoEnviar();
                  }
                }}
                placeholder={
                  triagemPorEscolha
                    ? "Escolha uma opção acima"
                    : atendimentoManualEncaminhado
                      ? "Atendimento encaminhado"
                      : "Mensagem"
                }
                className="max-h-24 min-h-10 resize-none border-0 bg-transparent px-2 py-2.5 text-[11px] shadow-none focus-visible:ring-0"
              />
            </div>
            <Button
              type="button"
              disabled={campoDesabilitado || !rascunho.trim()}
              onClick={aoEnviar}
              aria-label="Enviar como cliente"
              className="size-10 rounded-full bg-[#00a884] p-0 hover:bg-[#008f70]"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>

        {listaAberta && (
          <div className="absolute inset-0 z-20 flex items-end bg-black/35">
            <div className="w-full rounded-t-2xl bg-white pb-4 shadow-2xl">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-[#008069]">
                    Imobiliária Perez
                  </p>
                  <p className="text-sm font-bold text-[#111b21]">Escolha o assunto</p>
                </div>
                <button
                  type="button"
                  onClick={() => setListaAberta(false)}
                  aria-label="Fechar lista"
                  className="rounded-full p-1.5 text-[#54656f] hover:bg-slate-100"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {ASSUNTOS_CLIENTE.map((assunto) => (
                  <button
                    key={assunto.id}
                    type="button"
                    onClick={() => {
                      setListaAberta(false);
                      aoSelecionarAssunto(assunto.id);
                    }}
                    className="block w-full border-b border-[#f0f2f5] px-4 py-2.5 text-left last:border-0 hover:bg-[#f7f8fa]"
                  >
                    <span className="block text-[11px] font-semibold text-[#111b21]">
                      {assunto.titulo}
                    </span>
                    <span className="mt-0.5 block text-[9px] text-[#667781]">
                      {assunto.descricao}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
