import { useState } from 'react';
import { AcaoLinha, Botao } from '../../../../src';

export default function Exemplo() {
  const [enviando, setEnviando] = useState(false);
  const [baixando, setBaixando] = useState(false);

  const simular = (ligar: (v: boolean) => void) => {
    ligar(true);
    setTimeout(() => ligar(false), 1500);
  };

  return (
    <div className="demo-linha">
      {/* o botão continua focável e recusa o clique repetido */}
      <Botao rotulo={enviando ? 'Enviando…' : 'Enviar pedido'} icone="send" carregando={enviando} onClick={() => simular(setEnviando)} />
      <AcaoLinha icone="download" rotulo="Baixar nota" severidade="pri" carregando={baixando} onClick={() => simular(setBaixando)} />
    </div>
  );
}
