import { useState } from 'react';
import { CartaoKanban, Kanban, useConfirmacao, useToast, type ColunaKanban, type Prioridade } from '../../../../src';

interface Cartao {
  id: string;
  titulo: string;
  prioridade?: Prioridade;
  vencimento?: string;
}

const INICIAL: ColunaKanban<Cartao>[] = [
  {
    id: 'fazer',
    titulo: 'A fazer',
    cor: 'neutro',
    itens: [
      { id: '1', titulo: 'Conferir o estoque', prioridade: 'media' },
      { id: '2', titulo: 'Emitir as notas do dia', prioridade: 'alta' },
    ],
  },
  { id: 'andamento', titulo: 'Em andamento', cor: 'info', limite: 2, itens: [{ id: '3', titulo: 'Responder os clientes' }] },
  { id: 'feito', titulo: 'Concluído', cor: 'ok', itens: [] },
];

let seq = 10;

export default function Exemplo() {
  const [colunas, setColunas] = useState(INICIAL);
  const confirmar = useConfirmacao();
  const toast = useToast();
  const mudar = (id: string, f: (c: ColunaKanban<Cartao>) => ColunaKanban<Cartao>) => setColunas((cs) => cs.map((c) => (c.id === id ? f(c) : c)));

  return (
    <Kanban
      colunas={colunas}
      // durante o arraste o quadro mostra a prévia; aoMudar chega uma vez, ao soltar
      aoMudar={setColunas}
      // grave no servidor aqui: o cartão, de onde saiu e para onde foi
      aoSoltar={({ item, para }) => toast.info(`${item.titulo} → ${para.coluna}, posição ${para.indice + 1}`)}
      aoSoltarColuna={({ coluna, para }) => toast.info(`Coluna ${coluna.titulo} na posição ${para + 1}`)}
      nomeItem={(c) => c.titulo}
      renderCartao={(c, alca) => <CartaoKanban titulo={c.titulo} prioridade={c.prioridade} vencimento={c.vencimento} alca={alca} />}
      aoAdicionarCartao={(colunaId, titulo) => mudar(colunaId, (c) => ({ ...c, itens: [...c.itens, { id: String(++seq), titulo }] }))}
      aoAdicionarColuna={(titulo) => setColunas((cs) => [...cs, { id: `col-${++seq}`, titulo, itens: [] }])}
      aoRenomearColuna={(id, titulo) => mudar(id, (c) => ({ ...c, titulo }))}
      aoRecolherColuna={(id, recolhida) => mudar(id, (c) => ({ ...c, recolhida }))}
      aoExcluirColuna={async (id) => {
        const col = colunas.find((c) => c.id === id)!;
        if (await confirmar.remover({ titulo: `Excluir a coluna "${col.titulo}"?`, rotuloAceitar: 'Excluir' }))
          setColunas((cs) => cs.filter((c) => c.id !== id));
      }}
    />
  );
}
