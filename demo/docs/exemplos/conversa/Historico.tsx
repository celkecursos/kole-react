import { useState } from 'react';
import { ListaConversas, type ItemConversa } from '../../../../src';

const hoje = new Date();
const dias = (n: number) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - n, 10);

export default function Exemplo() {
  const [itens, setItens] = useState<ItemConversa[]>([
    { id: 1, titulo: 'Vendas de outubro por região', data: dias(0) },
    { id: 2, titulo: 'Pedidos atrasados da semana', data: dias(0) },
    { id: 3, titulo: 'E-mail de cobrança', data: dias(1) },
    { id: 4, titulo: 'Metas do trimestre', data: dias(12), fixada: true },
    { id: 5, titulo: 'Política de devolução', data: dias(20) },
  ]);
  const [ativa, setAtiva] = useState<ItemConversa['id'] | null>(1);
  const mudar = (id: ItemConversa['id'], m: Partial<ItemConversa>) => setItens((l) => l.map((i) => (i.id === id ? { ...i, ...m } : i)));

  return (
    <div style={{ height: '26rem', maxWidth: '18rem' }}>
      <ListaConversas
        itens={itens}
        ativa={ativa}
        aoEscolher={setAtiva}
        aoNova={() => setAtiva(null)}
        aoRenomear={(id, titulo) => mudar(id, { titulo })}
        aoFixar={(id, fixada) => mudar(id, { fixada })}
        aoExcluir={(id) => setItens((l) => l.filter((i) => i.id !== id))}
      />
    </div>
  );
}
