import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="detalhes"
      icone="file-text"
      componente="Detalhes"
      notas={
        <ul className="doc-lista">
          <li>
            O valor pode ser texto (<C>valor</C>) ou qualquer conteúdo (<C>children</C>): status, link, badge.
          </li>
          <li>Valor vazio mostra um traço, para não deixar o rótulo solto.</li>
          <li>
            Num <C>Form</C> com <C>modo="leitura"</C>, o Salvar some e o Cancelar vira Fechar: bom para um diálogo de visualização.
          </li>
        </ul>
      }
    >
      <Exemplo id="detalhes/Basico" titulo="Coluna e linha" />
    </PaginaComponente>
  );
}
