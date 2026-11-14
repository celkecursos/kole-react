import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="badge"
      icone="tag"
      componente="Badge"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.badge.textos.paraASituacaoDe'))}</li>
          <li>{rico(t('docs.badge.textos.contagemNoCantoDe'))}</li>
          <li>{t('docs.badge.textos.aCorSozinhaNao')}</li>
        </ul>
      }
    >
      <Exemplo id="badge/Cores" titulo={t('docs.badge.secoes.cores')} />
      <Exemplo id="badge/Aparencias" titulo={t('docs.badge.secoes.aparenciaFormatoETamanho')} />
      <Exemplo id="badge/EmTitulo" titulo={t('docs.badge.secoes.emTitulosEBotoes')}>{rico(t('docs.badge.textos.tamanhoHerdarAcompanhaO'))}</Exemplo>
    </PaginaComponente>
  );
}
