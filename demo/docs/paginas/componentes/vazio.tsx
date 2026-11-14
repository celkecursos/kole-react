import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="vazio"
      icone="inbox"
      componente="Vazio"
      notas={
        <ul className="doc-lista">
          <li>{t('docs.vazio.textos.digaOQueAconteceria')}</li>
          <li>{rico(t('docs.vazio.textos.tabelaEListacardsJa'))}</li>
        </ul>
      }
    >
      <Exemplo id="vazio/Basico" titulo={t('docs.vazio.secoes.comESemAcao')} />
    </PaginaComponente>
  );
}
