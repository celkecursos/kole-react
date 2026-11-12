import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Menu suspenso"
      icone="chevron-down"
      componente="MenuSuspenso"
      tipos={['ItemMenuSuspenso']}
      importar={['type ItemMenuSuspenso']}
      resumo="Um botão que abre uma lista de ações. Aceita títulos, divisores, atalhos, links e o modo dividido."
      notas={
        <ul className="doc-lista">
          <li>
            Abre com clique, Enter ou seta para baixo; as setas percorrem os itens e Esc fecha devolvendo o foco ao botão.
          </li>
          <li>
            Item com <C>href</C> vira link. <C>tipo: 'titulo'</C> e <C>tipo: 'divisor'</C> organizam listas longas.
          </li>
          <li>
            Para um gatilho próprio (avatar, card), use a prop <C>gatilho</C>, que recebe as props de acessibilidade para espalhar no
            elemento.
          </li>
        </ul>
      }
    >
      <Exemplo id="menu-suspenso/Basico" titulo="Básico" />
      <Exemplo id="menu-suspenso/Dividido" titulo="Botão dividido" />
    </PaginaComponente>
  );
}
