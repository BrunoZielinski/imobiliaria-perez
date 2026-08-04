import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/(site)/page";

describe("home pública Perez", () => {
  it("apresenta busca, imóveis e confiança institucional", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).toContain("Encontre o imóvel que combina com o seu momento");
    expect(html).toContain("Imóveis em destaque");
    expect(html).toContain("Mais de 35 anos");
    expect(html).toContain("PZ-1001");
  });

  it("oferece caminhos para comprar, alugar, anunciar e administrar", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).toContain("Comprar um imóvel");
    expect(html).toContain("Alugar um imóvel");
    expect(html).toContain("Anunciar meu imóvel");
    expect(html).toContain("Administrar meu patrimônio");
  });
});
