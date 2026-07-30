import { Navegacao } from "@/components/crm/navegacao";
import { SeletorPapel } from "@/components/crm/seletor-papel";
import { Simulador } from "@/components/crm/simulador";
import { SomenteCliente } from "@/components/crm/somente-cliente";
import { Wifi } from "lucide-react";

const CrmLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-dvh w-full overflow-hidden bg-[#f5f5f6]">
    <aside className="flex w-52 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-3 px-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/25">
          P
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight">Central Perez</p>
          <p className="text-[10px] text-muted-foreground">Atendimento inteligente</p>
        </div>
      </div>
      <Navegacao />
      <div className="mt-auto p-4">
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/45 px-3 py-3">
          <p className="text-[11px] font-semibold text-sidebar-foreground">Imobiliária Perez</p>
          <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
            Mais de 35 anos em Londrina
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Ambiente de demonstração
          </div>
        </div>
      </div>
    </aside>
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="flex size-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Wifi className="size-3.5" />
          </span>
          Operação online
        </div>
        <SomenteCliente fallback={null}>
          <div className="flex items-center gap-2">
            <Simulador />
            <SeletorPapel />
          </div>
        </SomenteCliente>
      </header>
      <main className="min-h-0 flex-1 overflow-hidden p-3">
        <SomenteCliente>{children}</SomenteCliente>
      </main>
    </div>
  </div>
);

export default CrmLayout;
