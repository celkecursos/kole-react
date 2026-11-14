import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="paginacao"
      icone="chevrons-right"
      componente="Paginacao"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.paginacao.textos.aTabelaEA'))}</li>
          <li>{rico(t('docs.paginacao.textos.paginaComecaEm1'))}</li>
          <li>{rico(t('docs.paginacao.textos.semAomudartamanhoAEscolha'))}</li>
        </ul>
      }
    >
      <Exemplo id="paginacao/Basico" titulo={t('docs.paginacao.secoes.basico')} />
    </PaginaComponente>
  );
}
