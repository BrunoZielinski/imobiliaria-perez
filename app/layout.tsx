import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM — Imobiliária Perez",
  description: "Central de atendimento e vendas da Imobiliária Perez",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="pt-BR" className="h-full font-sans antialiased">
    <body className="min-h-full flex flex-col">{children}</body>
  </html>
);

export default RootLayout;
