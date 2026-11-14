import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="citacao"
      icone="message-square"
      componente="Citacao"
      notas={
        <ul className="doc-lista">
          <li>
            Usa <C>{'<blockquote>'}</C> e <C>{'<cite>'}</C>: o leitor de tela anuncia que é uma citação.
          </li>
          <li>
            Depoimento de cliente no site público é o <C>CardDepoimento</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="citacao/Basico" titulo="Simples e cartão" />
    </PaginaComponente>
  );
}
