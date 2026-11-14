import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="progresso"
      icone="chart-column"
      componente="Progresso"
      importar={['type SegmentoProgresso']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.progresso.textos.passeSempreRotuloE'))}</li>
          <li>{rico(t('docs.progresso.textos.formatarTrocaOTexto'))}</li>
          <li>{rico(t('docs.progresso.textos.semSaberQuantoFalta'))}</li>
        </ul>
      }
    >
      <Exemplo id="progresso/Basico" titulo={t('docs.progresso.secoes.variacoes')} />
    </PaginaComponente>
  );
}
