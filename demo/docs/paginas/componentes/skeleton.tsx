import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="skeleton"
      icone="square"
      componente="Skeleton"
      notas={
        <ul className="doc-lista">
          <li>
            É decorativo (<C>aria-hidden</C>): anuncie a espera de outro jeito, como <C>aria-busy</C> na área ou um <C>Girador</C>.
          </li>
          <li>Faça a silhueta do tamanho do conteúdo real: mesmo número de linhas, mesma altura.</li>
          <li>
            <C>Tabela</C> e <C>ListaCards</C> já mostram silhuetas com <C>carregando</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="skeleton/Basico" titulo="Cartão carregando" />
    </PaginaComponente>
  );
}
