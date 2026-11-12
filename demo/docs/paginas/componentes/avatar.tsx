import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Avatar"
      icone="circle-user"
      componente="Avatar"
      outros={['ComBadge']}
      resumo="Foto ou iniciais de uma pessoa ou empresa, com contagem ou ponto de status no canto (ComBadge)."
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
        </ul>
      }
    >
      <Exemplo id="avatar/Basico" titulo="Foto, iniciais e badge" />
    </PaginaComponente>
  );
}
