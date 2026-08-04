import { CabecalhoSite } from "@/components/site/cabecalho-site";
import { RodapeSite } from "@/components/site/rodape-site";

const SiteLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-dvh flex-col bg-white text-zinc-950">
    <CabecalhoSite />
    <div className="flex-1">{children}</div>
    <RodapeSite />
  </div>
);

export default SiteLayout;
