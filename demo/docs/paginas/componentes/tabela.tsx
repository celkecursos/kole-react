import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Tabela"
      icone="table"
      componente="Tabela"
      tipos={['Coluna']}
      importar={['type Coluna', 'type Ordenacao']}
      resumo="Listagem de registros com colunas formatadas, selo de situação, ações por linha, ordenação, seleção, paginação e os estados de carregando, vazio e erro."
      notas={
        <ul className="doc-lista">
          <li>
            A tabela não ordena nem pagina sozinha: ela mostra <C>ordenacao</C> e <C>paginacao</C> e avisa por <C>aoOrdenar</C> e{' '}
            <C>aoMudarPagina</C>. Assim, o mesmo código serve para dados do servidor.
          </li>
          <li>
            <C>campo</C> aceita caminho com ponto (<C>endereco.cidade</C>). <C>formato</C> formata o valor; <C>render</C> desenha a
            célula inteira.
          </li>
          <li>
            <C>carregando</C> mostra silhuetas na primeira carga; <C>atualizando</C> esmaece a tabela já preenchida ao paginar ou
            ordenar.
          </li>
          <li>Em tela estreita, a tabela rola na horizontal dentro da própria moldura; a página não ganha rolagem lateral.</li>
          <li>
            Para registros que leem melhor como cartão (produtos, pessoas), veja a <C>ListaCards</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="tabela/Basico" titulo="Colunas, situação e ações" />
      <Exemplo id="tabela/OrdenarPaginar" titulo="Ordenação, seleção e paginação" />
      <Exemplo id="tabela/Estados" titulo="Carregando, vazia e erro" />
    </PaginaComponente>
  );
}
