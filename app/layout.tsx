import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Imobiliária Perez — Imóveis em Londrina",
    template: "%s | Imobiliária Perez",
  },
  description:
    "Encontre imóveis para comprar, alugar ou investir em Londrina com a experiência de mais de 35 anos da Imobiliária Perez.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="pt-BR" className="h-full font-sans antialiased">
    <body className="min-h-full flex flex-col">{children}</body>
  </html>
);

export default RootLayout;
