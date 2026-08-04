"use client";

import { useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { alternarFavorito, CHAVE_FAVORITOS, lerFavoritos } from "@/lib/perez360/favoritos";
import { cn } from "@/lib/utils";

export const FavoritoImovel = ({ codigo, className }: { codigo: string; className?: string }) => {
  const favorito = useSyncExternalStore(
    (aoAlterar) => {
      window.addEventListener("storage", aoAlterar);
      window.addEventListener("perez360:favoritos", aoAlterar);
      return () => {
        window.removeEventListener("storage", aoAlterar);
        window.removeEventListener("perez360:favoritos", aoAlterar);
      };
    },
    () => lerFavoritos(window.localStorage.getItem(CHAVE_FAVORITOS)).includes(codigo),
    () => false,
  );

  const alternar = () => {
    const atuais = lerFavoritos(window.localStorage.getItem(CHAVE_FAVORITOS));
    const proximos = alternarFavorito(atuais, codigo);
    window.localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(proximos));
    window.dispatchEvent(new Event("perez360:favoritos"));
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={favorito}
      aria-label={`${favorito ? "Remover" : "Adicionar"} ${codigo} ${favorito ? "dos" : "aos"} favoritos`}
      className={cn(
        "grid size-9 place-items-center rounded-full bg-white/95 text-zinc-700 shadow-sm backdrop-blur transition hover:scale-105 hover:text-[#b52235] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b52235]",
        favorito && "bg-[#b52235] text-white hover:text-white",
        className,
      )}
    >
      <Heart className={cn("size-4", favorito && "fill-current")} />
    </button>
  );
};
