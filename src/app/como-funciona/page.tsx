import InfoPage from "@/components/InfoPage";

export default function ComoFuncionaPage() {
  return (
    <InfoPage title="Como funciona" subtitle="Comprar e vender no Zuno em 3 passos simples.">
      <div>
        <h3 className="font-bold text-[var(--zuno-navy-dark)] mb-1">1. Cria a tua conta</h3>
        <p>Regista-te gratuitamente com nome e email. Demora menos de um minuto.</p>
      </div>
      <div>
        <h3 className="font-bold text-[var(--zuno-navy-dark)] mb-1">2. Publica ou procura</h3>
        <p>
          Quer vender? Publica um anúncio com fotos, descrição e preço — fica
          ativo durante 30 dias. Quer comprar? Pesquisa ou navega por categoria
          e contacta o vendedor diretamente pelo chat.
        </p>
      </div>
      <div>
        <h3 className="font-bold text-[var(--zuno-navy-dark)] mb-1">3. Combinam o encontro</h3>
        <p>
          Comprador e vendedor combinam local e hora para a troca, tal como
          seria de esperar num mercado local. O Zuno não interfere no pagamento
          nem na entrega — a transação é sempre direta entre as duas pessoas.
        </p>
      </div>
      <div>
        <h3 className="font-bold text-[var(--zuno-navy-dark)] mb-1">Queres mais visibilidade?</h3>
        <p>
          Podes destacar o teu anúncio para aparecer no topo dos resultados —
          uma forma simples de vender mais rápido.
        </p>
      </div>
    </InfoPage>
  );
}
