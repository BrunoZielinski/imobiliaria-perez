"use client";

import { useState } from "react";
import { Megaphone, Sparkles } from "lucide-react";
import { CabecalhoModulo } from "@/components/operacao/cabecalho-modulo";
import { AvisoDemonstracao } from "@/components/gestao/aviso-demonstracao";
import {
  CONTEUDOS_MARKETING,
  criarConteudoDoKit,
  type AbaMarketing,
  type ConteudoMarketing,
  type KitConteudoIA,
} from "@/lib/perez360/marketing";
import { NavegacaoMarketing } from "./navegacao-marketing";
import { ResumoMarketing } from "./resumo-marketing";
import { EstudioIA } from "./estudio-ia";
import { CalendarioEditorial } from "./calendario-editorial";
import { GestaoTrafego } from "./gestao-trafego";

const EM_BREVE: Record<Exclude<AbaMarketing, "resumo">, { titulo: string; descricao: string }> = {
  estudio: { titulo: "Estúdio IA", descricao: "Criação guiada de campanhas multicanal a partir dos imóveis Perez." },
  calendario: { titulo: "Calendário editorial", descricao: "Planejamento orgânico e pago em uma única agenda." },
  trafego: { titulo: "Gestão de tráfego", descricao: "Orçamento, públicos, desempenho e recomendações por canal." },
  conteudos: { titulo: "Biblioteca de conteúdos", descricao: "Peças organizadas por imóvel, formato, canal e etapa." },
  aprovacoes: { titulo: "Fluxo de aprovações", descricao: "Da ideia à publicação com responsáveis e observações." },
};

export const CentralMarketing = () => {
  const [aba, setAba] = useState<AbaMarketing>("resumo");
  const [conteudos, setConteudos] = useState<ConteudoMarketing[]>(CONTEUDOS_MARKETING);

  const enviarAprovacao = (kit: KitConteudoIA) => {
    setConteudos((atuais) => [criarConteudoDoKit(kit, `conteudo-ia-${atuais.length + 1}`), ...atuais]);
    setAba("aprovacoes");
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f6]">
      <div className="mx-auto flex max-w-[92rem] flex-col gap-5 p-3 sm:p-5">
        <CabecalhoModulo
          sobrelinha="Social media + gestão de tráfego"
          titulo="Central de Marketing"
          descricao="Planeje, crie e acompanhe a presença digital da Perez em todos os canais."
          icone={Megaphone}
          acao={<span className="inline-flex items-center gap-2 self-start rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-[10px] font-bold text-violet-700"><Sparkles className="size-3.5" /> IA de conteúdo ativa</span>}
        />
        <AvisoDemonstracao descricao="Conteúdos, campanhas, métricas e sugestões desta área são exemplos visuais. Nenhuma publicação ou investimento é realizado." />
        <NavegacaoMarketing aba={aba} aoAlterar={setAba} />
        {aba === "resumo" ? (
          <ResumoMarketing irPara={setAba} />
        ) : aba === "estudio" ? (
          <EstudioIA aoEnviarAprovacao={enviarAprovacao} />
        ) : aba === "calendario" ? (
          <CalendarioEditorial />
        ) : aba === "trafego" ? (
          <GestaoTrafego />
        ) : (
          <section className="grid min-h-[28rem] place-items-center rounded-2xl border border-dashed bg-white p-8 text-center">
            <div className="max-w-md"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Sparkles className="size-6" /></span><h2 className="mt-5 text-xl font-black">{EM_BREVE[aba].titulo}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{EM_BREVE[aba].descricao}</p><span className="mt-5 inline-block rounded-full bg-zinc-100 px-3 py-1.5 text-[10px] font-bold text-zinc-500">{conteudos.length} conteúdos na demonstração</span></div>
          </section>
        )}
      </div>
    </div>
  );
};
