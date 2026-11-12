import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Status"
      icone="circle-check"
      componente="Status"
      resumo="Selo da situação de um registro: pago, em análise, cancelado. Cor e ícone vêm da severidade."
      notas={
        <ul className="doc-lista">
          <li>
            Na <C>Tabela</C>, a prop <C>severidade</C> da coluna desenha este selo sem precisar de <C>render</C>.
          </li>
          <li>
            Status é situação (estado do registro); <C>Badge</C> é etiqueta (categoria, contagem, novidade).
          </li>
          <li>Mantenha a mesma severidade para a mesma situação em todo o sistema.</li>
        </ul>
      }
    >
      <Exemplo id="status/Basico" titulo="Severidades" />
    </PaginaComponente>
  );
}
