"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useCrm } from "@/lib/store/crm-store";

export const RestaurarDemonstracao = () => { const restaurar = () => { Object.keys(window.localStorage).filter((chave) => chave.startsWith("perez360:")).forEach((chave) => window.localStorage.removeItem(chave)); useCrm.getState().reiniciar(); window.location.reload(); }; return <AlertDialog><AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Restaurar demonstração" />}><RotateCcw className="size-3.5" /></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Restaurar a apresentação?</AlertDialogTitle><AlertDialogDescription>Favoritos e alterações locais voltarão ao estado inicial. Nenhum dado externo será afetado.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Continuar como está</AlertDialogCancel><AlertDialogAction onClick={restaurar}>Restaurar exemplo</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>; };
