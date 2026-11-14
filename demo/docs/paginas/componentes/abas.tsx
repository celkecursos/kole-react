import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="abas"
      icone="panel-right"
      componente="Abas"
      outros={['Aba']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.abas.textos.semAtivaComecaNa'))}</li>
          <li>{t('docs.abas.textos.tecladoSetasTrocamDe')}</li>
          <li>{rico(t('docs.abas.textos.todosOsPaineisFicam'))}</li>
          <li>{rico(t('docs.abas.textos.orientacaoResponsivaEmpilhaAs'))}</li>
        </ul>
      }
    >
      <Exemplo id="abas/Basico" titulo={t('docs.abas.secoes.basico')} />
      <Exemplo id="abas/Variantes" titulo={t('docs.abas.secoes.pilulasESegmentado')} />
    </PaginaComponente>
  );
}
