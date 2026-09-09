import InfoPage from "@/components/InfoPage";

export default function PrivacidadePage() {
  return (
    <InfoPage title="Privacidade" subtitle="Como tratamos os teus dados.">
      <p>
        Guardamos apenas os dados necessários para o funcionamento da conta:
        nome, email, telemóvel (opcional) e cidade. Nunca vendemos os teus
        dados a terceiros.
      </p>
      <p>
        As fotos dos anúncios são armazenadas de forma segura através de um
        fornecedor externo especializado em alojamento de imagens.
      </p>
      <p>
        Podes pedir a eliminação da tua conta e dados a qualquer momento
        através da página de contacto.
      </p>
    </InfoPage>
  );
}
