import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="chip"
      icone="tag"
      componente="Chip"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.chip.textos.comAoremoverApareceO'))}</li>
          <li>{rico(t('docs.chip.textos.osFiltrosJaDesenham'))}</li>
        </ul>
      }
    >
      <Exemplo id="chip/Basico" titulo={t('docs.chip.secoes.removiveis')} />
    </PaginaComponente>
  );
}
