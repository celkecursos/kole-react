import { useState } from 'react';
import { Botao, Carregando } from '../../../../src';

export default function Exemplo() {
  const [bloqueado, setBloqueado] = useState(false);

  const gerar = () => {
    setBloqueado(true);
    setTimeout(() => setBloqueado(false), 2000);
  };

  return (
    <div className="demo-pilha-p">
      {/* dentro de uma área */}
      <Carregando mensagem="Carregando pedidos" />
      {/* bloqueante: cobre a tela e segura o foco até terminar */}
      <div className="demo-linha">
        <Botao rotulo="Gerar relatório (2 s)" icone="file-text" onClick={gerar} />
      </div>
      {bloqueado && <Carregando mensagem="Gerando relatório" bloqueante />}
    </div>
  );
}
