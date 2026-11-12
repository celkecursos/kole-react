import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Busca global"
      icone="search"
      componente="Busca"
      importar={['type ItemBusca']}
      resumo="A busca do topo do sistema: encontra páginas do menu enquanto digita e, com Enter, busca no servidor. Abre com Ctrl K."
      notas={
        <ul className="doc-lista">
          <li>
            A <C>Estrutura</C> já traz esta busca, alimentada pelos itens do <C>nav</C>: use o componente sozinho só fora dela.
          </li>
          <li>
            Só pode haver um atalho Ctrl K por tela; numa segunda busca, passe <C>{'atalho={false}'}</C>.
          </li>
          <li>
            A busca ignora acentos e caixa: "relatorio" encontra "Relatórios".
          </li>
        </ul>
      }
    >
      <Exemplo id="busca/Basico" titulo="Páginas e busca no servidor">
        Digite "ped" para ver as páginas; Enter chama <C>aoBuscar</C>.
      </Exemplo>
    </PaginaComponente>
  );
}
