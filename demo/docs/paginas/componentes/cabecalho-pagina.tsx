import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="cabecalhoPagina"
      icone="panel-right"
      componente="CabecalhoPagina"
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
