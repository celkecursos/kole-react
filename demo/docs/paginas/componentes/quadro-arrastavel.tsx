import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Quadro arrastável"
      icone="grip-vertical"
      componente="QuadroArrastavel"
      importar={['type ColunaArrastavel']}
      resumo="Colunas de itens que se reordenam e trocam de coluna arrastando (kanban), também pelo teclado."
      notas={
        <ul className="doc-lista">
          <li>
            Arraste pela alça. No teclado: foque a alça, espaço pega e solta, as setas movem e Esc cancela. Cada movimento é anunciado
            ao leitor de tela, com o <C>nomeItem</C>.
          </li>
          <li>
            O quadro é controlado: <C>aoMudar</C> recebe as colunas na nova ordem, e o app grava.
          </li>
          <li>
            Os itens precisam de <C>id</C> único entre todas as colunas.
          </li>
        </ul>
      }
    >
      <Exemplo id="quadro-arrastavel/Basico" titulo="Kanban" />
    </PaginaComponente>
  );
}
