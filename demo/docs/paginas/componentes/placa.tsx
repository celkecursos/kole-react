import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="placa"
      icone="truck"
      componente="Placa"
      notas={
        <ul className="doc-lista">
          <li>
            O <C>numero</C> sai sempre em maiúsculas. Para digitar a placa, use o <C>CampoPlaca</C>.
          </li>
          <li>
            O leitor de tela anuncia "Placa BRA2E19, PR" (<C>role="img"</C> com <C>aria-label</C>), sem soletrar a faixa azul.
          </li>
        </ul>
      }
    >
      <Exemplo id="placa/Basico" titulo="Básico" />
    </PaginaComponente>
  );
}
