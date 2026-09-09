import InfoPage from "@/components/InfoPage";

export default function SegurancaPage() {
  return (
    <InfoPage title="Segurança" subtitle="Dicas para comprar e vender com confiança.">
      <ul className="list-disc pl-5 space-y-2">
        <li>Combina encontros em locais públicos e movimentados, de preferência de dia.</li>
        <li>Vê e confirma o artigo antes de pagar.</li>
        <li>Desconfia de preços demasiado bons para serem verdade.</li>
        <li>Nunca partilhes dados bancários ou códigos de verificação por mensagem.</li>
        <li>Se algo parecer suspeito, reporta o anúncio ou o utilizador — a nossa equipa analisa todas as denúncias.</li>
      </ul>
    </InfoPage>
  );
}
