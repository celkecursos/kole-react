import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Card"
      icone="layers"
      componente="Card"
      importar={['GrupoCards']}
      resumo="Caixa de conteúdo com título, mídia, ferramentas, ações e rodapé. Pode recolher, abrir em tela cheia, sair da tela e ser clicável."
      notas={
        <ul className="doc-lista">
          <li>
            <C>GrupoCards</C> cola os cards numa faixa só, com borda comum. Para uma grade de cards soltos, use CSS grid no app ou a{' '}
            <C>ListaCards</C>.
          </li>
          <li>
            Com <C>aoClicar</C>, o card inteiro fica clicável e focável (Enter e espaço); nesse caso, evite outros botões dentro dele.
          </li>
          <li>
            <C>cor</C> pinta o fundo e <C>borda</C> pinta só a borda, com as cores de severidade.
          </li>
          <li>
            <C>posicaoMidia</C> põe a imagem em cima, embaixo, ao lado ou de fundo (texto sobre a imagem).
          </li>
        </ul>
      }
    >
      <Exemplo id="card/Basico" titulo="Título, mídia e borda" />
      <Exemplo id="card/Ferramentas" titulo="Recolher, tela cheia e fechar" />
      <Exemplo id="card/Grupo" titulo="Grupo de cards" />
    </PaginaComponente>
  );
}
