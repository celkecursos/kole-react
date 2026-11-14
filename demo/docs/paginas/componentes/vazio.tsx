import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="vazio"
      icone="inbox"
      componente="Vazio"
      notas={
        <ul className="doc-lista">
          <li>Diga o que aconteceria aqui e qual é o próximo passo; quando houver, ofereça a ação em botão.</li>
          <li>
            <C>Tabela</C> e <C>ListaCards</C> já têm o estado vazio pelas props <C>vazioTitulo</C>, <C>vazioDescricao</C> e{' '}
            <C>vazioAcoes</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="vazio/Basico" titulo="Com e sem ação" />
    </PaginaComponente>
  );
}
