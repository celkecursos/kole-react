import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="skeleton"
      icone="square"
      componente="Skeleton"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.skeleton.textos.eDecorativoAriaHidden'))}</li>
          <li>{t('docs.skeleton.textos.facaASilhuetaDo')}</li>
          <li>{rico(t('docs.skeleton.textos.tabelaEListacardsJa'))}</li>
        </ul>
      }
    >
      <Exemplo id="skeleton/Basico" titulo={t('docs.skeleton.secoes.cartaoCarregando')} />
    </PaginaComponente>
  );
}
