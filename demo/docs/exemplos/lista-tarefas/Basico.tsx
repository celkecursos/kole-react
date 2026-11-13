import { useState } from 'react';
import { FiltroPilulas, ListaTarefas, situacaoPrazo, type TarefaLista } from '../../../../src';

const dia = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const INICIAL: TarefaLista[] = [
  { id: '1', titulo: 'Revisar o layout da página inicial', situacao: 'andamento', prioridade: 'alta', vencimento: dia(0), etiquetas: [{ rotulo: 'Design', cor: 'graf-4' }], responsaveis: [{ nome: 'Ana Souza' }], subtarefas: { feitas: 2, total: 4 } },
  { id: '2', titulo: 'Pagar a fatura da hospedagem', prioridade: 'alta', vencimento: dia(-1), etiquetas: [{ rotulo: 'Financeiro', cor: 'graf-5' }] },
  { id: '3', titulo: 'Configurar o certificado do domínio', situacao: 'bloqueada', prioridade: 'media', vencimento: dia(2), responsaveis: [{ nome: 'Diego Rocha' }] },
  { id: '4', titulo: 'Agendar a revisão do carro', prioridade: 'baixa', vencimento: dia(9) },
  { id: '5', titulo: 'Enviar o relatório semanal', concluida: true, vencimento: dia(-2), responsaveis: [{ nome: 'Ana Souza' }] },
];

export default function Exemplo() {
  const [tarefas, setTarefas] = useState(INICIAL);
  const [visao, setVisao] = useState<'todas' | 'pendentes' | 'atrasadas'>('todas');
  const [aberta, setAberta] = useState<string>();

  return (
    <div className="demo-pilha">
      <FiltroPilulas
        rotulo="Visão"
        valor={visao}
        aoMudar={setVisao}
        opcoes={[
          { valor: 'todas', rotulo: 'Todas' },
          { valor: 'pendentes', rotulo: 'Pendentes' },
          { valor: 'atrasadas', rotulo: 'Atrasadas' },
        ]}
      />
      <ListaTarefas
        tarefas={tarefas}
        filtro={
          visao === 'todas'
            ? undefined
            : (t) => !t.concluida && (visao === 'pendentes' || (!!t.vencimento && situacaoPrazo(t.vencimento).situacao === 'atrasado'))
        }
        aoConcluir={(t, concluida) => setTarefas((ts) => ts.map((x) => (x.id === t.id ? { ...x, concluida } : x)))}
        // a lista na ordem nova, ao soltar (grave a ordem no servidor aqui)
        aoReordenar={setTarefas}
        aoAbrir={(t) => setAberta(t.id)}
        selecionada={aberta}
        vazioTitulo="Nada por aqui"
        vazioDescricao="Nenhuma tarefa nesta visão."
      />
    </div>
  );
}
