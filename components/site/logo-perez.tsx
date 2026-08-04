import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoPerezProps = {
  compacto?: boolean;
  invertido?: boolean;
  className?: string;
};

export const LogoPerez = ({ compacto = false, invertido = false, className }: LogoPerezProps) => (
  <Link
    href="/"
    aria-label="Imobiliária Perez — página inicial"
    className={cn("inline-flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-primary", className)}
  >
    <span
      className={cn(
        "grid size-10 place-items-center rounded-[0.85rem] bg-[#b52235] text-lg font-black text-white shadow-sm",
        compacto && "size-9 text-base",
      )}
      aria-hidden="true"
    >
      P
    </span>
    {!compacto && (
      <span className="leading-none">
        <span className={cn("block text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-zinc-500", invertido && "text-white/55")}>
          Imobiliária
        </span>
        <span className={cn("mt-1 block text-xl font-extrabold tracking-[-0.045em] text-zinc-950", invertido && "text-white")}>
          Perez
        </span>
      </span>
    )}
  </Link>
);
