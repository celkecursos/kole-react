import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="progresso"
      icone="chart-column"
      componente="Progresso"
      importar={['type SegmentoProgresso']}
      notas={
        <ul className="doc-lista">
          <li>
            Passe sempre <C>rotulo</C>: é o nome da barra (<C>role="progressbar"</C>) para o leitor de tela.
          </li>
          <li>
            <C>formatar</C> troca o texto do valor (ex.: "3 de 8 etapas"). <C>marcos</C> desenha marcas na trilha.
          </li>
          <li>
            Sem saber quanto falta, use <C>Girador</C> ou <C>Carregando</C> em vez de uma barra que não anda.
          </li>
        </ul>
      }
    >
      <Exemplo id="progresso/Basico" titulo="Variações" />
    </PaginaComponente>
  );
}
