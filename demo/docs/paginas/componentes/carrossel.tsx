import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="carrossel"
      icone="image"
      componente="Carrossel"
      importar={['type SlideCarrossel']}
      notas={
        <ul className="doc-lista">
          <li>{t('docs.carrossel.textos.aTrocaAutomaticaPausa')}</li>
          <li>{t('docs.carrossel.textos.informacaoImportanteNaoDeve')}</li>
          <li>{rico(t('docs.carrossel.textos.cadaSlidePrecisaDe'))}</li>
        </ul>
      }
    >
      <Exemplo id="carrossel/Basico" titulo={t('docs.carrossel.secoes.comControlesEIndicadores')} />
    </PaginaComponente>
  );
}
