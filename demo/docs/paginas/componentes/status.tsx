import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="status"
      icone="circle-check"
      componente="Status"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.status.textos.naTabelaAProp'))}</li>
          <li>{rico(t('docs.status.textos.statusESituacaoEstado'))}</li>
          <li>{t('docs.status.textos.mantenhaAMesmaSeveridade')}</li>
        </ul>
      }
    >
      <Exemplo id="status/Basico" titulo={t('docs.status.secoes.severidades')} />
    </PaginaComponente>
  );
}
