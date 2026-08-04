import { CabecalhoPortal } from "@/components/portal/cabecalho-portal";

const PortalLayout = ({ children }: { children: React.ReactNode }) => <div className="min-h-dvh bg-[#f5f3ef] text-zinc-950"><CabecalhoPortal />{children}</div>;
export default PortalLayout;
