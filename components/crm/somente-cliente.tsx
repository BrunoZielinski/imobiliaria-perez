"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

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
  const [montado, setMontado] = useState(false);

  useEffect(() => setMontado(true), []);

  return <>{montado ? children : fallback}</>;
};
