import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="indicador"
      icone="chart-column"
      componente="Indicador"
      importar={['Indicadores']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.indicador.textos.coloqueOsIndicadoresDentro'))}</li>
          <li>{rico(t('docs.indicador.textos.variacaoEEmPontos'))}</li>
          <li>{rico(t('docs.indicador.textos.comHrefOuAoclicar'))}</li>
          <li>{rico(t('docs.indicador.textos.tendenciaDesenhaUmMinigrafico'))}</li>
        </ul>
      }
    >
      <Exemplo id="indicador/Basico" titulo={t('docs.indicador.secoes.painelDeIndicadores')} />
    </PaginaComponente>
  );
}
