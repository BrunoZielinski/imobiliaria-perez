import { FileKey2 } from "lucide-react";
import { CabecalhoModulo } from "@/components/operacao/cabecalho-modulo";
import { TabelaContratos } from "@/components/operacao/tabela-contratos";
import { CartaoMetrica } from "@/components/crm/cartao-metrica";
import { CONTRATOS_PEREZ } from "@/lib/perez360/dados";
import { resumoContratos } from "@/lib/perez360/operacao";

const LocacoesPage = () => { const resumo = resumoContratos(CONTRATOS_PEREZ); return <div className="h-full overflow-y-auto"><div className="mx-auto flex max-w-7xl flex-col gap-5 p-3 sm:p-5"><CabecalhoModulo sobrelinha="Gestão contratual" titulo="Locações" descricao="Contratos, reajustes, vencimentos e situações que merecem atenção." icone={FileKey2} /><div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><CartaoMetrica rotulo="Contratos ativos" valor={String(resumo.ativos)} /><CartaoMetrica rotulo="Próximos reajustes" valor={String(resumo.reajustesProximos)} /><CartaoMetrica rotulo="Próximos vencimentos" valor={String(resumo.vencimentosProximos)} /><CartaoMetrica rotulo="Precisam de atenção" valor={String(resumo.atencao)} /></div><TabelaContratos /></div></div>; };
export default LocacoesPage;
