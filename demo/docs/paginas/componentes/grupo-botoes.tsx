import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Grupo de botões"
      icone="layout-grid"
      componente="GrupoBotoes"
      outros={['BarraBotoes']}
      importar={['GrupoAlternancia']}
      resumo="Botões colados num bloco (GrupoBotoes), alinhados numa barra (BarraBotoes) ou funcionando como seletor (GrupoAlternancia)."
      notas={
        <ul className="doc-lista">
          <li>
            Sempre passe <C>rotulo</C>: vira o nome do grupo para leitor de tela (<C>role="group"</C>).
          </li>
          <li>
            <C>GrupoAlternancia</C> recebe <C>opcoes</C>, <C>valor</C> e <C>aoMudar</C>; com <C>multiplo</C>, o valor é uma lista. Cada
            botão marca <C>aria-pressed</C>.
          </li>
          <li>
            Para escolher uma opção num formulário, a <C>Escolha</C> tem rótulo, erro e validação de campo.
          </li>
        </ul>
      }
    >
      <Exemplo id="grupo-botoes/Grupo" titulo="Grupo">
        Os botões de dentro herdam <C>severidade</C>, <C>aparencia</C>, <C>formato</C> e <C>tamanho</C>, e cada um pode sobrescrever.
      </Exemplo>
      <Exemplo id="grupo-botoes/Alternancia" titulo="Alternância" />
      <Exemplo id="grupo-botoes/Barra" titulo="Barra de botões" />
    </PaginaComponente>
  );
}
