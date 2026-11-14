import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="campoBusca"
      icone="search"
      componente="CampoBusca"
      notas={
        <ul className="doc-lista">
          <li>
            <C>buscar</C> devolve uma Promise. O campo espera a digitação parar (<C>atraso</C>) e descarta respostas que chegam fora de
            ordem.
          </li>
          <li>
            <C>paraRotulo</C> é o texto do item escolhido; <C>paraDetalhe</C>, a linha menor de cada sugestão.
          </li>
          <li>
            Texto digitado sem escolher uma sugestão não vira valor: o campo continua <C>null</C>.
          </li>
          <li>
            Para opções fixas e poucas, o <C>CampoSelect</C> com <C>comBusca</C> é mais simples.
          </li>
        </ul>
      }
    >
      <Exemplo id="campo-busca/Basico" titulo="Básico">
        Digite "mer" para ver as sugestões. A resposta do servidor é simulada com 400 ms de atraso.
      </Exemplo>
    </PaginaComponente>
  );
}
