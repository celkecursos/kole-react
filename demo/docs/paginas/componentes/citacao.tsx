import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="citacao"
      icone="message-square"
      componente="Citacao"
      notas={
        <ul className="doc-lista">
          <li>{t('docs.citacao.textos.usa')}<C>{'<blockquote>'}</C> e <C>{'<cite>'}</C>{t('docs.citacao.textos.oLeitorDeTela')}</li>
          <li>{rico(t('docs.citacao.textos.depoimentoDeClienteNo'))}</li>
        </ul>
      }
    >
      <Exemplo id="citacao/Basico" titulo={t('docs.citacao.secoes.simplesECartao')} />
    </PaginaComponente>
  );
}
