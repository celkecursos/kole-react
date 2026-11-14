import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="chip"
      icone="tag"
      componente="Chip"
      notas={
        <ul className="doc-lista">
          <li>
            Com <C>aoRemover</C>, aparece o botão ×, com nome acessível "Remover" seguido do filtro.
          </li>
          <li>
            Os <C>Filtros</C> já desenham os chips pela prop <C>aplicados</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="chip/Basico" titulo="Removíveis" />
    </PaginaComponente>
  );
}
