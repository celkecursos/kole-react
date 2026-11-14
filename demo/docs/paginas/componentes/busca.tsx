import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="busca"
      icone="search"
      componente="Busca"
      importar={['type ItemBusca']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.busca.textos.aEstruturaJaTraz'))}</li>
          <li>{rico(t('docs.busca.textos.soPodeHaverUm'))}</li>
          <li>{t('docs.busca.textos.aBuscaIgnoraAcentos')}</li>
        </ul>
      }
    >
      <Exemplo id="busca/Basico" titulo={t('docs.busca.secoes.paginasEBuscaNo')}>{rico(t('docs.busca.textos.digitePedParaVer'))}</Exemplo>
    </PaginaComponente>
  );
}
