import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Picklist"
      icone="arrow-up-down"
      componente="Picklist"
      importar={['type PicklistValor']}
      resumo="Duas listas lado a lado para mover itens de uma para a outra: permissões, colunas visíveis, membros de um grupo."
      notas={
        <ul className="doc-lista">
          <li>
            O valor guarda as duas listas: <C>{'{ fonte, alvo }'}</C>. A ordem do alvo é a que a pessoa deixou.
          </li>
          <li>Clique seleciona (Ctrl para vários), duplo clique ou Enter move, e também dá para arrastar. Alt + setas reordena.</li>
          <li>
            Para objetos, passe <C>paraRotulo</C> (e <C>renderItem</C> para um item mais rico).
          </li>
        </ul>
      }
    >
      <Exemplo id="picklist/Basico" titulo="Básico com filtro" />
    </PaginaComponente>
  );
}
