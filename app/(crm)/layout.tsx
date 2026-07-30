import { Navegacao } from "@/components/crm/navegacao";
import { SeletorPapel } from "@/components/crm/seletor-papel";
import { Simulador } from "@/components/crm/simulador";
import { SomenteCliente } from "@/components/crm/somente-cliente";

const CrmLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-dvh w-full overflow-hidden">
    <aside className="flex w-56 shrink-0 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
          P
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Perez</p>
          <p className="text-[10px] text-muted-foreground">CRECI J-2.696</p>
        </div>
      </div>
      <Navegacao />
    </aside>
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-end gap-3 border-b px-4">
        <SomenteCliente fallback={null}>
          <Simulador />
          <SeletorPapel />
        </SomenteCliente>
      </header>
      <main className="min-h-0 flex-1 overflow-hidden">
        <SomenteCliente>{children}</SomenteCliente>
      </main>
    </div>
  </div>
);

export default CrmLayout;
