import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="cabecalhoPagina"
      icone="panel-right"
      componente="CabecalhoPagina"
      notas={
        <ul className="doc-lista">
          <li>{t('docs.cabecalhoPagina.textos.oTituloEO')}<C>{'<h1>'}</C>{t('docs.cabecalhoPagina.textos.daPaginaUseUm')}</li>
          <li>{rico(t('docs.cabecalhoPagina.textos.trilhaTrueMontaO'))}</li>
          <li>{rico(t('docs.cabecalhoPagina.textos.asAcoesDescemPara'))}</li>
        </ul>
      }
    >
      <Exemplo id="cabecalho-pagina/Basico" titulo={t('docs.cabecalhoPagina.secoes.completo')} />
    </PaginaComponente>
  );
}
