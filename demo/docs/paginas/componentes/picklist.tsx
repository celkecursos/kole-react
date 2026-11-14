import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="picklist"
      icone="arrow-up-down"
      componente="Picklist"
      importar={['type PicklistValor']}
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
