export const CartaoMetrica = ({
  rotulo,
  valor,
  apoio,
}: {
  rotulo: string;
  valor: string;
  apoio?: string;
}) => (
  <div className="rounded-lg border p-4">
    <p className="text-xs text-muted-foreground">{rotulo}</p>
    <p className="mt-1 text-3xl font-semibold tracking-tight">{valor}</p>
    {apoio && <p className="mt-0.5 text-xs text-muted-foreground">{apoio}</p>}
  </div>
);
