import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Diálogo"
      icone="app-window"
      componente="Dialogo"
      resumo="Janela sobre a página para uma tarefa curta: cadastro rápido, detalhes, filtros. Pode ser central ou lateral (gaveta)."
      notas={
        <ul className="doc-lista">
          <li>
            É controlado: o app guarda o <C>aberto</C> e fecha em <C>aoFechar</C> (Esc, clique fora e o ×). Com{' '}
            <C>{'dispensavel={false}'}</C>, só os botões fecham.
          </li>
          <li>O foco entra no diálogo ao abrir, fica preso dentro dele e volta ao botão que abriu ao fechar.</li>
          <li>
            Para "tem certeza?", use <C>useConfirmacao()</C>, que já monta o diálogo de confirmação.
          </li>
          <li>
            Em telas pequenas, <C>telaCheiaAbaixo="md"</C> abre em tela cheia.
          </li>
        </ul>
      }
    >
      <Exemplo id="dialogo/Basico" titulo="Básico" />
      <Exemplo id="dialogo/Lateral" titulo="Lateral (gaveta)">
        <C>aparencia="lateral"</C> encosta o diálogo à direita; <C>tom="escuro"</C> pinta o cabeçalho com a cor da marca.
      </Exemplo>
    </PaginaComponente>
  );
}
