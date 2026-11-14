import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="campoSelect"
      icone="chevron-down"
      componente="CampoSelect"
      outros={['CampoSelectMultiplo']}
      importar={['type Opcao']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.campoSelect.textos.oValorEO'))}<C>{'CampoSelect<number>'}</C>{rico(t('docs.campoSelect.textos.eNullQuandoNada'))}</li>
          <li>{rico(t('docs.campoSelect.textos.combuscaValeAPena'))}</li>
          <li>{t('docs.campoSelect.textos.tecladoSetasHomeE')}</li>
          <li>{rico(t('docs.campoSelect.textos.ateUmasCincoOpcoes'))}</li>
        </ul>
      }
    >
      <Exemplo id="campo-select/Basico" titulo={t('docs.campoSelect.secoes.umaOuVariasOpcoes')} />
      <Exemplo id="campo-select/Inline" titulo={t('docs.campoSelect.secoes.emBarraDeFiltro')} />
    </PaginaComponente>
  );
}
