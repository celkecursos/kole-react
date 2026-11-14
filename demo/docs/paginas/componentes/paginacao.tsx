import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="paginacao"
      icone="chevrons-right"
      componente="Paginacao"
      notas={
        <ul className="doc-lista">
          <li>
            A <C>Tabela</C> e a <C>ListaCards</C> já desenham a paginação pela prop <C>paginacao</C>: use este componente sozinho só em
            outras listas.
          </li>
          <li>
            <C>pagina</C> começa em 1. Ao mudar o tamanho, volte para a primeira página.
          </li>
          <li>
            Sem <C>aoMudarTamanho</C>, a escolha de itens por página não aparece.
          </li>
        </ul>
      }
    >
      <Exemplo id="paginacao/Basico" titulo="Básico" />
    </PaginaComponente>
  );
}
