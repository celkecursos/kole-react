import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Tela de erro"
      icone="triangle-alert"
      componente="TelaErro"
      resumo="Página de erro (401, 404, 500 ou outra) com código, explicação, detalhe técnico e as saídas possíveis."
      notas={
        <ul className="doc-lista">
          <li>Diga o que aconteceu em linguagem simples e ofereça uma saída: voltar, ir ao painel, tentar de novo, entrar de novo.</li>
          <li>
            <C>detalhe</C> é o lugar do identificador técnico, para o suporte; nunca a pilha do erro.
          </li>
          <li>
            Padrão: tela cheia, com a <C>marca</C> no topo. <C>tela="contida"</C> serve para erro dentro de uma área da página.
          </li>
          <li>
            As páginas Erro 401, 404 e 500 do menu da demo mostram a versão em tela cheia.
          </li>
        </ul>
      }
    >
      <Exemplo id="tela-erro/Basico" titulo="Não encontrada" />
      <Exemplo id="tela-erro/Servidor" titulo="Erro do servidor" />
    </PaginaComponente>
  );
}
