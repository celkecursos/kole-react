import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="trilha"
      icone="chevrons-right"
      componente="Trilha"
      importar={['type ItemTrilha']}
      notas={
        <ul className="doc-lista">
          <li>
            Dentro da <C>Estrutura</C>, prefira <C>{'<CabecalhoPagina trilha />'}</C>, que monta o caminho pelo menu.
          </li>
          <li>
            O último item é a página atual: sem <C>rota</C>, com <C>aria-current="page"</C>.
          </li>
          <li>
            A aparência pode valer para o sistema todo pela prop <C>modeloTrilha</C> da <C>Estrutura</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="trilha/Basico" titulo="Separadores e aparências" />
    </PaginaComponente>
  );
}
