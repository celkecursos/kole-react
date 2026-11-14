import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="escolha"
      icone="list"
      componente="Escolha"
      notas={
        <ul className="doc-lista">
          <li>{t('docs.escolha.textos.segmentadoParaDuasA')}</li>
          <li>{rico(t('docs.escolha.textos.asSetasMudamA'))}</li>
          <li>{rico(t('docs.escolha.textos.comMaisDeCinco'))}</li>
        </ul>
      }
    >
      <Exemplo id="escolha/Basico" titulo={t('docs.escolha.secoes.segmentadoERadio')} />
    </PaginaComponente>
  );
}
