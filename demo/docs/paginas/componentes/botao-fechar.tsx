import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="botaoFechar"
      icone="x"
      componente="BotaoFechar"
      notas={
        <ul className="doc-lista">
          <li>
            O <C>rotulo</C> (padrão "Fechar") vira o <C>aria-label</C>; troque quando houver mais de um na tela ("Fechar aviso").
          </li>
          <li>
            <C>Dialogo</C>, <C>Card</C> e <C>Alerta</C> já trazem o próprio botão: use este só em componentes do app.
          </li>
        </ul>
      }
    >
      <Exemplo id="botao-fechar/Basico" titulo="Variantes" />
    </PaginaComponente>
  );
}
