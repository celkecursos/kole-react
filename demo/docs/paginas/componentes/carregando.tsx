import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="carregando"
      icone="loader-circle"
      componente="Carregando"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.carregando.textos.bloqueanteEParaQuando'))}</li>
          <li>{rico(t('docs.carregando.textos.naPrimeiraCargaDe'))}</li>
          <li>{rico(t('docs.carregando.textos.temRoleStatusO'))}</li>
        </ul>
      }
    >
      <Exemplo id="carregando/Basico" titulo={t('docs.carregando.secoes.emAreaEBloqueante')} />
    </PaginaComponente>
  );
}
