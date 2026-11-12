import { useState } from 'react';
import { Botao, CampoTexto } from '../../../../src';

export default function Exemplo() {
  const [valor, setValor] = useState('150,00');
  const [busca, setBusca] = useState('');

  return (
    <div className="demo-grade-2">
      <CampoTexto rotulo="Valor" prefixo="R$" valor={valor} aoMudar={setValor} inputMode="decimal" />
      <CampoTexto rotulo="Site" prefixo="https://" sufixo=".com.br" placeholder="minhaloja" />
      <CampoTexto
        rotulo="Buscar pedido"
        icone="search"
        valor={busca}
        aoMudar={setBusca}
        sufixo={<Botao icone="x" aparencia="texto" tamanho="pequeno" aria-label="Limpar" dica="Limpar" onClick={() => setBusca('')} />}
      />
    </div>
  );
}
