import { useState } from 'react';
import { Botao, Card } from '../../../../src';

export default function Exemplo() {
  const [visivel, setVisivel] = useState(true);

  return (
    <div className="demo-grade-2">
      {/* recolhivel e telaCheia: botões no cabeçalho */}
      <Card titulo="Vendas por vendedor" recolhivel telaCheia>
        Ana: R$ 12,4 mil · Carlos: R$ 9,8 mil · Beatriz: R$ 7,1 mil
      </Card>
      {visivel ? (
        <Card titulo="Dica do sistema" cor="info" dispensavel aoFechar={() => setVisivel(false)}>
          Use Ctrl K para buscar qualquer página.
        </Card>
      ) : (
        <Botao rotulo="Mostrar a dica de novo" aparencia="texto" onClick={() => setVisivel(true)} />
      )}
    </div>
  );
}
