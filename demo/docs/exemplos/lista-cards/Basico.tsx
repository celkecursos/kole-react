import { useState } from 'react';
import { Badge, Card, ListaCards } from '../../../../src';
import { PEDIDOS } from '../tabela/dados';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Exemplo() {
  const [pagina, setPagina] = useState(1);
  const tamanho = 6;

  return (
    <ListaCards
      rotulo="Pedidos"
      itens={PEDIDOS.slice((pagina - 1) * tamanho, pagina * tamanho)}
      larguraMin="14rem"
      card={(p) => (
        <Card titulo={p.numero} subtitulo={p.cliente} ferramentas={<Badge rotulo={p.situacao} cor={p.situacao === 'Pago' ? 'ok' : 'warn'} aparencia="suave" />}>
          <strong>{BRL.format(p.total)}</strong>
        </Card>
      )}
      paginacao={{ total: PEDIDOS.length, pagina, tamanho, aoMudarPagina: setPagina }}
    />
  );
}
