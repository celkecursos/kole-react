import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="valor"
      icone="banknote"
      componente="Valor"
      outros={['ProvedorValores', 'BotaoOcultarValores']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.valor.textos.guardeOsValoresSempre'))}</li>
          <li>{rico(t('docs.valor.textos.todoValorDentroDe'))}</li>
          <li>{rico(t('docs.valor.textos.formatarmoedaUsaOSinal'))}</li>
        </ul>
      }
    >
      <Exemplo id="valor/Basico" titulo={t('docs.valor.secoes.sentidoTamanhosEOcultar')} />
      <Exemplo id="valor/Formatar" titulo={t('docs.valor.secoes.formatadores')} />
    </PaginaComponente>
  );
}
