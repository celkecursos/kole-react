import { useState } from 'react';
import { Badge, CampoPesquisa, CardConteudo, FiltroPilulas, Newsletter, useToast } from '../../../../src';

export default function Exemplo() {
  const toast = useToast();
  const [busca, setBusca] = useState('');
  const [tema, setTema] = useState('todos');

  return (
    <div className="demo-pilha">
      <CampoPesquisa valor={busca} aoMudar={setBusca} aoPesquisar={(t) => toast.info('Pesquisar', t)} placeholder="Pesquisar no blog" />
      <FiltroPilulas
        rotulo="Tema"
        valor={tema}
        aoMudar={setTema}
        opcoes={[
          { valor: 'todos', rotulo: 'Todos' },
          { valor: 'vendas', rotulo: 'Vendas' },
          { valor: 'estoque', rotulo: 'Estoque' },
        ]}
      />
      <div className="demo-grade-2">
        <CardConteudo titulo="Como reduzir a ruptura de estoque" resumo="Cinco passos simples para não perder venda." etiquetas={<Badge rotulo="Estoque" aparencia="suave" />} href="#" />
        <CardConteudo formato="horizontal" titulo="Pix na loja física" resumo="O que muda no caixa." href="#" />
      </div>
      <Newsletter aoInscrever={(email) => void toast.ok('Inscrito', email)} descricao="Uma dica de gestão por semana." />
    </div>
  );
}
