"use client";

import { useSyncExternalStore } from "react";
import { Spinner } from "@/components/ui/spinner";

const observarMontagem = () => () => undefined;

const Carregando = () => (
  <div className="flex h-full items-center justify-center">
    <Spinner className="size-5 text-muted-foreground" />
  </div>
);

export const SomenteCliente = ({
  children,
  fallback = <Carregando />,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const montado = useSyncExternalStore(observarMontagem, () => true, () => false);

  return <>{montado ? children : fallback}</>;
};
