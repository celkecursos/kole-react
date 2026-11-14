import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="dica"
      icone="circle-question-mark"
      componente="Dica"
      notas={
        <ul className="doc-lista">
          <li>
            Envolva um único elemento focável (botão, link). A dica é só visual (<C>aria-hidden</C>): o nome acessível precisa estar no
            próprio elemento, por <C>aria-label</C> ou texto.
          </li>
          <li>Aparece no hover e no foco do teclado; Esc esconde. Em botão desabilitado, a dica continua acessível pelo Tab.</li>
          <li>
            Nada de conteúdo interativo dentro da dica: para isso, use o <C>Balao</C>, que abre no clique.
          </li>
        </ul>
      }
    >
      <Exemplo id="dica/Basico" titulo="Posições" />
    </PaginaComponente>
  );
}
