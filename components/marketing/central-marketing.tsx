"use client";

import { useState } from "react";
import { Megaphone, Sparkles } from "lucide-react";
import { CabecalhoModulo } from "@/components/operacao/cabecalho-modulo";
import { AvisoDemonstracao } from "@/components/gestao/aviso-demonstracao";
import {
  CONTEUDOS_MARKETING,
  criarConteudoDoKit,
  proximoStatusConteudo,
  type AbaMarketing,
  type ConteudoMarketing,
  type KitConteudoIA,
} from "@/lib/perez360/marketing";
import { NavegacaoMarketing } from "./navegacao-marketing";
import { ResumoMarketing } from "./resumo-marketing";
import { EstudioIA } from "./estudio-ia";
import { CalendarioEditorial } from "./calendario-editorial";
import { GestaoTrafego } from "./gestao-trafego";
import { BibliotecaConteudos } from "./biblioteca-conteudos";
import { FluxoAprovacoes } from "./fluxo-aprovacoes";

export const CentralMarketing = () => {
  const [aba, setAba] = useState<AbaMarketing>("resumo");
  const [conteudos, setConteudos] = useState<ConteudoMarketing[]>(CONTEUDOS_MARKETING);

  const enviarAprovacao = (kit: KitConteudoIA) => {
    setConteudos((atuais) => [criarConteudoDoKit(kit, `conteudo-ia-${atuais.length + 1}`), ...atuais]);
    setAba("aprovacoes");
  };

  const avancarConteudo = (id: string) => {
    setConteudos((atuais) => atuais.map((item) => (
      item.id === id ? { ...item, status: proximoStatusConteudo(item.status) } : item
    )));
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
        ) : aba === "conteudos" ? (
          <BibliotecaConteudos conteudos={conteudos} />
        ) : aba === "aprovacoes" ? (
          <FluxoAprovacoes conteudos={conteudos} aoAvancar={avancarConteudo} />
        ) : null}
      </div>
    </div>
  );
};
