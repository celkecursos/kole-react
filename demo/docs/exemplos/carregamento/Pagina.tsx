import { useState } from 'react';
import { Botao, Card, Detalhes, Skeleton } from '../../../../src';

export default function Exemplo() {
  const [carregando, setCarregando] = useState(true);

  // no app: o fetch dos dados da página, ao abrir
  const carregar = () => {
    setCarregando(true);
    setTimeout(() => setCarregando(false), 1500);
  };

  return (
    <div className="demo-pilha-p">
      <Card titulo="Pedido PED-2026-0042" aria-busy={carregando}>
        {carregando ? (
          // silhueta com o mesmo formato do conteúdo: a página não pula quando os dados chegam
          <div className="demo-grade">
            {[0, 1, 2].map((i) => (
              <div key={i} className="demo-pilha-p">
                <Skeleton largura="40%" altura="0.75rem" />
                <Skeleton largura="80%" />
              </div>
            ))}
          </div>
        ) : (
          <div className="demo-grade">
            <Detalhes rotulo="Cliente" valor="Mercado Bom Preço" />
            <Detalhes rotulo="Entrega" valor="15/11/2026" />
            <Detalhes rotulo="Total" valor="R$ 1.250,90" />
          </div>
        )}
      </Card>
      <div className="demo-linha">
        <Botao rotulo="Simular a carga (1,5 s)" icone="refresh-cw" aparencia="texto" onClick={carregar} />
      </div>
    </div>
  );
}
