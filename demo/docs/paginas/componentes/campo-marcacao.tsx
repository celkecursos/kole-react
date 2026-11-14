import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="campoMarcacao"
      icone="check"
      componente="CampoMarcacao"
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.campoMarcacao.textos.caixaParaEscolhasQue'))}</li>
          <li>{rico(t('docs.campoMarcacao.textos.obrigatorioMostraOAsterisco'))}</li>
          <li>{t('docs.campoMarcacao.textos.aChaveContinuaUm')}<C>{'<input type="checkbox">'}</C>{rico(t('docs.campoMarcacao.textos.comRoleSwitchO'))}</li>
        </ul>
      }
    >
      <Exemplo id="campo-marcacao/Basico" titulo={t('docs.campoMarcacao.secoes.caixaEChave')} />
    </PaginaComponente>
  );
}
