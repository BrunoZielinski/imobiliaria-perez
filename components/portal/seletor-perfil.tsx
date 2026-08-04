"use client";

import { usePathname, useRouter } from "next/navigation";

export const SeletorPerfil = () => { const caminho = usePathname(); const router = useRouter(); const valor = caminho.includes("proprietario") ? "/portal/proprietario" : caminho.includes("locatario") ? "/portal/locatario" : "/portal"; return <select value={valor} onChange={(evento) => router.push(evento.target.value)} aria-label="Perfil do portal" className="h-9 max-w-40 rounded-full border bg-white px-3 text-xs font-bold outline-none focus:border-[#b52235]"><option value="/portal">Escolher perfil</option><option value="/portal/proprietario">Proprietário</option><option value="/portal/locatario">Locatário</option></select>; };
