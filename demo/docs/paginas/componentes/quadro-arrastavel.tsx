import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Quadro arrastável"
      icone="grip-vertical"
      componente="QuadroArrastavel"
      tipos={['ColunaArrastavel', 'PosicaoQuadro', 'SoltarItem', 'SoltarColuna']}
      importar={['type ColunaArrastavel']}
      resumo="Colunas de itens que se reordenam e trocam de coluna arrastando, também pelo teclado. É a base do Kanban e da ListaTarefas."
      notas={
        <ul className="doc-lista">
          <li>
            Arraste pela alça. No teclado: foque a alça, espaço pega e solta, as setas movem e Esc cancela. Cada movimento é anunciado
            ao leitor de tela, com o <C>nomeItem</C>.
          </li>
          <li>
            O quadro é controlado: durante o arraste ele mostra uma prévia, e ao soltar <C>aoMudar</C> recebe as colunas na nova ordem
            (uma vez só). <C>aoSoltar</C> chega junto, com o item, de onde saiu e para onde foi: é o que o servidor precisa para gravar. Esc
            durante o arraste (mouse ou teclado) devolve tudo ao lugar, sem chamar nenhum dos dois.
          </li>
          <li>
            <C>podeSoltar</C> recusa destinos (a coluna fica com contorno vermelho e o item não entra); no teclado, as setas pulam as colunas
            recusadas. <C>visivel</C> esconde itens (busca, filtros) sem tirá-los do lugar.
          </li>
          <li>
            <C>layout="faixa"</C> põe as colunas lado a lado com rolagem horizontal. Perto da borda do quadro, de uma coluna que rola ou da
            janela, a tela rola sozinha durante o arraste.
          </li>
          <li>
            <C>colunasArrastaveis</C> dá uma alça a cada coluna (no <C>cabecalhoColuna</C>, ou no topo padrão com o título); setas ←→ movem pelo
            teclado e <C>aoSoltarColuna</C> avisa a ordem nova.
          </li>
          <li>
            Os itens precisam de <C>id</C> único entre todas as colunas.
          </li>
        </ul>
      }
    >
      <Exemplo id="quadro-arrastavel/Basico" titulo="Grade simples" />
      <Exemplo id="quadro-arrastavel/Faixa" titulo="Faixa, regras de destino e colunas arrastáveis" />
    </PaginaComponente>
  );
}
