import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LogoPerez } from "@/components/site/logo-perez";
import { RodapeSite } from "@/components/site/rodape-site";

describe("shell público Perez", () => {
  it("apresenta a marca completa", () => {
    const html = renderToStaticMarkup(createElement(LogoPerez));
    expect(html).toContain("Imobiliária Perez");
    expect(html).toContain("P");
  });

  it("mantém acesso aos imóveis e identifica a demonstração", () => {
    const html = renderToStaticMarkup(createElement(RodapeSite));
    expect(html).toContain("/imoveis");
    expect(html).toContain("Apresentação visual");
    expect(html).toContain("dados demonstrativos");
  });
});
