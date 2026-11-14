import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="confirmacao"
      icone="circle-question-mark"
      componente="useConfirmacao"
      semPropsProprias
      tipos={['OpcoesConfirmacao']}
      importar={['type OpcoesConfirmacao']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.confirmacao.textos.oProvedoruiJaInclui'))}</li>
          <li>{rico(t('docs.confirmacao.textos.confirmarRemoverESempre'))}</li>
          <li>{rico(t('docs.confirmacao.textos.confirmarAvisarTemUm'))}</li>
          <li>{t('docs.confirmacao.textos.escECliqueFora')}</li>
        </ul>
      }
    >
      <Exemplo id="confirmacao/Basico" titulo={t('docs.confirmacao.secoes.confirmarRemoverEAvisar')} />
    </PaginaComponente>
  );
}
