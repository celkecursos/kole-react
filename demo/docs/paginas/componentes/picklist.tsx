import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="picklist"
      icone="arrow-up-down"
      componente="Picklist"
      importar={['type PicklistValor']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.picklist.textos.oValorGuardaAs'))}</li>
          <li>{t('docs.picklist.textos.cliqueSelecionaCtrlPara')}</li>
          <li>{rico(t('docs.picklist.textos.paraObjetosPassePararotulo'))}</li>
        </ul>
      }
    >
      <Exemplo id="picklist/Basico" titulo={t('docs.picklist.secoes.basicoComFiltro')} />
    </PaginaComponente>
  );
}
