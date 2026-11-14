import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="acordeao"
      icone="list"
      componente="Acordeao"
      outros={['ItemAcordeao']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.acordeao.textos.porPadraoAbrirUm'))}</li>
          <li>{rico(t('docs.acordeao.textos.padraoabertosDefineOsAbertos'))}</li>
          <li>{rico(t('docs.acordeao.textos.oTituloEUm'))}</li>
        </ul>
      }
    >
      <Exemplo id="acordeao/Basico" titulo={t('docs.acordeao.secoes.basico')} />
      <Exemplo id="acordeao/Variantes" titulo={t('docs.acordeao.secoes.variantes')} />
    </PaginaComponente>
  );
}
