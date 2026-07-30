export const CartaoMetrica = ({
  rotulo,
  valor,
  apoio,
}: {
  rotulo: string;
  valor: string;
  apoio?: string;
}) => (
  <div className="rounded-2xl border bg-background p-5 shadow-xs">
    <p className="text-xs font-medium text-muted-foreground">{rotulo}</p>
    <p className="mt-2 text-3xl font-bold tracking-tight">{valor}</p>
    {apoio && <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{apoio}</p>}
  </div>
);
