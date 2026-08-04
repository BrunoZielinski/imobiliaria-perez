import { Sparkles } from "lucide-react";
import { CabecalhoModulo } from "@/components/operacao/cabecalho-modulo";
import { QuadroCaptacoes } from "@/components/operacao/quadro-captacoes";

const CaptacoesPage = () => <div className="h-full overflow-y-auto"><div className="mx-auto flex max-w-[94rem] flex-col gap-5 p-3 sm:p-5"><CabecalhoModulo sobrelinha="Entrada da carteira" titulo="Captações" descricao="Da avaliação à publicação, com proprietário, imóvel, responsável e próxima ação conectados." icone={Sparkles} /><QuadroCaptacoes /></div></div>;
export default CaptacoesPage;
