import Image from "next/image";
import Link from "next/link";
import { Camera, Users, Music2, Send } from "lucide-react";
import PaymentBadges from "./PaymentBadges";

export default function Footer() {
  return (
    <footer className="bg-[var(--zuno-navy-dark)] text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-8 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-white font-bold text-lg">Fica a saber das novidades</h3>
          <p className="text-sm text-white/50 mt-1">Anúncios em destaque, dicas e novidades do Zuno.</p>
        </div>
        <form className="flex w-full md:w-auto gap-2 max-w-sm">
          <input
            type="email"
            placeholder="O teu email"
            className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:bg-white/15 transition-colors"
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-[var(--zuno-green)] text-white p-2.5 rounded-full shrink-0 hover:opacity-90 transition-opacity"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-2">
          <Link href="/">
            <Image
              src="/logo/zuno-logo.png"
              alt="Zuno"
              width={140}
              height={70}
              className="h-8 w-auto object-contain brightness-0 invert opacity-90"
            />
          </Link>
          <p className="text-sm mt-3 mb-4">O teu mercado online em Portugal.</p>
          <div className="flex items-center gap-2 mb-5">
            <a href="#" aria-label="Instagram" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Camera size={16} />
            </a>
            <a href="#" aria-label="TikTok" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Music2 size={16} />
            </a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Users size={16} />
            </a>
          </div>
          <PaymentBadges />
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Zuno</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Categorias</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/categoria/tecnologia" className="hover:text-white transition-colors">Tecnologia</Link></li>
            <li><Link href="/categoria/imoveis" className="hover:text-white transition-colors">Imóveis</Link></li>
            <li><Link href="/categoria/aulas" className="hover:text-white transition-colors">Aulas</Link></li>
            <li><Link href="/categoria/moda" className="hover:text-white transition-colors">Moda</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Ajuda</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Termos e condições</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Zuno. Todos os direitos reservados.
      </div>
    </footer>
  );
}
