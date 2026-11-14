import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="placa"
      icone="truck"
      componente="Placa"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.placa.textos.oNumeroSaiSempre'))}</li>
          <li>{rico(t('docs.placa.textos.oLeitorDeTela'))}</li>
        </ul>
      }
    >
      <Exemplo id="placa/Basico" titulo={t('docs.placa.secoes.basico')} />
    </PaginaComponente>
  );
}
