import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="lista"
      icone="list"
      componente="Lista"
      outros={['ItemLista']}
      notas={
        <ul className="doc-lista">
          <li>
            Item com <C>onClick</C> vira botão, e com <C>href</C>, link: os dois entram no Tab.
          </li>
          <li>
            Com <C>marcacao</C>, o item inteiro é o rótulo do input. No rádio, passe o mesmo <C>nome</C> em todos os itens.
          </li>
          <li>
            <C>numerada</C> usa <C>{'<ol>'}</C>; <C>horizontal</C> deita a lista a partir de uma largura (<C>sm</C> a <C>xl</C>).
          </li>
        </ul>
      }
    >
      <Exemplo id="lista/Basico" titulo="Itens, ativo e desabilitado" />
      <Exemplo id="lista/Marcacao" titulo="Com caixa e rádio" />
    </PaginaComponente>
  );
}
