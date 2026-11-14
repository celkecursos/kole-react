import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="balao"
      icone="message-square"
      componente="Balao"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.balao.textos.comOGatilhoPadrao'))}</li>
          <li>{rico(t('docs.balao.textos.fraseCurtaQueSo'))}</li>
          <li>{rico(t('docs.balao.textos.oBalaoTrocaDe'))}</li>
        </ul>
      }
    >
      <Exemplo id="balao/Basico" titulo={t('docs.balao.secoes.cliqueEPassar')} />
    </PaginaComponente>
  );
}
