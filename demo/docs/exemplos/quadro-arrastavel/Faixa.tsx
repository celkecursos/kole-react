import { useState } from 'react';
import { Card, QuadroArrastavel, type ColunaArrastavel } from '../../../../src';

interface Item {
  id: string;
  nome: string;
}

const INICIAL: ColunaArrastavel<Item>[] = [
  { id: 'entrada', titulo: 'Entrada', itens: [{ id: 'a', nome: 'Pedido 1042' }, { id: 'b', nome: 'Pedido 1043' }, { id: 'c', nome: 'Pedido 1044' }] },
  { id: 'separacao', titulo: 'Separação', itens: [{ id: 'd', nome: 'Pedido 1040' }] },
  { id: 'envio', titulo: 'Envio', itens: [] },
  { id: 'entregue', titulo: 'Entregue', itens: [{ id: 'e', nome: 'Pedido 1031' }] },
];

export default function Exemplo() {
  const [colunas, setColunas] = useState(INICIAL);
  const [log, setLog] = useState('Arraste um pedido ou uma coluna.');

  return (
    <div className="demo-pilha">
      <QuadroArrastavel
        layout="faixa"
        larguraColuna="13rem"
        colunas={colunas}
        aoMudar={setColunas}
        // uma vez, ao soltar: o que o servidor precisa para gravar
        aoSoltar={({ item, de, para }) => setLog(`${item.nome}: ${de.coluna} → ${para.coluna} (posição ${para.indice + 1})`)}
        // regra de destino: o que foi entregue não volta
        podeSoltar={(_item, para, de) => de.coluna !== 'entregue' || para.coluna === 'entregue'}
        colunasArrastaveis
        aoSoltarColuna={({ coluna, para }) => setLog(`Coluna ${coluna.titulo} na posição ${para + 1}`)}
        cabecalhoColuna={(c, alca) => (
          <strong className="demo-linha">
            {alca}
            {c.titulo} ({c.itens.length})
          </strong>
        )}
        nomeItem={(i) => i.nome}
        renderItem={(i, alca) => (
          <Card titulo={i.nome} ferramentas={alca}>
            Cliente final
          </Card>
        )}
      />
      <small aria-live="polite">{log}</small>
    </div>
  );
}
