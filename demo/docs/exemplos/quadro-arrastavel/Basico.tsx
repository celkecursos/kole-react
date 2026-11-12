import { useState } from 'react';
import { Card, QuadroArrastavel, type ColunaArrastavel } from '../../../../src';

interface Tarefa {
  id: string;
  nome: string;
  responsavel: string;
}

const INICIAL: ColunaArrastavel<Tarefa>[] = [
  {
    id: 'fazer',
    titulo: 'A fazer',
    itens: [
      { id: '1', nome: 'Conferir estoque', responsavel: 'Ana' },
      { id: '2', nome: 'Emitir notas do dia', responsavel: 'Carlos' },
    ],
  },
  { id: 'andamento', titulo: 'Em andamento', itens: [{ id: '3', nome: 'Responder clientes', responsavel: 'Beatriz' }] },
  { id: 'feito', titulo: 'Feito', itens: [] },
];

export default function Exemplo() {
  const [colunas, setColunas] = useState(INICIAL);

  return (
    <QuadroArrastavel
      colunas={colunas}
      aoMudar={setColunas}
      nomeItem={(t) => t.nome}
      // alca = o botão de arrastar; coloque onde quiser no item
      renderItem={(t, alca) => (
        <Card titulo={t.nome} ferramentas={alca}>
          {t.responsavel}
        </Card>
      )}
    />
  );
}
