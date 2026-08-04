import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ResumoLocatario } from "@/components/portal/resumo-locatario";
import { ResumoProprietario } from "@/components/portal/resumo-proprietario";

describe("portais demonstrativos", () => {
  it("conecta o proprietário à carteira e aos repasses", () => {
    const html = renderToStaticMarkup(createElement(ResumoProprietario));
    expect(html).toContain("Minha carteira");
    expect(html).toContain("Repasses demonstrativos");
    expect(html).toContain("PZ-1001");
  });

  it("conecta o locatário ao contrato e à manutenção", () => {
    const html = renderToStaticMarkup(createElement(ResumoLocatario));
    expect(html).toContain("Meu contrato");
    expect(html).toContain("Próximo vencimento");
    expect(html).toContain("Solicitar manutenção");
  });
});
