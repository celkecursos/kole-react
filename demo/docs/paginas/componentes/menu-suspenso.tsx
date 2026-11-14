import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="menuSuspenso"
      icone="chevron-down"
      componente="MenuSuspenso"
      tipos={['ItemMenuSuspenso']}
      importar={['type ItemMenuSuspenso']}
      notas={
        <ul className="doc-lista">
          <li>{t('docs.menuSuspenso.textos.abreComCliqueEnter')}</li>
          <li>{rico(t('docs.menuSuspenso.textos.itemComHrefVira'))}</li>
          <li>{rico(t('docs.menuSuspenso.textos.paraUmGatilhoProprio'))}</li>
        </ul>
      }
    >
      <Exemplo id="menu-suspenso/Basico" titulo={t('docs.menuSuspenso.secoes.basico')} />
      <Exemplo id="menu-suspenso/Dividido" titulo={t('docs.menuSuspenso.secoes.botaoDividido')} />
    </PaginaComponente>
  );
}
