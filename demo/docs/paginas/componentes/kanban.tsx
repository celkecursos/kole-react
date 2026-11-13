import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Kanban"
      icone="square-kanban"
      componente="Kanban"
      outros={['CartaoKanban', 'SeloPrioridade', 'SeloPrazo', 'Etiqueta']}
      tipos={['ColunaKanban', 'EtiquetaKanban', 'ContagemSubtarefas', 'SoltarItem']}
      importar={['CartaoKanban', 'type ColunaKanban']}
      resumo="Quadro kanban pronto: colunas com cor, contagem, limite e menu (renomear, recolher, excluir), cartões que se arrastam entre colunas, adicionar cartão e coluna, rolagem horizontal e tela vazia. O app guarda os dados; o quadro mostra e avisa as mudanças."
      notas={
        <ul className="doc-lista">
          <li>
            Montado sobre o <C>QuadroArrastavel</C>: mouse, toque e teclado (na alça, Espaço pega e solta, setas movem, Esc cancela). Ao soltar,
            <C>aoMudar</C> recebe as colunas e <C>aoSoltar</C> o movimento (<C>item</C>, <C>de</C>, <C>para</C>) para gravar no servidor.
          </li>
          <li>
            Cada ação aparece quando o callback dela é passado: <C>aoAdicionarCartao</C>, <C>aoAdicionarColuna</C>, <C>aoRenomearColuna</C>,
            <C>aoRecolherColuna</C>, <C>aoExcluirColuna</C> e <C>aoSoltarColuna</C> (liga o arraste das colunas). <C>acoesColuna</C> acrescenta
            itens ao menu.
          </li>
          <li>
            O quadro não pergunta antes de excluir: confirme no app, com <C>useConfirmacao</C>, como no exemplo.
          </li>
          <li>
            <C>limite</C> numa coluna: cheia, ela não aceita mais cartões (nem pelo arraste, nem pelo "Adicionar cartão") e a contagem fica
            laranja; acima do limite, vermelha. <C>podeSoltar</C> soma regras suas.
          </li>
          <li>
            <C>filtro</C> esconde cartões (busca, etiquetas, responsáveis) e a contagem vira "2 de 5". O arraste continua valendo com o filtro
            ligado: os escondidos ficam onde estavam.
          </li>
          <li>
            <C>altura</C> fixa o tamanho do quadro e cada coluna rola por dentro; sem ela, as colunas crescem com os cartões. Durante o
            arraste, a tela rola sozinha perto das bordas.
          </li>
          <li>
            <C>CartaoKanban</C> é o cartão padrão: <C>capa</C>, <C>etiquetas</C>, <C>prioridade</C>, <C>vencimento</C> (atrasado em vermelho,
            hoje e em breve em laranja, verde quando <C>concluido</C>), <C>subtarefas</C>, <C>anexos</C>, <C>comentarios</C> e
            <C>responsaveis</C>. <C>extra</C> é livre (ex.: valor e empresa num funil de vendas). Com <C>aoAbrir</C>, o cartão inteiro abre o
            detalhe e o título vira o botão acessível.
          </li>
          <li>
            Prioridade: <C>baixa</C>, <C>media</C>, <C>alta</C> e <C>critica</C> (<C>PRIORIDADES</C> traz rótulo e cor para montar um select).
            Cores de coluna e etiqueta: <C>pri</C>, <C>ok</C>, <C>warn</C>, <C>err</C>, <C>info</C>, <C>destaque</C>, <C>neutro</C> e
            <C>graf-1</C> a <C>graf-6</C>.
          </li>
          <li>
            A demo traz as telas completas: listagem de quadros com favoritos, quadro com filtros e detalhe do cartão em diálogo (menu
            Aplicativos › Kanban).
          </li>
        </ul>
      }
    >
      <Exemplo id="kanban/Basico" titulo="Quadro com ações e limite" />
      <Exemplo id="kanban/Cartoes" titulo="Cartões" />
      <Exemplo id="kanban/Filtros" titulo="Busca, filtro, regra de destino e altura fixa" />
    </PaginaComponente>
  );
}
