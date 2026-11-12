import { useState } from 'react';
import { Escolha, Tabela, type Coluna } from '../../../../src';
import { PEDIDOS, type Pedido } from '../tabela/dados';

const COLUNAS: Coluna<Pedido>[] = [
  { campo: 'numero', rotulo: 'Pedido', destaque: true },
  { campo: 'cliente', rotulo: 'Cliente' },
];

type Estado = 'carregando' | 'atualizando' | 'pronto';

export default function Exemplo() {
  const [estado, setEstado] = useState<Estado | null>('carregando');

  return (
    <div className="demo-pilha-p">
      <Escolha<Estado>
        ariaLabel="Estado da tabela"
        valor={estado}
        aoMudar={setEstado}
        opcoes={[
          { valor: 'carregando', rotulo: 'Primeira carga' },
          { valor: 'atualizando', rotulo: 'Paginando' },
          { valor: 'pronto', rotulo: 'Pronta' },
        ]}
      />
      {/* carregando = silhuetas (primeira carga) · atualizando = mantém os dados, esmaecidos */}
      <Tabela
        rotulo="Pedidos"
        colunas={COLUNAS}
        registros={PEDIDOS.slice(0, 3)}
        carregando={estado === 'carregando'}
        atualizando={estado === 'atualizando'}
      />
    </div>
  );
}
