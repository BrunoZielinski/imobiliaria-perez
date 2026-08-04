import { FlaskConical, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const AvisoDemonstracao = ({ titulo = "Ambiente demonstrativo", descricao = "Os dados e as ações desta tela são apenas exemplos visuais.", className }: { titulo?: string; descricao?: string; className?: string }) => (
  <div className={cn("flex flex-col gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-violet-900 sm:flex-row sm:items-center sm:justify-between", className)}><div className="flex items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-100"><FlaskConical className="size-4" /></span><div><p className="text-xs font-bold">{titulo}</p><p className="text-[10px] leading-4 text-violet-700">{descricao}</p></div></div><span className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-700"><ShieldCheck className="size-3.5" /> Nenhuma operação real</span></div>
);
