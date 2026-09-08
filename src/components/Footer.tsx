import Image from "next/image";
import PaymentBadges from "./PaymentBadges";

export default function Footer() {
  return (
    <footer className="bg-[var(--zuno-navy-dark)] text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Image
            src="/logo/zuno-logo.png"
            alt="Zuno"
            width={140}
            height={70}
            className="h-8 w-auto object-contain brightness-0 invert opacity-90"
          />
          <p className="text-sm mt-3 mb-4">O teu mercado online em Portugal.</p>
          <PaymentBadges />
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Zuno</h4>
          <ul className="space-y-2 text-sm">
            <li>Sobre nós</li>
            <li>Como funciona</li>
            <li>Contacto</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Categorias</h4>
          <ul className="space-y-2 text-sm">
            <li>Tecnologia</li>
            <li>Imóveis</li>
            <li>Aulas</li>
            <li>Moda</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Ajuda</h4>
          <ul className="space-y-2 text-sm">
            <li>Segurança</li>
            <li>Termos e condições</li>
            <li>Privacidade</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Zuno. Todos os direitos reservados.
      </div>
    </footer>
  );
}
