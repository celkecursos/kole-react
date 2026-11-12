import { useState } from 'react';
import { Botao, Recolhivel } from '../../../../src';

export default function Exemplo() {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="demo-pilha-p">
      <div className="demo-linha">
        <Botao
          rotulo={aberto ? 'Menos filtros' : 'Mais filtros'}
          icone="sliders-horizontal"
          aparencia="contorno"
          aria-expanded={aberto}
          aria-controls="mais-filtros"
          onClick={() => setAberto((a) => !a)}
        />
      </div>
      <Recolhivel id="mais-filtros" aberto={aberto}>
        <p style={{ margin: 0 }}>Os filtros avançados aparecem aqui, com uma animação suave. Fechado, o conteúdo sai do Tab.</p>
      </Recolhivel>
    </div>
  );
}
