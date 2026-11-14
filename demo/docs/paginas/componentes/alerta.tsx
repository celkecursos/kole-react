import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="alerta"
      icone="triangle-alert"
      componente="Alerta"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.alerta.textos.dispensavelSomeSozinhoAo'))}</li>
          <li>{rico(t('docs.alerta.textos.oIconeVemDa'))}</li>
          <li>{t('docs.alerta.textos.retornoDeUmaAcao')}</li>
        </ul>
      }
    >
      <Exemplo id="alerta/Severidades" titulo={t('docs.alerta.secoes.severidades')} />
      <Exemplo id="alerta/Aparencias" titulo={t('docs.alerta.secoes.aparencias')} />
      <Exemplo id="alerta/Acoes" titulo={t('docs.alerta.secoes.comAcaoEFechar')} />
    </PaginaComponente>
  );
}
