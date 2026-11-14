import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="campoBusca"
      icone="search"
      componente="CampoBusca"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.campoBusca.textos.buscarDevolveUmaPromise'))}</li>
          <li>{rico(t('docs.campoBusca.textos.pararotuloEOTexto'))}</li>
          <li>{rico(t('docs.campoBusca.textos.textoDigitadoSemEscolher'))}</li>
          <li>{rico(t('docs.campoBusca.textos.paraOpcoesFixasE'))}</li>
        </ul>
      }
    >
      <Exemplo id="campo-busca/Basico" titulo={t('docs.campoBusca.secoes.basico')}>{t('docs.campoBusca.textos.digiteMerParaVer')}</Exemplo>
    </PaginaComponente>
  );
}
