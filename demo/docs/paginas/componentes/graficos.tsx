import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Gráficos"
      icone="chart-line"
      componente="GraficoLinha"
      outros={['GraficoBarras', 'GraficoCombinado', 'GraficoDispersao', 'GraficoRosca', 'MapaCalor', 'Minigrafico']}
      tipos={['SerieGrafico', 'EixoXGrafico', 'EixoGrafico']}
      importar={['type DadoGrafico', 'type CelulaMapaCalor']}
      resumo="Gráficos em SVG próprio, sem biblioteca externa: linha, barras, combinado (barras e linha com dois eixos), dispersão, rosca e mapa de calor. Seguem o tema e a densidade."
      notas={
        <ul className="doc-lista">
          <li>
            <C>dados</C> é uma lista de objetos; <C>eixoX.chave</C> e cada <C>series[].chave</C> apontam para os campos. Datas em ISO
            (<C>2026-06</C> ou <C>2026-06-15</C>) com <C>tipo: 'data'</C>.
          </li>
          <li>
            <C>titulo</C> e <C>descricao</C> viram o nome e a descrição do gráfico para leitor de tela. O botão de ver dados (
            <C>verDados</C>, ligado por padrão) alterna para uma tabela com os mesmos números.
          </li>
          <li>
            <C>GraficoRosca</C> mostra a participação de cada parte: a fatia ativa (mouse, toque ou setas) aparece no meio do anel, a
            legenda traz valor e porcentagem e esconde fatias, <C>maxFatias</C> junta as menores em “Outros” e <C>aoEscolher</C> recebe o
            clique ou o Enter numa fatia.
          </li>
          <li>
            No <C>GraficoCombinado</C>, a linha com <C>eixo: 'esquerdo'</C> divide o eixo das barras e o eixo direito não aparece.
          </li>
          <li>
            Valor <C>null</C> é falta de dado: a linha se interrompe em vez de cair a zero.
          </li>
          <li>
            As cores vêm dos tokens <C>--graf-1</C> a <C>--graf-6</C> (séries), <C>--graf-pos</C>/<C>--graf-neg</C> (barras divergentes)
            e <C>--graf-seq-1</C> a <C>--graf-seq-5</C> (mapa de calor), com versão para o tema escuro.
          </li>
        </ul>
      }
    >
      <Exemplo id="graficos/Linha" titulo="Linha com área e meta" />
      <Exemplo id="graficos/Barras" titulo="Barras" />
      <Exemplo id="graficos/Combinado" titulo="Barras e linha, dois eixos" />
      <Exemplo id="graficos/Rosca" titulo="Rosca: participação por categoria" />
      <Exemplo id="graficos/MapaCalor" titulo="Mapa de calor" />
    </PaginaComponente>
  );
}
