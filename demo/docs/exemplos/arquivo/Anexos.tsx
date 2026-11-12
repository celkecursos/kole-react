import { useRef, useState } from 'react';
import { Botao, CampoAnexo, useToast, type Anexo, type CampoAnexoRef } from '../../../../src';

// anexo já salvo no servidor: vem com url (o visualizador abre a imagem)
const SALVOS: Anexo[] = [
  {
    nome: 'logo-loja.svg',
    tamanho: 1_840,
    tipo: 'image/svg+xml',
    url: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#1f5fe0"/><circle cx="160" cy="100" r="56" fill="#fff"/></svg>')}`,
  },
  { nome: 'contrato-social.pdf', tamanho: 482_000, tipo: 'application/pdf' },
];

export default function Exemplo() {
  const toast = useToast();
  const ref = useRef<CampoAnexoRef>(null);
  const [anexos, setAnexos] = useState<Anexo[]>(SALVOS);

  const enviar = () => {
    // o File de verdade (para o upload) sai por ref.arquivoDe(anexo); os já salvos devolvem null
    const novos = anexos.filter((a) => ref.current?.arquivoDe(a));
    toast.info('Upload simulado', `${novos.length} arquivo(s) novo(s)`);
  };

  return (
    <div className="demo-pilha-p">
      <CampoAnexo
        ref={ref}
        rotulo="Documentos da empresa"
        accept="image/*,.pdf"
        maxTamanho={5 * 1024 * 1024}
        dica="Imagens ou PDF, até 5 MB cada."
        valor={anexos}
        aoMudar={setAnexos}
      />
      <div className="demo-linha">
        <Botao rotulo="Enviar" icone="upload" severidade="secundario" onClick={enviar} />
      </div>
    </div>
  );
}
