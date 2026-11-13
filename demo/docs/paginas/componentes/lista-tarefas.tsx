import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Lista de tarefas"
      icone="list-todo"
      componente="ListaTarefas"
      tipos={['TarefaLista', 'ReordenarTarefa']}
      importar={['type TarefaLista']}
      resumo="Tarefas em linhas: marcar como feita, situação, prioridade, prazo, etiquetas, subtarefas e responsáveis; clicar abre o detalhe e a alça reordena arrastando (mouse, toque e teclado)."
      notas={
        <ul className="doc-lista">
          <li>
            Controlada: <C>aoConcluir</C> recebe a tarefa e o novo estado; <C>aoReordenar</C> recebe a lista inteira na ordem nova, ao soltar
            (sem ele, não há alça).
          </li>
          <li>
            <C>filtro</C> faz as visões (Hoje, Atrasadas, uma lista, uma etiqueta): as tarefas escondidas guardam o lugar, e reordenar as
            visíveis não bagunça a ordem delas.
          </li>
          <li>
            <C>concluida</C> vale sobre <C>situacao</C>; <C>situacao</C> "Em andamento" e "Bloqueada" aparecem como selo. O prazo segue as
            cores do <C>SeloPrazo</C> e fica verde na tarefa feita.
          </li>
          <li>
            Com <C>aoAbrir</C>, a linha inteira abre o detalhe (em geral um <C>Dialogo</C> com <C>aparencia="lateral"</C>) e
            <C>selecionada</C> destaca a tarefa aberta.
          </li>
          <li>
            A demo traz a tela completa: visões, listas e etiquetas na lateral, filtros de prazo e painel de detalhe (menu Aplicativos ›
            Tarefas).
          </li>
        </ul>
      }
    >
      <Exemplo id="lista-tarefas/Basico" titulo="Concluir, reordenar e visões" />
    </PaginaComponente>
  );
}
