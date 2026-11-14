import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="navegadorPeriodo"
      icone="calendar-range"
      componente="NavegadorPeriodo"
      tipos={['Periodo', 'AtalhoPeriodo']}
      importar={['periodoDe', 'type Periodo']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.navegadorPeriodo.textos.periodoETipoDe'))}</li>
          <li>{rico(t('docs.navegadorPeriodo.textos.utilitariosPeriododeMesTrimestre'))}</li>
          <li>{rico(t('docs.navegadorPeriodo.textos.atalhosTrocaALista'))}</li>
        </ul>
      }
    >
      <Exemplo id="navegador-periodo/Basico" titulo={t('docs.navegadorPeriodo.secoes.mesAMesAtalhos')} />
    </PaginaComponente>
  );
}
