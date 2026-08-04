import Link from "next/link";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LogoPerez } from "./logo-perez";

export const RodapeSite = () => (
  <footer className="bg-[#171719] text-white">
    <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:px-10 lg:py-20">
      <div>
        <LogoPerez invertido />
        <p className="mt-6 max-w-sm text-sm leading-6 text-white/60">
          Imóveis, atendimento e gestão imobiliária em uma experiência próxima, segura e conectada com Londrina.
        </p>
        <p className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-white/55">
          Apresentação visual — dados demonstrativos
        </p>
      </div>
      <div>
        <h2 className="text-sm font-bold">Encontre seu imóvel</h2>
        <div className="mt-5 grid gap-3 text-sm text-white/55">
          <Link href="/imoveis?finalidade=venda" className="hover:text-white">Comprar</Link>
          <Link href="/imoveis?finalidade=locacao" className="hover:text-white">Alugar</Link>
          <Link href="/imoveis?finalidade=lancamento" className="hover:text-white">Lançamentos</Link>
          <Link href="/vender-alugar" className="hover:text-white">Anunciar imóvel</Link>
        </div>
      </div>
      <div>
        <h2 className="text-sm font-bold">Perez</h2>
        <div className="mt-5 grid gap-3 text-sm text-white/55">
          <Link href="/sobre" className="hover:text-white">Nossa história</Link>
          <Link href="/contato" className="hover:text-white">Fale conosco</Link>
          <Link href="/portal" className="hover:text-white">Área do cliente</Link>
          <Link href="/dashboard" className="hover:text-white">Plataforma Perez 360</Link>
        </div>
      </div>
      <div>
        <h2 className="text-sm font-bold">Atendimento</h2>
        <div className="mt-5 grid gap-4 text-sm text-white/55">
          <span className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-[#e05b6d]" /> Av. Higienópolis, Londrina — PR</span>
          <span className="flex gap-3"><Phone className="size-4 shrink-0 text-[#e05b6d]" /> (43) 3377-7000</span>
          <span className="flex gap-3"><MessageCircle className="size-4 shrink-0 text-[#e05b6d]" /> (43) 99999-7000</span>
          <span className="flex gap-3"><Mail className="size-4 shrink-0 text-[#e05b6d]" /> contato@imobiliariaperez.com.br</span>
          <span className="flex gap-3"><Clock3 className="size-4 shrink-0 text-[#e05b6d]" /> Seg. a sex., 8h às 18h</span>
        </div>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-2 px-5 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <span>© 2026 Imobiliária Perez. Protótipo de apresentação.</span>
        <span>CRECI e informações exibidos somente na versão de produção.</span>
      </div>
    </div>
  </footer>
);
