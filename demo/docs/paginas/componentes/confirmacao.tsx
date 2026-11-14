import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="confirmacao"
      icone="circle-question-mark"
      componente="useConfirmacao"
      semPropsProprias
      tipos={['OpcoesConfirmacao']}
      importar={['type OpcoesConfirmacao']}
      notas={
        <ul className="doc-lista">
          <li>
            O <C>ProvedorUi</C> já inclui o <C>ProvedorConfirmacao</C>: no app, basta <C>useConfirmacao()</C>.
          </li>
          <li>
            <C>confirmar.remover</C> é sempre vermelho e com lixeira, para a exclusão parecer igual em todo o sistema.
          </li>
          <li>
            <C>confirmar.avisar</C> tem um botão só (OK) e devolve uma Promise que resolve ao fechar.
          </li>
          <li>Esc e clique fora contam como recusar.</li>
        </ul>
      }
    >
      <Exemplo id="confirmacao/Basico" titulo="Confirmar, remover e avisar" />
    </PaginaComponente>
  );
}
