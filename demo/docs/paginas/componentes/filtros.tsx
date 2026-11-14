import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="filtros"
      icone="funnel"
      componente="Filtros"
      importar={['type FiltroAplicado']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.filtros.textos.separeORascunhoO'))}</li>
          <li>{t('docs.filtros.textos.eUm')}<C>{'<form>'}</C>{t('docs.filtros.textos.enterEmQualquerCampo')}</li>
          <li>{rico(t('docs.filtros.textos.useOsCamposCom'))}</li>
          <li>{rico(t('docs.filtros.textos.cadaChipRemoveO'))}</li>
        </ul>
      }
    >
      <Exemplo id="filtros/Basico" titulo={t('docs.filtros.secoes.basico')}>{t('docs.filtros.textos.mudeUmCampoPara')}</Exemplo>
    </PaginaComponente>
  );
}
