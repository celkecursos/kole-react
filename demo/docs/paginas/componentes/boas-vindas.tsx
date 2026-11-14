import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="boasVindas"
      icone="house"
      componente="BoasVindas"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.boasVindas.textos.aSaudacaoUsaO'))}</li>
          <li>{rico(t('docs.boasVindas.textos.ultimoacessoAjudaAPessoa'))}</li>
        </ul>
      }
    >
      <Exemplo id="boas-vindas/Basico" titulo={t('docs.boasVindas.secoes.basico')} />
    </PaginaComponente>
  );
}
