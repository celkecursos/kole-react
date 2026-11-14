import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="referencias"
      icone="link"
      componente="Referencias"
      importar={['type ItemReferencia']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.referencias.textos.combinaComAMensagem'))}</li>
          <li>{rico(t('docs.referencias.textos.oTrechoLongoFica'))}</li>
        </ul>
      }
    >
      <Exemplo id="referencias/Basico" titulo={t('docs.referencias.secoes.basico')} />
    </PaginaComponente>
  );
}
