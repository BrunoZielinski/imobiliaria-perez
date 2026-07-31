"use client";

import { useCrm } from "@/lib/store/crm-store";
import type { EstadoCrm } from "@/lib/mock/seed";
import { proximoAtendente } from "@/lib/distribuicao/roleta";
import { classificar } from "@/lib/ana/classificar";
import {
  MENU_INVALIDO,
  SAUDACAO_ANA,
  mensagemEncaminhando,
  mensagemForaDoExpediente,
  mensagemPosicaoNaFila,
} from "@/lib/ana/script";
import { dentroDoExpediente } from "@/lib/expediente/expediente";
import type { Canal, Departamento, Mensagem, ModoTriagem, Papel, PipelineId } from "@/lib/tipos";

let sequencia = 0;
const novoId = (prefixo: string) => `${prefixo}-${Date.now().toString(36)}-${sequencia++}`;

const aplicar = (mutacao: (estado: EstadoCrm) => EstadoCrm) => useCrm.getState().aplicar(mutacao);

export const cargaPorAtendente = (estado: EstadoCrm): Record<string, number> =>
  estado.conversas
    .filter((conversa) => conversa.status === "atendimento" && conversa.atendenteId)
    .reduce<Record<string, number>>((acc, conversa) => {
      acc[conversa.atendenteId!] = (acc[conversa.atendenteId!] ?? 0) + 1;
      return acc;
    }, {});

export const posicaoNaFila = (estado: EstadoCrm, conversaId: string): number => {
  const conversa = estado.conversas.find((c) => c.id === conversaId);
  if (!conversa || conversa.status !== "fila") return 0;
  const fila = estado.conversas
    .filter((c) => c.status === "fila" && c.departamento === conversa.departamento)
    .sort((a, b) => (a.entrouNaFilaEm ?? "").localeCompare(b.entrouNaFilaEm ?? ""));
  return fila.findIndex((c) => c.id === conversaId) + 1;
};

export const conversasVisiveis = (estado: EstadoCrm, papel: Papel, usuarioId: string) => {
  if (papel === "administrador") return estado.conversas;

  const usuario = estado.atendentes.find((a) => a.id === usuarioId);
  if (!usuario) return [];

  const doEscopo = estado.conversas.filter(
    (conversa) =>
      conversa.departamento === null || usuario.departamentos.includes(conversa.departamento)
  );

  if (papel === "supervisor") return doEscopo;
  return doEscopo.filter((c) => c.atendenteId === usuarioId || c.status !== "atendimento");
};

const anexar = (
  estado: EstadoCrm,
  conversaId: string,
  autor: Mensagem["autor"],
  texto: string,
  em: string
): EstadoCrm => ({
  ...estado,
  mensagens: [...estado.mensagens, { id: novoId("ms"), conversaId, autor, texto, em }],
});

const tentarAtribuir = (estado: EstadoCrm, conversaId: string, agora: Date): EstadoCrm => {
  const conversa = estado.conversas.find((c) => c.id === conversaId);
  if (!conversa?.departamento || conversa.status !== "fila") return estado;

  const { atendente, proximoPonteiro } = proximoAtendente({
    departamento: conversa.departamento,
    atendentes: estado.atendentes,
    carga: cargaPorAtendente(estado),
    ponteiro: estado.ponteiro[conversa.departamento],
    agora,
  });

  if (!atendente) {
    const aviso = dentroDoExpediente(agora)
      ? mensagemPosicaoNaFila(posicaoNaFila(estado, conversaId))
      : mensagemForaDoExpediente(agora);
    return anexar(estado, conversaId, "ana", aviso, agora.toISOString());
  }

  return {
    ...estado,
    conversas: estado.conversas.map((c) =>
      c.id === conversaId ? { ...c, status: "atendimento" as const, atendenteId: atendente.id } : c
    ),
    leads: estado.leads.map((lead) =>
      lead.conversaId === conversaId && !lead.responsavelId
        ? { ...lead, responsavelId: atendente.id }
        : lead
    ),
    ponteiro: { ...estado.ponteiro, [conversa.departamento]: proximoPonteiro },
    eventos: [
      ...estado.eventos,
      {
        id: novoId("ev"),
        conversaId,
        atendenteId: atendente.id,
        motivo: "roleta" as const,
        em: agora.toISOString(),
      },
    ],
  };
};

const drenarFilaSync = (estado: EstadoCrm, agora: Date): EstadoCrm => {
  const aguardando = estado.conversas
    .filter((c) => c.status === "fila")
    .sort((a, b) => (a.entrouNaFilaEm ?? "").localeCompare(b.entrouNaFilaEm ?? ""));
  return aguardando.reduce((acc, conversa) => tentarAtribuir(acc, conversa.id, agora), estado);
};

export const receberMensagem = async (params: {
  contatoId: string;
  canal: Canal;
  texto: string;
  agora: Date;
  departamentoDireto?: Departamento;
  modoTriagem?: ModoTriagem;
}) => {
  const { contatoId, canal, texto, agora, departamentoDireto, modoTriagem } = params;
  aplicar((estado) => {
    const existente = estado.conversas.find(
      (c) => c.contatoId === contatoId && c.canal === canal && c.status !== "encerrada"
    );

    if (existente) {
      const comMensagem = anexar(estado, existente.id, "contato", texto, agora.toISOString());
      if (existente.status !== "ana") {
        return {
          ...comMensagem,
          conversas: comMensagem.conversas.map((c) =>
            c.id === existente.id ? { ...c, naoLidas: c.naoLidas + 1 } : c
          ),
        };
      }

      const { departamento, contexto } = classificar(texto);
      if (!departamento) {
        return anexar(comMensagem, existente.id, "ana", MENU_INVALIDO, agora.toISOString());
      }

      const encaminhada: EstadoCrm = {
        ...anexar(
          comMensagem,
          existente.id,
          "ana",
          mensagemEncaminhando(departamento),
          agora.toISOString()
        ),
        conversas: comMensagem.conversas.map((c) =>
          c.id === existente.id
            ? {
                ...c,
                departamento,
                status: "fila" as const,
                entrouNaFilaEm: agora.toISOString(),
                contextoAna: contexto,
                naoLidas: c.naoLidas + 1,
              }
            : c
        ),
      };
      return tentarAtribuir(encaminhada, existente.id, agora);
    }

    const conversaId = novoId("cv");
    const viaAna = canal === "whatsapp" && !departamentoDireto && modoTriagem !== "manual";
    const modoDaConversa: ModoTriagem = viaAna ? "ana" : modoTriagem ?? "direto";

    const base: EstadoCrm = {
      ...estado,
      conversas: [
        ...estado.conversas,
        {
          id: conversaId,
          contatoId,
          canal,
          modoTriagem: modoDaConversa,
          departamento: departamentoDireto ?? null,
          status: viaAna ? ("ana" as const) : ("fila" as const),
          atendenteId: null,
          criadaEm: agora.toISOString(),
          entrouNaFilaEm: viaAna ? null : agora.toISOString(),
          primeiraRespostaEm: null,
          contextoAna: viaAna ? null : texto,
          naoLidas: 1,
        },
      ],
    };

    const comMensagem = anexar(base, conversaId, "contato", texto, agora.toISOString());
    if (viaAna) return anexar(comMensagem, conversaId, "ana", SAUDACAO_ANA, agora.toISOString());
    return tentarAtribuir(comMensagem, conversaId, agora);
  });
};

export const assumirConversa = async (conversaId: string, atendenteId: string, agora: Date) => {
  aplicar((estado) => ({
    ...estado,
    conversas: estado.conversas.map((c) =>
      c.id === conversaId
        ? { ...c, status: "atendimento" as const, atendenteId, naoLidas: 0 }
        : c
    ),
    eventos: [
      ...estado.eventos,
      {
        id: novoId("ev"),
        conversaId,
        atendenteId,
        motivo: "manual" as const,
        em: agora.toISOString(),
      },
    ],
  }));
};

export const enviarMensagem = async (conversaId: string, texto: string, agora: Date) => {
  aplicar((estado) => {
    const comMensagem = anexar(estado, conversaId, "atendente", texto, agora.toISOString());
    return {
      ...comMensagem,
      conversas: comMensagem.conversas.map((c) =>
        c.id === conversaId
          ? { ...c, naoLidas: 0, primeiraRespostaEm: c.primeiraRespostaEm ?? agora.toISOString() }
          : c
      ),
    };
  });
};

export const encerrarConversa = async (conversaId: string, agora: Date) => {
  aplicar((estado) => {
    const encerrada: EstadoCrm = {
      ...estado,
      conversas: estado.conversas.map((c) =>
        c.id === conversaId ? { ...c, status: "encerrada" as const } : c
      ),
    };
    return drenarFilaSync(encerrada, agora);
  });
};

export const drenarFila = async (agora: Date) => {
  aplicar((estado) => drenarFilaSync(estado, agora));
};

export const moverLead = async (leadId: string, etapaId: string, agora: Date) => {
  aplicar((estado) => ({
    ...estado,
    leads: estado.leads.map((lead) =>
      lead.id === leadId ? { ...lead, etapaId, atualizadoEm: agora.toISOString() } : lead
    ),
  }));
};

export const definirPipelineDoLead = async (
  leadId: string,
  pipeline: PipelineId,
  etapaId: string,
  agora: Date
) => {
  aplicar((estado) => ({
    ...estado,
    leads: estado.leads.map((lead) =>
      lead.id === leadId
        ? { ...lead, pipeline, etapaId, atualizadoEm: agora.toISOString() }
        : lead
    ),
  }));
};

export const alternarDisponibilidade = async (atendenteId: string) => {
  aplicar((estado) => ({
    ...estado,
    atendentes: estado.atendentes.map((a) =>
      a.id === atendenteId ? { ...a, disponivel: !a.disponivel } : a
    ),
  }));
};

export const marcarComoLida = async (conversaId: string) => {
  aplicar((estado) => ({
    ...estado,
    conversas: estado.conversas.map((c) => (c.id === conversaId ? { ...c, naoLidas: 0 } : c)),
  }));
};
