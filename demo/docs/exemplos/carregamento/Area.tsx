import { useState } from 'react';
import { Botao, Carregando } from '../../../../src';

export default function Exemplo() {
  const [gerando, setGerando] = useState(false);

  const gerar = () => {
    setGerando(true);
    setTimeout(() => setGerando(false), 2000);
  };

  return (
    <div className="demo-pilha-p">
      {/* numa área: quando o conteúdo não tem um formato conhecido */}
      <Carregando mensagem="Carregando o painel" />
      <div className="demo-linha">
        <Botao rotulo="Gerar relatório (2 s)" icone="file-text" onClick={gerar} />
      </div>
      {/* bloqueante: cobre a tela e segura o foco; só quando nada pode ser usado */}
      {gerando && <Carregando mensagem="Gerando relatório" bloqueante />}
    </div>
  );
}
