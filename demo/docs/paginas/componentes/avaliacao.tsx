import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="avaliacao"
      icone="star"
      componente="Avaliacao"
      notas={
        <ul className="doc-lista">
          <li>
            O <C>rotulo</C> é obrigatório: dá nome ao grupo de rádios que está por trás das estrelas.
          </li>
          <li>Cada estrela é um rádio nativo: Tab entra no grupo e as setas mudam a nota.</li>
          <li>
            Com <C>aoMudar</C> devolvendo uma Promise, o componente fica ocupado até a resposta e mostra o <C>textoOcupado</C>.
          </li>
        </ul>
      }
    >
      <Exemplo id="avaliacao/Basico" titulo="Variações" />
      <Exemplo id="avaliacao/Servidor" titulo="Salvando no servidor" />
    </PaginaComponente>
  );
}
