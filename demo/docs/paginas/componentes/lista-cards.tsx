import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="listaCards"
      icone="layout-grid"
      componente="ListaCards"
      notas={
        <ul className="doc-lista">
          <li>
            <C>card</C> desenha cada item; a grade se ajusta à largura pela <C>larguraMin</C> de cada card.
          </li>
          <li>
            <C>alturaCard</C> é a altura das silhuetas enquanto carrega, para a página não pular quando os dados chegam.
          </li>
          <li>
            Use quando o registro tem imagem ou poucos campos; com muitas colunas para comparar, a <C>Tabela</C> é melhor.
          </li>
        </ul>
      }
    >
      <Exemplo id="lista-cards/Basico" titulo="Básico com paginação" />
    </PaginaComponente>
  );
}
