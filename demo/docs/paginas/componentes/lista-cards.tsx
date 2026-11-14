import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="listaCards"
      icone="layout-grid"
      componente="ListaCards"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.listaCards.textos.cardDesenhaCadaItem'))}</li>
          <li>{rico(t('docs.listaCards.textos.alturacardEAAltura'))}</li>
          <li>{rico(t('docs.listaCards.textos.useQuandoORegistro'))}</li>
        </ul>
      }
    >
      <Exemplo id="lista-cards/Basico" titulo={t('docs.listaCards.secoes.basicoComPaginacao')} />
    </PaginaComponente>
  );
}
