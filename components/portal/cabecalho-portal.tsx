import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LogoPerez } from "@/components/site/logo-perez";
import { SeletorPerfil } from "./seletor-perfil";

export const CabecalhoPortal = () => <header className="border-b bg-white"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6"><div className="flex items-center gap-3"><LogoPerez compacto /><span className="hidden h-5 w-px bg-zinc-200 sm:block" /><span className="hidden items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[.08em] text-violet-700 sm:flex"><ShieldCheck className="size-3" /> Portal demonstrativo</span></div><div className="flex items-center gap-2"><SeletorPerfil /><Link href="/" className="inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold text-zinc-600"><ArrowLeft className="size-3.5" /><span className="hidden sm:inline">Voltar ao site</span></Link></div></div></header>;
