import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="graficos"
      icone="chart-line"
      componente="GraficoLinha"
      outros={['GraficoBarras', 'GraficoCombinado', 'GraficoDispersao', 'GraficoRosca', 'MapaCalor', 'Minigrafico']}
      tipos={['SerieGrafico', 'EixoXGrafico', 'EixoGrafico']}
      importar={['type DadoGrafico', 'type CelulaMapaCalor']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.graficos.textos.dadosEUmaLista'))}</li>
          <li>{rico(t('docs.graficos.textos.tituloEDescricaoViram'))}</li>
          <li>{rico(t('docs.graficos.textos.graficoroscaMostraAParticipacao'))}</li>
          <li>{rico(t('docs.graficos.textos.noGraficocombinadoALinha'))}</li>
          <li>{rico(t('docs.graficos.textos.valorNullEFalta'))}</li>
          <li>{rico(t('docs.graficos.textos.asCoresVemDos'))}</li>
        </ul>
      }
    >
      <Exemplo id="graficos/Linha" titulo={t('docs.graficos.secoes.linhaComAreaE')} />
      <Exemplo id="graficos/Barras" titulo={t('docs.graficos.secoes.barras')} />
      <Exemplo id="graficos/Combinado" titulo={t('docs.graficos.secoes.barrasELinhaDois')} />
      <Exemplo id="graficos/Rosca" titulo={t('docs.graficos.secoes.roscaParticipacaoPorCategoria')} />
      <Exemplo id="graficos/MapaCalor" titulo={t('docs.graficos.secoes.mapaDeCalor')} />
    </PaginaComponente>
  );
}
