import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Recolhível"
      icone="chevron-down"
      componente="Recolhivel"
      resumo="Só a animação de abrir e fechar, para qualquer conteúdo: o app decide o botão e o estado."
      notas={
        <ul className="doc-lista">
          <li>
            Ligue o botão ao conteúdo: <C>aria-expanded</C> no botão e <C>aria-controls</C> apontando para o <C>id</C> do recolhível.
          </li>
          <li>
            Fechado, o conteúdo fica <C>inert</C>: sai do Tab e do leitor de tela.
          </li>
          <li>
            Para várias seções com título, o <C>Acordeao</C> já traz o botão pronto.
          </li>
        </ul>
      }
    >
      <Exemplo id="recolhivel/Basico" titulo="Com botão" />
    </PaginaComponente>
  );
}
