import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="campoUf"
      icone="map-pin"
      componente="CampoUf"
      outros={['CampoUfMultiplo', 'CampoCidade']}
      importar={['CampoTipoPessoa', 'type Municipio']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.campoUf.textos.campoufGuardaASigla'))}</li>
          <li>{rico(t('docs.campoUf.textos.campocidadeComBuscarporufSugere'))}</li>
          <li>{t('docs.campoUf.textos.aoTrocarAUf')}</li>
          <li>{rico(t('docs.campoUf.textos.campotipopessoaGuardaFOu'))}</li>
        </ul>
      }
    >
      <Exemplo id="campo-uf/Basico" titulo={t('docs.campoUf.secoes.basico')} />
    </PaginaComponente>
  );
}
