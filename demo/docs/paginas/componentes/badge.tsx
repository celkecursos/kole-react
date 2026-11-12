import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Badge"
      icone="tag"
      componente="Badge"
      resumo="Etiqueta curta para contagem, categoria ou novidade."
      notas={
        <ul className="doc-lista">
          <li>
            Para a situação de um registro (pago, cancelado) numa tabela, prefira a <C>severidade</C> da coluna da <C>Tabela</C>, que já
            desenha o selo.
          </li>
          <li>
            Contagem no canto de um avatar ou ícone é o <C>ComBadge</C>.
          </li>
          <li>A cor sozinha não comunica: o texto do badge precisa dizer o que ele significa.</li>
        </ul>
      }
    >
      <Exemplo id="badge/Cores" titulo="Cores" />
      <Exemplo id="badge/Aparencias" titulo="Aparência, formato e tamanho" />
      <Exemplo id="badge/EmTitulo" titulo="Em títulos e botões">
        <C>tamanho="herdar"</C> acompanha o texto em volta; <C>aparencia="inverso"</C> fica legível sobre um botão sólido.
      </Exemplo>
    </PaginaComponente>
  );
}
