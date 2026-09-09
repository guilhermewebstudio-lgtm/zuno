import InfoPage from "@/components/InfoPage";

export default function TermosPage() {
  return (
    <InfoPage title="Termos e condições" subtitle="Última atualização: 2026.">
      <p>
        Ao usares o Zuno, concordas que a plataforma serve apenas para conectar
        compradores e vendedores. O Zuno não é parte em nenhuma transação e não
        se responsabiliza pela qualidade, legalidade ou entrega dos artigos
        anunciados.
      </p>
      <p>
        Os anúncios ficam ativos durante 30 dias, podendo ser republicados pelo
        vendedor. É proibido publicar conteúdo ilegal, enganoso ou que viole
        direitos de terceiros.
      </p>
      <p>
        Reservamo-nos o direito de remover anúncios ou suspender contas que
        violem estes termos, sem aviso prévio.
      </p>
    </InfoPage>
  );
}
