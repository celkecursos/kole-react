import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      pagina="indicador"
      icone="chart-column"
      componente="Indicador"
      importar={['Indicadores']}
      notas={
        <ul className="doc-lista">
          <li>
            Coloque os indicadores dentro de <C>Indicadores</C>, que monta a grade e quebra as linhas no celular.
          </li>
          <li>
            <C>variacao</C> é em pontos percentuais. A cor (verde ou vermelha) segue <C>variacaoBoa</C>: em cancelamentos, cair é bom.
          </li>
          <li>
            Com <C>href</C> ou <C>aoClicar</C>, o card inteiro vira link para a listagem detalhada.
          </li>
          <li>
            <C>tendencia</C> desenha um <C>Minigrafico</C>; ele também pode ser usado sozinho, numa célula de tabela.
          </li>
        </ul>
      }
    >
      <Exemplo id="indicador/Basico" titulo="Painel de indicadores" />
    </PaginaComponente>
  );
}
