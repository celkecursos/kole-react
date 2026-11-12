import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Escolha"
      icone="list"
      componente="Escolha"
      resumo="Uma opção entre poucas, todas à vista: controle segmentado ou grupo de rádios."
      notas={
        <ul className="doc-lista">
          <li>Segmentado para duas a quatro opções curtas; rádio para textos maiores ou quando cada opção precisa de explicação.</li>
          <li>
            As setas mudam a opção (padrão de <C>radiogroup</C>), e Tab entra e sai do grupo de uma vez.
          </li>
          <li>
            Com mais de cinco opções, o <C>CampoSelect</C> ocupa menos espaço.
          </li>
        </ul>
      }
    >
      <Exemplo id="escolha/Basico" titulo="Segmentado e rádio" />
    </PaginaComponente>
  );
}
