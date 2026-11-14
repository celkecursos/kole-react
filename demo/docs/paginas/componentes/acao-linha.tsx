import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="acaoLinha"
      icone="pencil"
      componente="AcaoLinha"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.acaoLinha.textos.useDentroDaProp'))}</li>
          <li>{rico(t('docs.acaoLinha.textos.oRotuloEObrigatorio'))}</li>
          <li>{t('docs.acaoLinha.textos.mantenhaAMesmaOrdem')}</li>
        </ul>
      }
    >
      <Exemplo id="acao-linha/Basico" titulo={t('docs.acaoLinha.secoes.basico')} />
    </PaginaComponente>
  );
}
