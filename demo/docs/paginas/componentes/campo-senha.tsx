import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="campoSenha"
      icone="key"
      componente="CampoSenha"
      importar={['type PoliticaSenha']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.campoSenha.textos.noLoginDeixeSem'))}</li>
          <li>{rico(t('docs.campoSenha.textos.emTrocaDeSenha'))}</li>
          <li>{rico(t('docs.campoSenha.textos.comForcaAPolitica'))}</li>
        </ul>
      }
    >
      <Exemplo id="campo-senha/Basico" titulo={t('docs.campoSenha.secoes.loginETrocaDe')} />
    </PaginaComponente>
  );
}
