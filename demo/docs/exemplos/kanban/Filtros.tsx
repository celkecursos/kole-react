import { useState } from 'react';
import { CampoTexto, CartaoKanban, Escolha, Kanban, normalizar, type ColunaKanban, type EtiquetaKanban } from '../../../../src';

interface Chamado {
  id: string;
  titulo: string;
  etiqueta: EtiquetaKanban;
}

const BUG: EtiquetaKanban = { rotulo: 'Bug', cor: 'err' };
const DUVIDA: EtiquetaKanban = { rotulo: 'Dúvida', cor: 'info' };

const INICIAL: ColunaKanban<Chamado>[] = [
  {
    id: 'novos',
    titulo: 'Novos',
    itens: [
      { id: '1', titulo: 'Erro ao emitir boleto', etiqueta: BUG },
      { id: '2', titulo: 'Como trocar a senha?', etiqueta: DUVIDA },
      { id: '3', titulo: 'Relatório em branco', etiqueta: BUG },
      { id: '4', titulo: 'Onde vejo as notas?', etiqueta: DUVIDA },
    ],
  },
  { id: 'atendimento', titulo: 'Em atendimento', itens: [{ id: '5', titulo: 'Importar planilha de clientes', etiqueta: DUVIDA }] },
  // só aceita bugs (regra de podeSoltar)
  { id: 'dev', titulo: 'Com o desenvolvimento', cor: 'err', itens: [] },
  { id: 'resolvidos', titulo: 'Resolvidos', cor: 'ok', itens: [] },
];

export default function Exemplo() {
  const [colunas, setColunas] = useState(INICIAL);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('todos');
  const termo = normalizar(busca);
  const filtrando = !!termo || tipo !== 'todos';

  return (
    <div className="demo-pilha">
      <div className="demo-linha">
        <CampoTexto icone="search" placeholder="Buscar chamado" aria-label="Buscar chamado" valor={busca} aoMudar={setBusca} />
        <Escolha
          ariaLabel="Tipo"
          opcoes={[
            { valor: 'todos', rotulo: 'Todos' },
            { valor: 'Bug', rotulo: 'Bugs' },
            { valor: 'Dúvida', rotulo: 'Dúvidas' },
          ]}
          valor={tipo}
          aoMudar={setTipo}
        />
      </div>
      <Kanban
        colunas={colunas}
        aoMudar={setColunas}
        nomeItem={(c) => c.titulo}
        // os escondidos continuam no lugar: arrastar os visíveis não bagunça a ordem deles
        filtro={filtrando ? (c) => (!termo || normalizar(c.titulo).includes(termo)) && (tipo === 'todos' || c.etiqueta.rotulo === tipo) : undefined}
        podeSoltar={(c, para) => para.coluna !== 'dev' || c.etiqueta === BUG}
        larguraColuna="15rem"
        // altura fixa: cada coluna rola por dentro e a tela rola sozinha ao arrastar perto da borda
        altura="20rem"
        renderCartao={(c, alca) => <CartaoKanban titulo={c.titulo} etiquetas={[c.etiqueta]} alca={alca} />}
      />
    </div>
  );
}
