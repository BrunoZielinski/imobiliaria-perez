import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FichaImovel } from "@/components/site/ficha-imovel";
import { IMOVEIS_PEREZ } from "./dados";

describe("ficha pública do imóvel", () => {
  it("apresenta identidade, preço e características", () => {
    const html = renderToStaticMarkup(createElement(FichaImovel, { imovel: IMOVEIS_PEREZ[0] }));

    expect(html).toContain("PZ-1001");
    expect(html).toContain("Apartamento panorâmico");
    expect(html).toContain("1.280.000");
    expect(html).toContain("156 m²");
    expect(html).toContain("3 quartos");
    expect(html).toContain("2 vagas");
    expect(html).toContain("Dados demonstrativos");
  });
});
