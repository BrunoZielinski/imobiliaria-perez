import { Wrench } from "lucide-react";
import { CabecalhoModulo } from "@/components/operacao/cabecalho-modulo";
import { QuadroManutencoes } from "@/components/operacao/quadro-manutencoes";

const ManutencoesPage = () => <div className="h-full overflow-y-auto"><div className="mx-auto flex max-w-[94rem] flex-col gap-5 p-3 sm:p-5"><CabecalhoModulo sobrelinha="Cuidado com o imóvel" titulo="Manutenções" descricao="Solicitações organizadas por prioridade, imóvel, locatário, prestador e prazo." icone={Wrench} /><QuadroManutencoes /></div></div>;
export default ManutencoesPage;
