import { useState } from 'react';
import { CampoMarcacao } from '../../../../src';

export default function Exemplo() {
  const [termos, setTermos] = useState(false);
  const [avisos, setAvisos] = useState(true);
  const [ativo, setAtivo] = useState(true);

  return (
    <div className="demo-pilha-p">
      <CampoMarcacao rotulo="Li e aceito os termos de uso" obrigatorio valor={termos} aoMudar={setTermos} />
      <CampoMarcacao rotulo="Receber avisos por e-mail" dica="Pedidos, pagamentos e entregas." valor={avisos} aoMudar={setAvisos} />
      {/* chave: liga/desliga com efeito imediato */}
      <CampoMarcacao rotulo="Produto ativo no catálogo" aparencia="chave" valor={ativo} aoMudar={setAtivo} />
      <CampoMarcacao rotulo="Desabilitado" valor disabled />
    </div>
  );
}
