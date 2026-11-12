import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Cabeçalho de página"
      icone="panel-right"
      componente="CabecalhoPagina"
      resumo="O topo de cada página: título com ícone, categoria, trilha de navegação, texto de apoio e as ações principais."
      notas={
        <ul className="doc-lista">
          <li>
            O título é o <C>{'<h1>'}</C> da página: use um cabeçalho por página.
          </li>
          <li>
            <C>trilha</C> = <C>true</C> monta o caminho pelo menu da <C>Estrutura</C>; uma lista acrescenta passos no fim (o registro
            aberto).
          </li>
          <li>
            As <C>acoes</C> descem para baixo do título em telas estreitas.
          </li>
        </ul>
      }
    >
      <Exemplo id="cabecalho-pagina/Basico" titulo="Completo" />
    </PaginaComponente>
  );
}
