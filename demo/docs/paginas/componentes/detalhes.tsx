import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="detalhes"
      icone="file-text"
      componente="Detalhes"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.detalhes.textos.oValorPodeSer'))}</li>
          <li>{t('docs.detalhes.textos.valorVazioMostraUm')}</li>
          <li>{rico(t('docs.detalhes.textos.numFormComModo'))}</li>
        </ul>
      }
    >
      <Exemplo id="detalhes/Basico" titulo={t('docs.detalhes.secoes.colunaELinha')} />
    </PaginaComponente>
  );
}
