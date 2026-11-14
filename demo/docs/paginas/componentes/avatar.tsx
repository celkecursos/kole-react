import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="avatar"
      icone="circle-user"
      componente="Avatar"
      outros={['ComBadge', 'GrupoAvatares']}
      tipos={['PessoaAvatar']}
      notas={
        <ul className="doc-lista">
          <li>
            Sem <C>foto</C>, ou se a imagem falhar, mostra as <C>iniciais</C> do <C>nome</C>.
          </li>
          <li>
            O <C>nome</C> vira o texto alternativo. Passe sempre, mesmo com foto.
          </li>
          <li>
            <C>ComBadge</C> vale para qualquer elemento (ícone, botão). A <C>descricao</C> é o que o leitor de tela anuncia ("5
            mensagens não lidas"); acima de <C>max</C>, vira "99+".
          </li>
          <li>
            <C>GrupoAvatares</C> mostra até <C>max</C> pessoas (padrão: 3) e junta o resto em "+N". O leitor de tela ouve o <C>rotulo</C> seguido de
            todos os nomes ("Responsáveis: Ana, Bruno e Carla").
          </li>
        </ul>
      }
    >
      <Exemplo id="avatar/Basico" titulo="Foto, iniciais e badge" />
      <Exemplo id="avatar/Grupo" titulo="Grupo de avatares" />
    </PaginaComponente>
  );
}
