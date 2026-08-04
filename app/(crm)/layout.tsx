import { Navegacao } from "@/components/crm/navegacao";
import { SeletorPapel } from "@/components/crm/seletor-papel";
import { Simulador } from "@/components/crm/simulador";
import { SomenteCliente } from "@/components/crm/somente-cliente";
import { NavegacaoMobile } from "@/components/crm/navegacao-mobile";
import { SeletorModulo } from "@/components/crm/seletor-modulo";
import { TourDemonstracao } from "@/components/crm/tour-demonstracao";
import { RestaurarDemonstracao } from "@/components/crm/restaurar-demonstracao";
import { LogoPerez } from "@/components/site/logo-perez";
import Link from "next/link";
import { ArrowUpRight, Wifi } from "lucide-react";

const CrmLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-dvh w-full overflow-hidden bg-[#f5f5f6]">
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-[4.5rem] items-center px-5">
        <LogoPerez />
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
        <Link href="/" className="mt-2 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[0.68rem] font-bold text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground">Ver site público <ArrowUpRight className="size-3" /></Link>
      </div>
    </aside>
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-muted-foreground">
          <NavegacaoMobile />
          <SeletorModulo />
          <span className="flex size-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Wifi className="size-3.5" />
          </span>
          <span className="hidden sm:inline">Operação online</span>
        </div>
        <SomenteCliente fallback={null}>
          <div className="hidden items-center gap-2 xl:flex">
            <TourDemonstracao />
            <RestaurarDemonstracao />
            <Simulador />
            <SeletorPapel />
          </div>
        </SomenteCliente>
      </header>
      <main className="min-h-0 flex-1 overflow-hidden p-2 sm:p-3">
        <SomenteCliente>{children}</SomenteCliente>
      </main>
    </div>
  </div>
);

export default CrmLayout;
