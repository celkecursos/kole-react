import { useState } from 'react';
import { Botao, Escolha, Tabela, type Coluna } from '../../../../src';
import { PEDIDOS, type Pedido } from './dados';

const COLUNAS: Coluna<Pedido>[] = [
  { campo: 'numero', rotulo: 'Pedido', destaque: true },
  { campo: 'cliente', rotulo: 'Cliente' },
];

type Estado = 'carregando' | 'vazio' | 'erro';

export default function Exemplo() {
  const [estado, setEstado] = useState<Estado | null>('vazio');

  return (
    <div className="demo-pilha-p">
      <Escolha<Estado>
        ariaLabel="Estado da tabela"
        valor={estado}
        aoMudar={setEstado}
        opcoes={[
          { valor: 'carregando', rotulo: 'Carregando' },
          { valor: 'vazio', rotulo: 'Vazia' },
          { valor: 'erro', rotulo: 'Erro' },
        ]}
      />
      <Tabela
        rotulo="Pedidos"
        colunas={COLUNAS}
        registros={estado === 'vazio' ? [] : PEDIDOS.slice(0, 3)}
        carregando={estado === 'carregando'}
        erro={estado === 'erro' ? 'Não foi possível carregar os pedidos.' : undefined}
        aoRecarregar={() => setEstado('vazio')}
        vazioTitulo="Nenhum pedido encontrado"
        vazioDescricao="Ajuste os filtros ou cadastre um pedido novo."
        vazioAcoes={<Botao rotulo="Novo pedido" icone="plus" tamanho="pequeno" />}
      />
    </div>
  );
}
