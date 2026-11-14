import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="trilha"
      icone="chevrons-right"
      componente="Trilha"
      importar={['type ItemTrilha']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.trilha.textos.dentroDaEstruturaPrefira'))}<C>{'<CabecalhoPagina trilha />'}</C>{t('docs.trilha.textos.queMontaOCaminho')}</li>
          <li>{rico(t('docs.trilha.textos.oUltimoItemE'))}</li>
          <li>{rico(t('docs.trilha.textos.aAparenciaPodeValer'))}</li>
        </ul>
      }
    >
      <Exemplo id="trilha/Basico" titulo={t('docs.trilha.secoes.separadoresEAparencias')} />
    </PaginaComponente>
  );
}
