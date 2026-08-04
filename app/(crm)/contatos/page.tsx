import { UsersRound } from "lucide-react";
import { CabecalhoModulo } from "@/components/operacao/cabecalho-modulo";
import { ListaContatos } from "@/components/operacao/lista-contatos";

const ContatosPage = () => <div className="h-full overflow-y-auto"><div className="mx-auto flex max-w-7xl flex-col gap-5 p-3 sm:p-5"><CabecalhoModulo sobrelinha="Relacionamento unificado" titulo="Pessoas" descricao="Leads, clientes, proprietários e locatários em uma única leitura demonstrativa." icone={UsersRound} /><ListaContatos /></div></div>;
export default ContatosPage;
