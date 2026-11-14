import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="balao"
      icone="message-square"
      componente="Balao"
      notas={
        <ul className="doc-lista">
          <li>
            Com o gatilho padrão (<C>clique</C>), o balão fica aberto até clicar fora ou apertar Esc.
          </li>
          <li>
            Frase curta que só nomeia o botão é <C>Dica</C>; ações e formulários pedem <C>MenuSuspenso</C> ou <C>Dialogo</C>.
          </li>
          <li>
            O balão troca de lado sozinho quando não cabe na <C>posicao</C> pedida.
          </li>
        </ul>
      }
    >
      <Exemplo id="balao/Basico" titulo="Clique e passar" />
    </PaginaComponente>
  );
}
