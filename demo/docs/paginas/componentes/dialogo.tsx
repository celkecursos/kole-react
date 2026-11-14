import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="dialogo"
      icone="app-window"
      componente="Dialogo"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.dialogo.textos.eControladoOApp'))}</li>
          <li>{t('docs.dialogo.textos.oFocoEntraNo')}</li>
          <li>{rico(t('docs.dialogo.textos.paraTemCertezaUse'))}</li>
          <li>{rico(t('docs.dialogo.textos.emTelasPequenasTelacheiaabaixo'))}</li>
        </ul>
      }
    >
      <Exemplo id="dialogo/Basico" titulo={t('docs.dialogo.secoes.basico')} />
      <Exemplo id="dialogo/Lateral" titulo={t('docs.dialogo.secoes.lateralGaveta')}>{rico(t('docs.dialogo.textos.aparenciaLateralEncostaO'))}</Exemplo>
    </PaginaComponente>
  );
}
