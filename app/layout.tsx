import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "CRM — Imobiliária Perez",
  description: "Central de atendimento e vendas da Imobiliária Perez",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="pt-BR" className={cn("h-full antialiased font-sans", montserrat.variable)}>
    <body className="min-h-full flex flex-col">{children}</body>
  </html>
);

export default RootLayout;
