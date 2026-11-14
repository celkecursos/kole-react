import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="telaErro"
      icone="triangle-alert"
      componente="TelaErro"
      notas={
        <ul className="doc-lista">
          <li>{t('docs.telaErro.textos.digaOQueAconteceu')}</li>
          <li>{rico(t('docs.telaErro.textos.detalheEOLugar'))}</li>
          <li>{rico(t('docs.telaErro.textos.padraoTelaCheiaCom'))}</li>
          <li>{t('docs.telaErro.textos.asPaginasErro401')}</li>
        </ul>
      }
    >
      <Exemplo id="tela-erro/Basico" titulo={t('docs.telaErro.secoes.naoEncontrada')} />
      <Exemplo id="tela-erro/Servidor" titulo={t('docs.telaErro.secoes.erroDoServidor')} />
    </PaginaComponente>
  );
}
