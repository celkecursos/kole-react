import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="lista"
      icone="list"
      componente="Lista"
      outros={['ItemLista']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.lista.textos.itemComOnclickVira'))}</li>
          <li>{rico(t('docs.lista.textos.comMarcacaoOItem'))}</li>
          <li>{rico(t('docs.lista.textos.numeradaUsa'))}<C>{'<ol>'}</C>{rico(t('docs.lista.textos.horizontalDeitaALista'))}</li>
        </ul>
      }
    >
      <Exemplo id="lista/Basico" titulo={t('docs.lista.secoes.itensAtivoEDesabilitado')} />
      <Exemplo id="lista/Marcacao" titulo={t('docs.lista.secoes.comCaixaERadio')} />
    </PaginaComponente>
  );
}
